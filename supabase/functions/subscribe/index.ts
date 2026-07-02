import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { error } = await supabase.from('subscribers').upsert(
      {
        email,
        language,
        source,
        site_id: record.site_id ?? null,
      },
      { onConflict: 'email,site_id' },
    )

    if (error) throw error

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (resendKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Dario | Protos Web <contact@protosweb.eu>',
          to: [email],
          subject: 'Dobrodošli — Protos Web novosti',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#6366f1">Pozdrav!</h2>
              <p>Uspješno ste se pretplatili na Protos Web novosti.</p>
              <p style="color:#666">Srdačan pozdrav,<br><strong>Dario Imsirović</strong><br>Protos Web</p>
            </div>
          `,
        }),
      })
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
