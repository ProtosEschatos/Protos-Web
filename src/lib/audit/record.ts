import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'

type AuditInsert = Database['public']['Tables']['audit_events']['Insert']

export type AuditEventInput = {
  /** Snake-cased event slug, e.g. `admin.login`, `publish.bluesky.ok`. */
  event: string
  /** Which subsystem emitted it, e.g. `admin-panel`, `publish/bluesky`. */
  source: string
  /** Free-form JSON payload — actor, target IDs, status, error text. */
  payload?: Record<string, unknown>
}

/**
 * Fire-and-forget audit log write. Never throws — losing an audit row
 * must not break the request path. Errors are logged to stderr only.
 */
export async function recordAudit(input: AuditEventInput): Promise<void> {
  if (!supabaseAdmin) {
    console.warn('[audit] supabaseAdmin unavailable — skipping', input.event)
    return
  }
  try {
    const row: AuditInsert = {
      event: input.event,
      source: input.source,
      payload: (input.payload ?? {}) as AuditInsert['payload'],
    }
    const { error } = await supabaseAdmin.from('audit_events').insert(row)
    if (error) {
      console.warn('[audit] insert failed:', input.event, error.message)
    }
  } catch (err) {
    console.warn('[audit] insert threw:', input.event, err)
  }
}
