import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { invokeEdgeFunction } from '@/lib/supabase/edge-fn'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rate = checkRateLimit('subscribe', getClientIp(request), 5, 15 * 60 * 1000)
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: 'Previše zahtjeva. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const language = typeof body.language === 'string' ? body.language : 'hr'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 })
    }

    const result = await invokeEdgeFunction<{ success?: boolean; error?: string }>('subscribe', {
      email,
      language,
      source: 'website',
    })

    if (!result.configured) {
      return NextResponse.json({ success: false, message: 'Not configured' }, { status: 503 })
    }

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.data.error || 'Subscribe failed' },
        { status: result.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
  }
}
