import { NextResponse } from 'next/server'
import { submitContact } from '@/actions/contact'
import { PUBLIC_FORM_RATE_LIMIT, checkRequestRateLimit } from '@/lib/rate-limit'
import { verifyTurnstileToken } from '@/lib/turnstile'

const MAX_MESSAGE = 5000
const MAX_NAME = 200

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

    if (!(await verifyTurnstileToken(body.turnstileToken))) {
      return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 400 })
    }

    const name = String(body.name || '').trim().slice(0, MAX_NAME)
    const email = String(body.email || '').trim()
    const message = String(body.message || '').trim().slice(0, MAX_MESSAGE)
    const service = String(body.service || '').trim().slice(0, 200)
    const language = typeof body.language === 'string' ? body.language : 'hr'

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const result = await submitContact({
      name,
      email,
      service,
      message,
      language,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to submit' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message received! We will get back to you soon.',
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
  }
}
