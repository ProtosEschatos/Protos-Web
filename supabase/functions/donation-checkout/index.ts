import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_CAUSES = new Set(['resources', 'cyber', 'education', 'platforms'])
const MIN_EUR = 1
const MAX_EUR = 1000

const ABOUT_PATHS: Record<string, string> = {
  hr: '/o-meni',
  en: '/about',
  de: '/ueber-uns',
  it: '/chi-siamo',
  es: '/sobre-nosotros',
}

function aboutPublicPath(locale: string): string {
  const about = ABOUT_PATHS[locale] ?? ABOUT_PATHS.hr
  return locale === 'hr' ? about : `/${locale}${about}`
}

type CheckoutBody = {
  amount?: number
  email?: string
  name?: string
  cause?: string
  locale?: string
  successUrl?: string
  cancelUrl?: string
}

function siteBaseUrl(): string {
  return (
    Deno.env.get('SITE_URL') ||
    Deno.env.get('NEXT_PUBLIC_SITE_URL') ||
    'https://www.protosweb.eu'
  ).replace(/\/$/, '')
}

async function createStripeCheckoutSession(params: {
  amountEur: number
  email: string
  name: string | null
  cause: string
  donationId: number
  locale: string
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string; sessionId: string } | { error: string }> {
  const secret = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
  if (!secret) return { error: 'STRIPE_SECRET_KEY nije postavljen u Supabase Edge secrets' }

  const cents = Math.round(params.amountEur * 100)
  const causeLabels: Record<string, string> = {
    resources: 'Resursi studija',
    cyber: 'Cyber sigurnost edukacija',
    education: 'Digitalna edukacija',
    platforms: 'Regionalne platforme',
  }
  const productName = `Donacija — ${causeLabels[params.cause] ?? params.cause}`

  const body = new URLSearchParams()
  body.set('mode', 'payment')
  body.set('success_url', params.successUrl)
  body.set('cancel_url', params.cancelUrl)
  body.set('customer_email', params.email)
  body.set('client_reference_id', String(params.donationId))
  body.set('metadata[donation_id]', String(params.donationId))
  body.set('metadata[cause]', params.cause)
  body.set('metadata[locale]', params.locale)
  if (params.name) body.set('metadata[donor_name]', params.name)
  body.set('line_items[0][quantity]', '1')
  body.set('line_items[0][price_data][currency]', 'eur')
  body.set('line_items[0][price_data][unit_amount]', String(cents))
  body.set('line_items[0][price_data][product_data][name]', productName)

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message ?? res.statusText
    return { error: `Stripe ${res.status}: ${msg}` }
  }

  if (!data.url || !data.id) return { error: 'Stripe nije vratio checkout URL' }
  return { url: data.url as string, sessionId: data.id as string }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = (await req.json()) as CheckoutBody
    const amountEur = Number(payload.amount)
    const email = payload.email?.trim().toLowerCase()
    const name = payload.name?.trim() || null
    const cause = payload.cause?.trim()
    const locale = payload.locale?.trim() || 'hr'

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Neispravan email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!cause || !ALLOWED_CAUSES.has(cause)) {
      return new Response(JSON.stringify({ error: 'Neispravan cilj donacije' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!Number.isFinite(amountEur) || amountEur < MIN_EUR || amountEur > MAX_EUR) {
      return new Response(
        JSON.stringify({ error: `Iznos mora biti između ${MIN_EUR} i ${MAX_EUR} EUR` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: row, error: insertError } = await supabase
      .from('donations')
      .insert({
        amount: Math.round(amountEur),
        email,
        name,
        cause,
        locale,
        currency: 'eur',
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !row) {
      console.error('[donation-checkout] insert error:', insertError)
      return new Response(JSON.stringify({ error: 'Spremanje donacije nije uspjelo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const base = siteBaseUrl()
    const aboutPath = aboutPublicPath(locale)
    const successUrl =
      payload.successUrl?.trim() ||
      `${base}${aboutPath}?donation=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl =
      payload.cancelUrl?.trim() || `${base}${aboutPath}?donation=cancelled`

    const session = await createStripeCheckoutSession({
      amountEur: Math.round(amountEur),
      email,
      name,
      cause,
      donationId: row.id,
      locale,
      successUrl,
      cancelUrl,
    })

    if ('error' in session) {
      await supabase.from('donations').update({ status: 'failed' }).eq('id', row.id)
      return new Response(JSON.stringify({ error: session.error }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: updateError } = await supabase
      .from('donations')
      .update({ stripe_session_id: session.sessionId })
      .eq('id', row.id)

    if (updateError) {
      console.error('[donation-checkout] session id update error:', updateError)
    }

    return new Response(JSON.stringify({ url: session.url, donationId: row.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[donation-checkout] error:', err)
    return new Response(JSON.stringify({ error: 'Neočekivana greška' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
