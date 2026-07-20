import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isCryptoConfigured } from '@/lib/security/api-keys-crypto'

export type UltimatePanelStats = {
  apiKeys: {
    total: number
    active: number
    cryptoConfigured: boolean
  }
  automations: {
    total: number
    enabled: number
    totalFires: number
    lastFiredAt: string | null
    lastStatusCode: number | null
    lastStatusOk: boolean | null
  }
}

const EMPTY: UltimatePanelStats = {
  apiKeys: { total: 0, active: 0, cryptoConfigured: false },
  automations: { total: 0, enabled: 0, totalFires: 0, lastFiredAt: null, lastStatusCode: null, lastStatusOk: null },
}

export async function getUltimatePanelStats(): Promise<UltimatePanelStats> {
  if (!supabaseAdmin) return EMPTY

  const [keysResult, hooksResult] = await Promise.all([
    supabaseAdmin.from('admin_api_keys').select('is_active'),
    supabaseAdmin
      .from('automation_webhooks')
      .select('is_enabled, fire_count, last_fired_at, last_status_code')
      .order('last_fired_at', { ascending: false, nullsFirst: false }),
  ])

  const cryptoConfigured = isCryptoConfigured()

  const keysRows = (keysResult.data as { is_active: boolean }[] | null) ?? []
  const apiKeys = {
    total: keysRows.length,
    active: keysRows.filter((k) => k.is_active).length,
    cryptoConfigured,
  }

  const hookRows = (hooksResult.data as
    | { is_enabled: boolean; fire_count: number; last_fired_at: string | null; last_status_code: number | null }[]
    | null) ?? []
  const mostRecent = hookRows.find((h) => h.last_fired_at)
  const automations = {
    total: hookRows.length,
    enabled: hookRows.filter((h) => h.is_enabled).length,
    totalFires: hookRows.reduce((sum, h) => sum + (h.fire_count ?? 0), 0),
    lastFiredAt: mostRecent?.last_fired_at ?? null,
    lastStatusCode: mostRecent?.last_status_code ?? null,
    lastStatusOk:
      mostRecent?.last_status_code == null
        ? null
        : mostRecent.last_status_code >= 200 && mostRecent.last_status_code < 300,
  }

  return { apiKeys, automations }
}
