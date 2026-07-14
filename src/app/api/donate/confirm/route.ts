import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function POST(request: Request) {
  const rate = checkRateLimit('donate-confirm', getClientIp(request), 20, 15 * 60 * 1000)
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Previše zahtjeva. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Supabase nije konfiguriran' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const sessionId = String(body.sessionId ?? '').trim()
    if (!sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Neispravan session ID' }, { status: 400 })
    }

    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/donation-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ sessionId }),
    })

    const data = await edgeRes.json()
    if (!edgeRes.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Potvrda nije uspjela' },
        { status: edgeRes.status },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev' }, { status: 400 })
  }
}
