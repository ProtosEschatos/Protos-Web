import {
  isAdminPath as sharedIsAdminPath,
  isAdminLoginPath as sharedIsAdminLoginPath,
} from '@/lib/auth/admin-paths'

export const ADMIN_COOKIE = 'protos-admin-session'
export const SESSION_SALT = 'protos-admin-v1'

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export const isAdminPath = sharedIsAdminPath
export const isAdminLoginPath = sharedIsAdminLoginPath

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function getAdminSessionTokenEdge(): Promise<string> {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return ''
  return hmacHex(secret, SESSION_SALT)
}

export async function verifyAdminSessionEdge(token: string | undefined | null): Promise<boolean> {
  if (!token || !process.env.ADMIN_SECRET) return false
  const expected = await getAdminSessionTokenEdge()
  if (!expected || token.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}
