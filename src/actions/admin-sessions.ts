'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE } from '@/lib/auth/admin-auth'
import { requireAdmin } from '@/lib/auth/require-admin'
import { recordAudit } from '@/lib/audit/record'
import {
  listActiveSessions,
  revokeAllSessionsExcept,
  revokeSession,
  verifySessionToken,
  type SessionSummary,
} from '@/lib/auth/admin-sessions'

type Result<T = undefined> =
  | (T extends undefined ? { success: true } : { success: true; data: T })
  | { success: false; error: string }

const SESSIONS_PATH = '/admin/sesije'

export async function adminListSessions(): Promise<Result<SessionSummary[]>> {
  await requireAdmin()
  const currentToken = (await cookies()).get(ADMIN_COOKIE)?.value ?? null
  const sessions = await listActiveSessions(currentToken)
  return { success: true, data: sessions }
}

export async function adminRevokeSession(sessionId: string): Promise<Result<undefined>> {
  await requireAdmin()
  const currentToken = (await cookies()).get(ADMIN_COOKIE)?.value
  const current = currentToken ? await verifySessionToken(currentToken) : null

  if (current && current.id === sessionId) {
    return {
      success: false,
      error: 'Ne možeš opozvati vlastitu sesiju iz ovog panela — koristi Logout.',
    }
  }

  const ok = await revokeSession(sessionId)
  if (!ok) return { success: false, error: 'Ne mogu opozvati sesiju' }

  await recordAudit({
    event: 'admin.session.revoke.ok',
    source: 'admin-panel',
    payload: { revokedSessionId: sessionId, revokedBy: current?.id },
  })

  revalidatePath(SESSIONS_PATH)
  return { success: true }
}

export async function adminRevokeAllOtherSessions(): Promise<Result<{ revoked: number }>> {
  await requireAdmin()
  const currentToken = (await cookies()).get(ADMIN_COOKIE)?.value
  const current = currentToken ? await verifySessionToken(currentToken) : null
  if (!current) {
    return { success: false, error: 'Trenutna sesija nije prepoznata' }
  }

  const revoked = await revokeAllSessionsExcept(current.id)

  await recordAudit({
    event: 'admin.session.revoke_all_others.ok',
    source: 'admin-panel',
    payload: { keptSessionId: current.id, revokedCount: revoked },
  })

  revalidatePath(SESSIONS_PATH)
  return { success: true, data: { revoked } }
}
