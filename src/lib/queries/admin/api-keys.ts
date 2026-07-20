import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
  decryptSecret,
  encryptSecret,
  maskSecret,
} from '@/lib/security/api-keys-crypto'
import type {
  AdminApiKeyEnvTarget,
  AdminApiKeyListItem,
} from '@/types/admin-api-keys'

const TABLE = 'admin_api_keys'

type Row = {
  id: string
  provider: string
  label: string
  env_target: AdminApiKeyEnvTarget
  masked_hint: string | null
  ciphertext: string
  iv: string
  auth_tag: string
  notes: string | null
  is_active: boolean
  last_used_at: string | null
  created_at: string
  updated_at: string
}

function rowToListItem(row: Row): AdminApiKeyListItem {
  return {
    id: row.id,
    provider: row.provider,
    label: row.label,
    envTarget: row.env_target,
    maskedHint: row.masked_hint,
    notes: row.notes,
    isActive: row.is_active,
    lastUsedAt: row.last_used_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listAdminApiKeys(): Promise<AdminApiKeyListItem[]> {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('id, provider, label, env_target, masked_hint, ciphertext, iv, auth_tag, notes, is_active, last_used_at, created_at, updated_at')
    .order('provider', { ascending: true })
    .order('label', { ascending: true })
  if (error) throw new Error(error.message)
  return (data as unknown as Row[]).map(rowToListItem)
}

export async function createAdminApiKey(input: {
  provider: string
  label: string
  envTarget: AdminApiKeyEnvTarget
  value: string
  notes?: string | null
  isActive?: boolean
}): Promise<{ id: string }> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')
  const encrypted = encryptSecret(input.value)
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      provider: input.provider,
      label: input.label,
      env_target: input.envTarget,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      auth_tag: encrypted.authTag,
      masked_hint: maskSecret(input.value),
      notes: input.notes ?? null,
      is_active: input.isActive ?? true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return { id: (data as { id: string }).id }
}

export async function updateAdminApiKey(
  id: string,
  patch: {
    label?: string
    envTarget?: AdminApiKeyEnvTarget
    value?: string | null
    notes?: string | null
    isActive?: boolean
  },
): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')

  const row: Record<string, unknown> = {}
  if (patch.label !== undefined) row.label = patch.label
  if (patch.envTarget !== undefined) row.env_target = patch.envTarget
  if (patch.notes !== undefined) row.notes = patch.notes
  if (patch.isActive !== undefined) row.is_active = patch.isActive

  if (patch.value) {
    const encrypted = encryptSecret(patch.value)
    row.ciphertext = encrypted.ciphertext
    row.iv = encrypted.iv
    row.auth_tag = encrypted.authTag
    row.masked_hint = maskSecret(patch.value)
  }

  if (Object.keys(row).length === 0) return

  const { error } = await supabaseAdmin.from(TABLE).update(row).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteAdminApiKey(id: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')
  const { error } = await supabaseAdmin.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Server-side helper used by admin server actions and by any backend module
 * that needs to fetch a live secret at runtime (e.g. Configurator calling
 * Sketchfab). Also stamps last_used_at.
 */
export async function revealAdminApiKey(id: string): Promise<string> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('ciphertext, iv, auth_tag')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  const plain = decryptSecret({
    ciphertext: (data as Row).ciphertext,
    iv: (data as Row).iv,
    authTag: (data as Row).auth_tag,
  })
  await supabaseAdmin.from(TABLE).update({ last_used_at: new Date().toISOString() }).eq('id', id)
  return plain
}

/**
 * Convenience: fetch the newest active key for a provider (used by other
 * server modules — e.g. Configurator uses `getActiveApiKey('sketchfab')`).
 */
export async function getActiveApiKey(provider: string): Promise<string | null> {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('id')
    .eq('provider', provider)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return revealAdminApiKey((data as { id: string }).id)
}
