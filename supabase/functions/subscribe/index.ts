import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WELCOME_SUBJECT = 'Dobrodošli — Protos Web novosti'

function welcomeHtml(): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#6366f1">Pozdrav!</h2>
      <p>Uspješno ste se pretplatili na Protos Web novosti.</p>
      <p style="color:#666">Srdačan pozdrav,<br><strong>Dario Imsirović</strong><br>Protos Web</p>
    </div>
  `
}

function adminNotifyHtml(email: string, language: string, source: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#6366f1">Nova newsletter pretplata</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Jezik:</strong> ${language}</p>
      <p><strong>Izvor:</strong> ${source}</p>
      <p style="color:#666">Pregled u admin panelu → Pretplatnici.</p>
    </div>
  `
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    const record =
      body.type === 'INSERT' && body.record ? body.record : body
    const email = record.email as string | undefined
    const language = (record.language as string | undefined) || 'hr'
    const source = (record.source as string | undefined) || 'website'

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email je obavezan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const siteId =
      (record.site_id as string | undefined) ?? '4a0e4171-2f08-4969-b9e5-1ea222e298d7'

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('site_id', siteId)
      .eq('email', email)
      .maybeSingle()

    const isNewSubscriber = !existing

    const { error } = await supabase.from('subscribers').upsert(
      {
        email,
        language,
        source,
        site_id: siteId,
      },
      { onConflict: 'site_id,email' },
    )

    if (error) throw error

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const brevoKey = Deno.env.get('BREVO_API_KEY')
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'dario.admin@protosweb.eu'
    const contactEmail = Deno.env.get('CONTACT_EMAIL') || fromEmail
    const html = welcomeHtml()

    if (isNewSubscriber) {
      const adminHtml = adminNotifyHtml(email, language, source)
      const adminSubject = `Nova newsletter pretplata — ${email}`
      let adminSent = false
      if (resendKey) {
        adminSent = await sendAdminViaResend(resendKey, fromEmail, contactEmail, adminSubject, adminHtml)
      }
      if (!adminSent && brevoKey) {
        adminSent = await sendAdminViaBrevo(brevoKey, fromEmail, contactEmail, adminSubject, adminHtml)
      }
      if (adminSent) console.log('[subscribe] Admin notified')
    }

    // Newsletter welcome: Brevo primary → Resend fallback
    let sent = false
    if (brevoKey) {
      sent = await sendWelcomeViaBrevo(brevoKey, fromEmail, email, html)
      if (sent) console.log('[subscribe] Welcome sent via Brevo')
    }
    if (!sent && resendKey) {
      sent = await sendWelcomeViaResend(resendKey, fromEmail, email, html)
      if (sent) console.log('[subscribe] Welcome sent via Resend fallback')
    }

    if (!sent) {
      console.warn('[subscribe] Subscriber saved but welcome email not sent')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[subscribe] ERROR:', error)
    return new Response(JSON.stringify({ error: 'Greška pri prijavi' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function sendWelcomeViaBrevo(
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  html: string,
): Promise<boolean> {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Dario | Protos Web', email: fromEmail },
        to: [{ email: toEmail, name: toEmail.split('@')[0] }],
        subject: WELCOME_SUBJECT,
        htmlContent: html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendWelcomeViaResend(
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  html: string,
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Dario | Protos Web <${fromEmail}>`,
        to: [toEmail],
        subject: WELCOME_SUBJECT,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendAdminViaResend(
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  subject: string,
  html: string,
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Protos Web <${fromEmail}>`,
        to: [toEmail],
        subject,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function sendAdminViaBrevo(
  apiKey: string,
  fromEmail: string,
  toEmail: string,
  subject: string,
  html: string,
): Promise<boolean> {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Protos Web', email: fromEmail },
        to: [{ email: toEmail, name: 'Protos Web' }],
        subject,
        htmlContent: html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
