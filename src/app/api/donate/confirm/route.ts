import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { invokeEdgeFunction } from '@/lib/supabase/edge-fn'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rate = checkRateLimit('donate-confirm', getClientIp(request), 20, 15 * 60 * 1000)
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Previše zahtjeva. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  try {
    const body = await request.json()
    const sessionId = String(body.sessionId ?? '').trim()
    if (!sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Neispravan session ID' }, { status: 400 })
    }

    const result = await invokeEdgeFunction<{ ok?: boolean; error?: string }>('donation-confirm', {
      sessionId,
    })

    if (!result.configured) {
      return NextResponse.json({ error: 'Supabase nije konfiguriran' }, { status: 500 })
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: result.data.error ?? 'Potvrda nije uspjela' },
        { status: result.status },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Neispravan zahtjev' }, { status: 400 })
  }
}
