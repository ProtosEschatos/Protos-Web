import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { siteUrl } from '@/lib/seo'
import { buildLocalePath } from '@/lib/seo'

export async function POST(request: Request) {
  try {
    const paymentLink = process.env.STRIPE_DONATION_PAYMENT_LINK
    if (paymentLink) {
      return NextResponse.json({ url: paymentLink })
    }

    const secret = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.STRIPE_DONATION_PRICE_ID
    if (!secret || !priceId) {
      return NextResponse.json({ error: 'Donations not configured' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const locale = typeof body.locale === 'string' ? body.locale : 'hr'
    const base = siteUrl.replace(/\/$/, '')
    const returnPath = buildLocalePath(locale, '/o-meni')

    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}${returnPath}?donation=success`,
      cancel_url: `${base}${returnPath}`,
      metadata: { locale, cause: 'digital-balkans' },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('donate:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
