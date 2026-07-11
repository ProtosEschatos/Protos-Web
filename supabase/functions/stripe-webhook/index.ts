import { createClient } from 'jsr:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17.7.0'

type StripeEvent = Stripe.Event

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')?.trim()
  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')?.trim()
  if (!webhookSecret || !stripeSecret) {
    console.error('[stripe-webhook] missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY')
    return new Response('Webhook not configured', { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  const body = await req.text()

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-11-20.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event: StripeEvent
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    )
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await markDonationCompleted(supabase, session)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const donationId = donationIdFromSession(session)
        if (donationId) {
          const { error } = await supabase
            .from('donations')
            .update({
              status: 'expired',
              stripe_session_id: session.id,
            })
            .eq('id', donationId)
          if (error) console.error('[stripe-webhook] expire update error:', error)
        }
        break
      }

      default:
        console.log('[stripe-webhook] ignored event', event.type)
    }
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err)
    return new Response('Handler error', { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

function donationIdFromSession(session: Stripe.Checkout.Session): number {
  const fromMeta = session.metadata?.donation_id
  const raw = fromMeta ?? session.client_reference_id ?? '0'
  return Number(raw)
}

async function markDonationCompleted(
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session,
) {
  const donationId = donationIdFromSession(session)
  const sessionId = session.id

  if (!donationId) {
    console.error('[stripe-webhook] missing donation_id', sessionId)
    return
  }

  if (session.payment_status !== 'paid') {
    console.log('[stripe-webhook] session not paid yet', sessionId, session.payment_status)
    return
  }

  const amountTotal =
    typeof session.amount_total === 'number' ? session.amount_total / 100 : null
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? undefined

  const { error } = await supabase
    .from('donations')
    .update({
      status: 'completed',
      stripe_session_id: sessionId,
      stripe_payment_intent_id: paymentIntentId,
      ...(amountTotal != null ? { amount: Math.round(amountTotal) } : {}),
      ...(customerEmail ? { email: customerEmail } : {}),
    })
    .eq('id', donationId)

  if (error) {
    console.error('[stripe-webhook] completed update error:', error, donationId)
    throw error
  }

  console.log('[stripe-webhook] completed donation', donationId, sessionId)
}
