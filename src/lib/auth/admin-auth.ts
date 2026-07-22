import { timingSafeEqual } from 'node:crypto'
import { verifySessionToken } from '@/lib/auth/admin-sessions'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  isAdminLoginPath,
  isAdminPath,
} from './admin-auth-shared'

/**
 * Admin auth — Node runtime API surface.
 *
 * Legacy signature (`verifyAdminSession(token)`) is preserved but now
 * returns a Promise. Callers must `await` it. Verification is DB-backed
 * against `admin_sessions` (sha256 of cookie value); rotating
 * `ADMIN_SECRET` no longer invalidates sessions — call `revokeAllSessions`
 * for that.
 *
 * `verifyAdminPassword` still exists (used by the login route) and is
 * still constant-time compare against `ADMIN_SECRET`.
 */

export { ADMIN_COOKIE, adminCookieOptions, isAdminLoginPath, isAdminPath }

export async function verifyAdminSession(
  token: string | undefined | null,
): Promise<boolean> {
  const session = await verifySessionToken(token)
  return session !== null
}

export function verifyAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  const input = password?.trim()
  if (!secret || !input) return false
  try {
    const a = Buffer.from(input)
    const b = Buffer.from(secret)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
