import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  verifyAdminPassword,
} from '@/lib/auth/admin-auth'
import { checkRateLimit, getClientIp, recordFailedAttempt } from '@/lib/auth/admin-rate-limit'
import { is2FAEnabled, verifyTotpCode } from '@/lib/auth/admin-2fa'
import { createSession } from '@/lib/auth/admin-sessions'
import { recordAudit } from '@/lib/audit/record'

const GENERIC_ERROR = 'Neispravna lozinka ili pristup trenutno nije dostupan.'
const TOTP_REQUIRED = 'Unesi 6-cifreni 2FA kod iz aplikacije.'
const TOTP_INVALID = 'Neispravan 2FA kod. Pokušaj ponovno.'

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
    const totpCode = typeof body.totp === 'string' ? body.totp : ''

    if (!verifyAdminPassword(password)) {
      recordFailedAttempt(ip)
      await recordAudit({
        event: 'admin.login.failed',
        source: 'admin-auth',
        payload: { ip, reason: 'password' },
      })
      await delay(400)
      return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 401 })
    }

    // Second factor. Only enforced if `ADMIN_TOTP_SECRET` is configured — this
    // lets users adopt 2FA at their own pace after PR merge.
    if (is2FAEnabled()) {
      if (!totpCode) {
        return NextResponse.json(
          { success: false, message: TOTP_REQUIRED, needsTotp: true },
          { status: 401 },
        )
      }
      if (!verifyTotpCode(totpCode)) {
        recordFailedAttempt(ip)
        await recordAudit({
          event: 'admin.login.failed',
          source: 'admin-auth',
          payload: { ip, reason: 'totp' },
        })
        await delay(400)
        return NextResponse.json(
          { success: false, message: TOTP_INVALID, needsTotp: true },
          { status: 401 },
        )
      }
    }

    const userAgent = request.headers.get('user-agent')
    const session = await createSession({ ip, userAgent })
    if (!session) {
      // supabaseAdmin missing or DB error. Fail closed rather than silently
      // signing a cookie that won't verify.
      return NextResponse.json(
        { success: false, message: 'Ne mogu kreirati sesiju. Provjeri Supabase env.' },
        { status: 503 },
      )
    }

    await recordAudit({
      event: 'admin.login.ok',
      source: 'admin-auth',
      payload: {
        ip,
        userAgent,
        sessionId: session.sessionId,
        twoFactorUsed: is2FAEnabled(),
      },
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, session.token, {
      ...adminCookieOptions,
      // Align cookie lifetime with the DB row's `expires_at`.
      expires: session.expiresAt,
    })
    return response
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 })
  }
}
