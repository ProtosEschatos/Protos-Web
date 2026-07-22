import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE } from '@/lib/auth/admin-auth'
import { revokeSessionByToken } from '@/lib/auth/admin-sessions'
import { recordAudit } from '@/lib/audit/record'

export async function POST() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (token) {
    const revoked = await revokeSessionByToken(token)
    if (revoked) {
      await recordAudit({
        event: 'admin.logout.ok',
        source: 'admin-auth',
        payload: {},
      })
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return response
}
