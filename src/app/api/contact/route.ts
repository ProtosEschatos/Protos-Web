import { NextResponse } from 'next/server'
import { submitContact } from '@/lib/contact/submit-contact'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rate = checkRateLimit('contact', getClientIp(request), 5, 15 * 60 * 1000)
  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: 'Previše zahtjeva. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const result = await submitContact({
      name: String(body.name),
      email: String(body.email),
      service: String(body.service || ''),
      message: String(body.message),
      language: typeof body.language === 'string' ? body.language : undefined,
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
