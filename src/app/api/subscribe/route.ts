import { NextResponse } from 'next/server'
import { PUBLIC_FORM_RATE_LIMIT, checkRequestRateLimit } from '@/lib/rate-limit'
import { verifyTurnstileToken } from '@/lib/turnstile'

export async function POST(request: Request) {
  const rate = await checkRequestRateLimit(request, PUBLIC_FORM_RATE_LIMIT)
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const language = typeof body.language === 'string' ? body.language : 'hr'

    if (!(await verifyTurnstileToken(body.turnstileToken))) {
      return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 400 })
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
