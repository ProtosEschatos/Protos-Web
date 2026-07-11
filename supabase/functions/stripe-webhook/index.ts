import { createClient } from 'jsr:@supabase/supabase-js@2'

type StripeEvent = {
  type: string
  data: { object: Record<string, unknown> }
}

async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  const parts = header.split(',').map((p) => p.split('=') as [string, string])
  const timestamp = parts.find(([k]) => k === 't')?.[1]
  const signatures = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!timestamp || signatures.length === 0) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signed = `${timestamp}.${payload}`
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')

  return signatures.some((sig) => sig === expected)
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')?.trim()
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET missing')
    return new Response('Webhook not configured', { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  const body = await req.text()
  const valid = await verifyStripeSignature(body, signature, webhookSecret)
  if (!valid) {
    console.error('[stripe-webhook] invalid signature')
    return new Response('Invalid signature', { status: 400 })
  }

  let event: StripeEvent
  try {
    event = JSON.parse(body) as StripeEvent
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    const obj = event.data.object

    switch (event.type) {
      case 'checkout.session.completed': {
        const donationId = Number(
          (obj.metadata as Record<string, string> | undefined)?.donation_id ??
            obj.client_reference_id ??
            0,
        )
        const amountTotal =
          typeof obj.amount_total === 'number' ? obj.amount_total / 100 : null
        const sessionId = String(obj.id ?? '')
        const paymentIntent = obj.payment_intent
        const paymentIntentId =
          typeof paymentIntent === 'string'
            ? paymentIntent
            : paymentIntent && typeof paymentIntent === 'object'
              ? String((paymentIntent as { id?: string }).id ?? '')
              : null

        if (!donationId) {
          console.error('[stripe-webhook] missing donation_id', sessionId)
          break
        }

        const customerDetails = obj.customer_details as { email?: string } | undefined
        const customerEmail =
          customerDetails?.email ??
          (typeof obj.customer_email === 'string' ? obj.customer_email : undefined)

        await supabase
          .from('donations')
          .update({
            status: 'completed',
            stripe_session_id: sessionId,
            stripe_payment_intent_id: paymentIntentId,
            ...(amountTotal != null ? { amount: Math.round(amountTotal) } : {}),
            ...(customerEmail ? { email: customerEmail } : {}),
          })
          .eq('id', donationId)

        console.log('[stripe-webhook] completed donation', donationId, sessionId)
        break
      }

      case 'checkout.session.expired': {
        const donationId = Number(
          (obj.metadata as Record<string, string> | undefined)?.donation_id ??
            obj.client_reference_id ??
            0,
        )
        if (donationId) {
          await supabase
            .from('donations')
            .update({
              status: 'expired',
              stripe_session_id: String(obj.id ?? ''),
            })
            .eq('id', donationId)
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
