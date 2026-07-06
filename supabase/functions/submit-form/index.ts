import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactData {
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  language: string
}

serve(async (req) => {
  console.log('[submit-form] Incoming request:', req.method, req.url)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let data: ContactData
    let source = 'unknown'

    const rawBody = await req.text()
    console.log('[submit-form] Raw body length:', rawBody.length)

    const body = JSON.parse(rawBody)

    if (body.type === 'INSERT' && body.record) {
      data = body.record as ContactData
      source = 'webhook'
    } else {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { name, email, phone, service, message } = data

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Nedostaju obavezna polja' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY') || ''
    const brevoKey = Deno.env.get('BREVO_API_KEY') || ''
    const contactEmail = Deno.env.get('CONTACT_EMAIL') || 'dario.admin@protosweb.eu'
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'dario.admin@protosweb.eu'

    console.log('[submit-form] Source:', source, '| Name:', name, '| Email:', email)

    const adminSubject = `Nova upita — ${name} (${service || 'nije navedeno'})`
    const adminBody = adminHtml(name, email, phone, service, message)
    const replyBody = autoReplyHtml(name, message)

    // Contact: Resend (transactional) primary → Brevo fallback. Inbox = Zoho via MX on CONTACT_EMAIL.
    let sent = false
    if (resendKey) {
      sent = await sendContactViaResend(resendKey, fromEmail, contactEmail, email, name, adminSubject, adminBody, replyBody)
      if (sent) console.log('[submit-form] Sent via Resend')
    }
    if (!sent && brevoKey) {
      sent = await sendContactViaBrevo(brevoKey, fromEmail, contactEmail, email, name, adminSubject, adminBody, replyBody)
      if (sent) console.log('[submit-form] Sent via Brevo fallback')
    }

    if (!sent) {
      console.error('[submit-form] No email provider succeeded')
      return new Response(JSON.stringify({ error: 'Email provider nije dostupan' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, message: 'Poruka poslana!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[submit-form] ERROR:', error)
    return new Response(JSON.stringify({ error: 'Greška pri slanju' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function sendContactViaResend(
  apiKey: string,
  fromEmail: string,
  contactEmail: string,
  visitorEmail: string,
  visitorName: string,
  adminSubject: string,
  adminBody: string,
  replyBody: string,
): Promise<boolean> {
  try {
    const [adminRes, replyRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Protos Web <${fromEmail}>`,
          to: [contactEmail],
          subject: adminSubject,
          html: adminBody,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Dario | Protos Web <${fromEmail}>`,
          to: [visitorEmail],
          subject: 'Hvala na upitu — odgovoriti ćemo uskoro',
          html: replyBody,
        }),
      }),
    ])
    return adminRes.ok && replyRes.ok
  } catch {
    return false
  }
}

async function sendContactViaBrevo(
  apiKey: string,
  fromEmail: string,
  contactEmail: string,
  visitorEmail: string,
  visitorName: string,
  adminSubject: string,
  adminBody: string,
  replyBody: string,
): Promise<boolean> {
  try {
    const [adminRes, replyRes] = await Promise.all([
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Protos Web', email: fromEmail },
          to: [{ email: contactEmail, name: 'Protos Web' }],
          subject: adminSubject,
          htmlContent: adminBody,
        }),
      }),
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Dario | Protos Web', email: fromEmail },
          to: [{ email: visitorEmail, name: visitorName }],
          subject: 'Hvala na upitu — odgovoriti ćemo uskoro',
          htmlContent: replyBody,
        }),
      }),
    ])
    return adminRes.ok && replyRes.ok
  } catch {
    return false
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function adminHtml(
  name: string,
  email: string,
  phone: string | null,
  service: string | null,
  message: string,
) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = phone ? escapeHtml(phone) : null
  const safeService = service ? escapeHtml(service) : null
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a">
      <h2 style="color:#6366f1;margin-bottom:24px">Nova upita — Protos Web</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:120px">Ime:</td><td style="padding:8px 12px">${safeName}</td></tr>
        <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Email:</td><td style="padding:8px 12px"><a href="mailto:${safeEmail}" style="color:#6366f1">${safeEmail}</a></td></tr>
        ${safePhone ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Telefon:</td><td style="padding:8px 12px"><a href="tel:${safePhone}" style="color:#6366f1">${safePhone}</a></td></tr>` : ''}
        ${safeService ? `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Usluga:</td><td style="padding:8px 12px">${safeService}</td></tr>` : ''}
      </table>
      <h3 style="margin-top:24px;color:#6366f1">Poruka:</h3>
      <p style="padding:16px;background:#f9f9f9;border-left:4px solid #6366f1;font-size:15px;line-height:1.6">${safeMessage}</p>
    </div>
  `
}

function autoReplyHtml(name: string, message: string) {
  const safeName = escapeHtml(name)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a">
      <h2 style="color:#6366f1">Pozdrav ${safeName},</h2>
      <p style="font-size:16px;line-height:1.7">Hvala na upitu! Primili smo vašu poruku i odgovoriti ćemo u roku od 24 sata.</p>
      <h3 style="margin-top:24px;color:#6366f1">Vaš upit:</h3>
      <p style="padding:16px;background:#f9f9f9;border-left:4px solid #6366f1;font-size:15px;line-height:1.6">${safeMessage}</p>
      <p style="margin-top:32px;font-size:15px;line-height:1.7">
        Srdačan pozdrav,<br>
        <strong>Dario Imsirović</strong><br>
        Protos Web
      </p>
    </div>
  `
}
