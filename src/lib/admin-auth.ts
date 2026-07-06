import { createHmac, timingSafeEqual } from 'crypto'
import {
  ADMIN_COOKIE,
  SESSION_SALT,
  adminCookieOptions,
  isAdminLoginPath,
  isAdminPath,
} from './admin-auth-shared'

export { ADMIN_COOKIE, adminCookieOptions, isAdminLoginPath, isAdminPath }

export function getAdminSessionToken(): string {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return ''
  return createHmac('sha256', secret).update(SESSION_SALT).digest('hex')
}

export function verifyAdminSession(token: string | undefined | null): boolean {
  if (!token || !process.env.ADMIN_SECRET) return false
  const expected = getAdminSessionToken()
  if (!expected) return false
  try {
    const a = Buffer.from(token)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function verifyAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret || !password) return false
  try {
    const a = Buffer.from(password)
    const b = Buffer.from(secret)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
