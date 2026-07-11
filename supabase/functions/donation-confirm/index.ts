import { createClient } from 'jsr:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17.7.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { sessionId } = (await req.json()) as { sessionId?: string }
    const id = sessionId?.trim()
    if (!id || !id.startsWith('cs_')) {
      return new Response(JSON.stringify({ error: 'Neispravan session ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: 'Stripe nije konfiguriran' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-11-20.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const session = await stripe.checkout.sessions.retrieve(id)
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Plaćanje nije završeno' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const donationId = Number(
      session.metadata?.donation_id ?? session.client_reference_id ?? 0,
    )
    if (!donationId) {
      return new Response(JSON.stringify({ error: 'Donacija nije pronađena' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const amountTotal =
      typeof session.amount_total === 'number' ? session.amount_total / 100 : null
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null
    const customerEmail =
      session.customer_details?.email ?? session.customer_email ?? undefined

    const { error } = await supabase
      .from('donations')
      .update({
        status: 'completed',
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        ...(amountTotal != null ? { amount: Math.round(amountTotal) } : {}),
        ...(customerEmail ? { email: customerEmail } : {}),
      })
      .eq('id', donationId)

    if (error) {
      console.error('[donation-confirm] update error:', error)
      return new Response(JSON.stringify({ error: 'Ažuriranje nije uspjelo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, donationId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[donation-confirm] error:', err)
    return new Response(JSON.stringify({ error: 'Neočekivana greška' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
