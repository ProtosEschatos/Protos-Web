import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  getAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/auth/admin-auth'
import { checkRateLimit, getClientIp, recordFailedAttempt } from '@/lib/auth/admin-rate-limit'
import { recordAudit } from '@/lib/audit/record'

const GENERIC_ERROR = 'Neispravna lozinka ili pristup trenutno nije dostupan.'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const rate = checkRateLimit(ip)

  if (!rate.ok) {
    return NextResponse.json(
      { success: false, message: 'Previše pokušaja. Pokušaj ponovno kasnije.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 503 })
  }

  try {
    const body = await request.json()
    const password = typeof body.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      recordFailedAttempt(ip)
      await recordAudit({
        event: 'admin.login.failed',
        source: 'admin-auth',
        payload: { ip },
      })
      await delay(400)
      return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 401 })
    }

    await recordAudit({
      event: 'admin.login.ok',
      source: 'admin-auth',
      payload: { ip },
    })
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, getAdminSessionToken(), adminCookieOptions)
    return response
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 })
  }
}
