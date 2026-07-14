import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

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

    const supabaseUrl = getSupabaseUrl()
    const anonKey = getSupabaseAnonKey()

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ success: false, message: 'Not configured' }, { status: 503 })
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email, language, source: 'website' }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.error || 'Subscribe failed' },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
  }
}
