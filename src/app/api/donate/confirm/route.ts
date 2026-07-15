import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: Request) {
  const rate = checkRateLimit('donate-confirm', getClientIp(request), 20, 15 * 60 * 1000)
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
    const sessionId = String(body.sessionId ?? '').trim()
    if (!sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Neispravan session ID' }, { status: 400 })
    }

    const edgeRes = await fetch(`${SUPABASE_URL}/functions/v1/donation-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
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
