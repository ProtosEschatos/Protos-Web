import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'

export type AuditRow = {
  id: number
  createdAt: string
  event: string
  source: string
  payload: Record<string, unknown>
}

export type AuditFilter = {
  event?: string
  source?: string
  limit?: number
  offset?: number
}

export async function listAuditEvents(filter: AuditFilter = {}): Promise<{
  rows: AuditRow[]
  total: number
}> {
  if (!supabaseAdmin) return { rows: [], total: 0 }
  const limit = Math.min(filter.limit ?? 100, 500)
  const offset = filter.offset ?? 0

  let query = supabaseAdmin
    .from('audit_events')
    .select('id, created_at, event, source, payload', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (filter.event) query = query.ilike('event', `%${filter.event}%`)
  if (filter.source) query = query.ilike('source', `%${filter.source}%`)

  const { data, error, count } = await query
  if (error) {
    console.warn('[audit.list] failed:', error.message)
    return { rows: [], total: 0 }
  }
  const rows: AuditRow[] = (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    event: row.event,
    source: row.source,
    payload: (row.payload ?? {}) as Record<string, unknown>,
  }))
  return { rows, total: count ?? rows.length }
}

/** Distinct events used to populate a filter dropdown. */
export async function listAuditEventNames(): Promise<string[]> {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('audit_events')
    .select('event')
    .order('event', { ascending: true })
    .limit(500)
  if (error) return []
  const names = new Set<string>()
  for (const row of data ?? []) names.add(row.event)
  return [...names].sort()
}
