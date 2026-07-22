import 'server-only'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'

/**
 * DB-backed revokable admin sessions.
 *
 * Cookie stores a random 32-byte hex token (64 chars). DB stores only its
 * SHA-256 hash. `verifySessionToken` looks up the hash, checks that the row
 * is not revoked and not expired, and bumps `last_seen_at`.
 *
 * Rotating `ADMIN_SECRET` no longer kicks all sessions (auth is decoupled
 * from the secret HMAC). To invalidate everything, call `revokeAllSessions`.
 */

type SessionRow = Database['public']['Tables']['admin_sessions']['Row']

const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000 // 7 days

export type CreatedSession = {
  token: string // plaintext — set as cookie value
  sessionId: string
  expiresAt: Date
}

export type SessionSummary = {
  id: string
  ip: string | null
  userAgent: string | null
  createdAt: string
  lastSeenAt: string
  expiresAt: string
  revoked: boolean
  isCurrent: boolean
}

export function isSessionsBackendConfigured(): boolean {
  return Boolean(supabaseAdmin)
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(input: {
  ip?: string | null
  userAgent?: string | null
}): Promise<CreatedSession | null> {
  if (!supabaseAdmin) return null
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({
      token_hash: tokenHash,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single()

  if (error || !data) {
    console.warn('[admin-sessions] createSession failed:', error?.message)
    return null
  }

  return { token, sessionId: data.id, expiresAt }
}

/**
 * Verify a plaintext token from the cookie. Returns session row if valid,
 * or null if unknown / expired / revoked. Side-effect: bumps `last_seen_at`
 * (fire-and-forget — never blocks verification).
 */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionRow | null> {
  if (!token || !supabaseAdmin) return null
  const tokenHash = hashToken(token)

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('token_hash', tokenHash)
    .single()

  if (error || !data) return null
  const row = data as SessionRow

  if (row.revoked_at) return null
  if (new Date(row.expires_at).getTime() <= Date.now()) return null

  // Constant-time compare of stored hash vs computed hash (defense in depth
  // — .eq already matched, but keeps us honest if the query ever becomes
  // fuzzy in a refactor).
  try {
    const a = Buffer.from(row.token_hash)
    const b = Buffer.from(tokenHash)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  // Fire-and-forget last_seen update. Errors ignored.
  supabaseAdmin
    .from('admin_sessions')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', row.id)
    .then(() => undefined, () => undefined)

  return row
}

export async function revokeSession(sessionId: string): Promise<boolean> {
  if (!supabaseAdmin) return false
  const { error } = await supabaseAdmin
    .from('admin_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', sessionId)
    .is('revoked_at', null)
  if (error) {
    console.warn('[admin-sessions] revokeSession failed:', error.message)
    return false
  }
  return true
}

export async function revokeSessionByToken(token: string): Promise<boolean> {
  if (!supabaseAdmin) return false
  const tokenHash = hashToken(token)
  const { error } = await supabaseAdmin
    .from('admin_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
  if (error) {
    console.warn('[admin-sessions] revokeSessionByToken failed:', error.message)
    return false
  }
  return true
}

export async function revokeAllSessionsExcept(currentSessionId: string): Promise<number> {
  if (!supabaseAdmin) return 0
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .neq('id', currentSessionId)
    .is('revoked_at', null)
    .select('id')
  if (error) {
    console.warn('[admin-sessions] revokeAllSessionsExcept failed:', error.message)
    return 0
  }
  return (data ?? []).length
}

export async function listActiveSessions(currentToken: string | null): Promise<SessionSummary[]> {
  if (!supabaseAdmin) return []
  const currentHash = currentToken ? hashToken(currentToken) : null
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .order('last_seen_at', { ascending: false })
    .limit(50)
  if (error) {
    console.warn('[admin-sessions] listActiveSessions failed:', error.message)
    return []
  }
  return (data as SessionRow[]).map((row) => ({
    id: row.id,
    ip: row.ip,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
    expiresAt: row.expires_at,
    revoked: Boolean(row.revoked_at),
    isCurrent: Boolean(currentHash && row.token_hash === currentHash),
  }))
}

/**
 * Best-effort cleanup: mark expired sessions as revoked. Called opportunistically
 * from verifySessionToken (small chance) to avoid unbounded row growth.
 */
export async function purgeExpiredSessions(): Promise<void> {
  if (!supabaseAdmin) return
  const now = new Date().toISOString()
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .lt('expires_at', now)
    .then(() => undefined, () => undefined)
}
