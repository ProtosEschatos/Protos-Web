import { NextResponse } from 'next/server'
import { aboutPublicPathForLocale } from '@/lib/routes/localized-paths'
import { DONATION_MAX_EUR, DONATION_MIN_EUR, isDonationCause } from '@/lib/donations'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.protosweb.eu').replace(/\/$/, '')
}

export async function POST(request: Request) {
  const rate = checkRateLimit('donate', getClientIp(request), 8, 15 * 60 * 1000)
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Previše zahtjeva. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase nije konfiguriran' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const amount = Number(body.amount)
    const email = String(body.email ?? '').trim()
    const name = body.name ? String(body.name).trim() : undefined
    const cause = String(body.cause ?? '').trim()
    const locale = String(body.locale ?? 'hr').trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Neispravan email' }, { status: 400 })
    }

    if (!isDonationCause(cause)) {
      return NextResponse.json({ error: 'Neispravan cilj donacije' }, { status: 400 })
    }

    if (!Number.isFinite(amount) || amount < DONATION_MIN_EUR || amount > DONATION_MAX_EUR) {
      return NextResponse.json(
        { error: `Iznos mora biti između ${DONATION_MIN_EUR} i ${DONATION_MAX_EUR} EUR` },
        { status: 400 },
      )
    }

    const base = siteBaseUrl()
    const aboutPath = aboutPublicPathForLocale(locale)
    const successUrl = `${base}${aboutPath}?donation=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${base}${aboutPath}?donation=cancelled`

    const edgeRes = await fetch(`${SUPABASE_URL}/functions/v1/donation-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ amount, email, name, cause, locale, successUrl, cancelUrl }),
    })

    const data = await edgeRes.json()
    if (!edgeRes.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Checkout nije uspio' },
        { status: edgeRes.status },
      )
    }

    if (!data.url) {
      return NextResponse.json({ error: 'Stripe URL nedostaje' }, { status: 502 })
    }

    return NextResponse.json({ url: data.url })
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev' }, { status: 400 })
  }
}
