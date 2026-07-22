import {
  isAdminPath as sharedIsAdminPath,
  isAdminLoginPath as sharedIsAdminLoginPath,
} from '@/lib/auth/admin-paths'

export const ADMIN_COOKIE = 'protos-admin-session'
// Retained only for backwards-compat with any tooling that grep-ed for it.
// The DB-backed session model no longer HMACs anything; cookie value is a
// pure random opaque token.
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

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Edge-compatible session verify.
 *
 * Runs in Next.js middleware / edge runtime — cannot import `node:crypto`
 * or `@supabase/supabase-js` directly (well, supabase-js does work on edge,
 * but a raw REST call keeps the bundle smaller and dependencies flatter).
 *
 * Verification flow:
 *   1. SHA-256(cookie value) via WebCrypto.
 *   2. `GET /rest/v1/admin_sessions?token_hash=eq.<hash>&select=...` with
 *      service_role key (edge env is server-only, never bundled to client).
 *   3. Row must exist, `revoked_at` must be null, `expires_at` must be in
 *      the future.
 *
 * Fails closed on any error (missing env, network, non-2xx, empty row).
 */
export async function verifyAdminSessionEdge(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return false

  let tokenHash: string
  try {
    tokenHash = await sha256Hex(token)
  } catch {
    return false
  }

  // Hard 2s timeout on the Supabase REST call. Vercel Edge functions have
  // a 25s hard timeout for the whole request; if Supabase is degraded or
  // stalled, we don't want middleware to wedge every admin page load for
  // 25 seconds. Fail-closed on timeout so the user gets bounced to login
  // (predictable UX) instead of a spinner-to-500. Supabase REST p99 is
  // ~200ms, so 2s is 10x headroom.
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 2000)

  try {
    const url = `${supabaseUrl}/rest/v1/admin_sessions?token_hash=eq.${encodeURIComponent(tokenHash)}&select=revoked_at,expires_at&limit=1`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: 'application/json',
      },
      // Edge/middleware — no cache; every request is authoritative.
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!res.ok) return false
    const rows = (await res.json()) as Array<{
      revoked_at: string | null
      expires_at: string
    }>
    const row = rows[0]
    if (!row) return false
    if (row.revoked_at) return false
    if (new Date(row.expires_at).getTime() <= Date.now()) return false
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}
