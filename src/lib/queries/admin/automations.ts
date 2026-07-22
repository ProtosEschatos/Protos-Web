import 'server-only'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Database } from '@/lib/database.types'
import {
  decryptSecret,
  encryptSecret,
  isCryptoConfigured,
} from '@/lib/security/api-keys-crypto'
import { assertPublicUrl } from '@/lib/security/ssrf'
import type {
  AutomationAuthType,
  AutomationEvent,
  AutomationFireResult,
  AutomationHttpMethod,
  AutomationWebhookListItem,
} from '@/types/admin-automations'

const TABLE = 'automation_webhooks'
type WebhookInsert = Database['public']['Tables']['automation_webhooks']['Insert']
type WebhookUpdate = Database['public']['Tables']['automation_webhooks']['Update']

type Row = {
  id: string
  name: string
  url: string
  method: AutomationHttpMethod
  event: AutomationEvent
  auth_type: AutomationAuthType
  auth_header_name: string | null
  auth_ciphertext: string | null
  auth_iv: string | null
  auth_tag: string | null
  headers_json: Record<string, string> | null
  body_template: unknown | null
  notes: string | null
  is_enabled: boolean
  last_fired_at: string | null
  last_status_code: number | null
  last_response: string | null
  fire_count: number
  created_at: string
  updated_at: string
}

function rowToListItem(row: Row): AutomationWebhookListItem {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    method: row.method,
    event: row.event,
    authType: row.auth_type,
    authHeaderName: row.auth_header_name,
    hasAuthSecret: Boolean(row.auth_ciphertext && row.auth_iv && row.auth_tag),
    headersJson: row.headers_json ?? {},
    bodyTemplate: row.body_template,
    notes: row.notes,
    isEnabled: row.is_enabled,
    lastFiredAt: row.last_fired_at,
    lastStatusCode: row.last_status_code,
    lastResponse: row.last_response,
    fireCount: row.fire_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listAutomationWebhooks(): Promise<AutomationWebhookListItem[]> {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .order('event', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw new Error(error.message)
  return (data as unknown as Row[]).map(rowToListItem)
}

export async function createAutomationWebhook(input: {
  name: string
  url: string
  method: AutomationHttpMethod
  event: AutomationEvent
  authType: AutomationAuthType
  authHeaderName?: string | null
  authSecret?: string | null
  headersJson: Record<string, string>
  bodyTemplate?: unknown | null
  notes?: string | null
  isEnabled?: boolean
}): Promise<{ id: string }> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')

  const row: WebhookInsert = {
    name: input.name,
    url: input.url,
    method: input.method,
    event: input.event,
    auth_type: input.authType,
    auth_header_name: input.authHeaderName ?? null,
    headers_json: input.headersJson,
    body_template: (input.bodyTemplate ?? null) as WebhookInsert['body_template'],
    notes: input.notes ?? null,
    is_enabled: input.isEnabled ?? true,
  }

  if (input.authSecret && input.authType !== 'none') {
    if (!isCryptoConfigured()) throw new Error('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')
    const encrypted = encryptSecret(input.authSecret)
    row.auth_ciphertext = encrypted.ciphertext
    row.auth_iv = encrypted.iv
    row.auth_tag = encrypted.authTag
  }

  const { data, error } = await supabaseAdmin.from(TABLE).insert(row).select('id').single()
  if (error) throw new Error(error.message)
  return { id: (data as { id: string }).id }
}

export async function updateAutomationWebhook(
  id: string,
  patch: {
    name?: string
    url?: string
    method?: AutomationHttpMethod
    event?: AutomationEvent
    authType?: AutomationAuthType
    authHeaderName?: string | null
    authSecret?: string | null
    headersJson?: Record<string, string>
    bodyTemplate?: unknown | null
    notes?: string | null
    isEnabled?: boolean
    clearAuthSecret?: boolean
  },
): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')

  const row: WebhookUpdate = {}
  if (patch.name !== undefined) row.name = patch.name
  if (patch.url !== undefined) row.url = patch.url
  if (patch.method !== undefined) row.method = patch.method
  if (patch.event !== undefined) row.event = patch.event
  if (patch.authType !== undefined) row.auth_type = patch.authType
  if (patch.authHeaderName !== undefined) row.auth_header_name = patch.authHeaderName
  if (patch.headersJson !== undefined) row.headers_json = patch.headersJson
  if (patch.bodyTemplate !== undefined) row.body_template = patch.bodyTemplate as WebhookUpdate['body_template']
  if (patch.notes !== undefined) row.notes = patch.notes
  if (patch.isEnabled !== undefined) row.is_enabled = patch.isEnabled

  if (patch.clearAuthSecret) {
    row.auth_ciphertext = null
    row.auth_iv = null
    row.auth_tag = null
  } else if (patch.authSecret) {
    if (!isCryptoConfigured()) throw new Error('ADMIN_KEYS_ENCRYPTION_KEY nije postavljen')
    const encrypted = encryptSecret(patch.authSecret)
    row.auth_ciphertext = encrypted.ciphertext
    row.auth_iv = encrypted.iv
    row.auth_tag = encrypted.authTag
  }

  if (Object.keys(row).length === 0) return
  const { error } = await supabaseAdmin.from(TABLE).update(row).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteAutomationWebhook(id: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase nije konfiguriran')
  const { error } = await supabaseAdmin.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Fires the given webhook once and records the outcome (status, body preview,
 * fire_count++, last_fired_at). Callable from the admin UI ("test fire") and
 * from app-side triggers such as contact submission.
 */
export async function fireAutomationWebhook(
  id: string,
  overrides?: { payload?: unknown; timeoutMs?: number },
): Promise<AutomationFireResult> {
  if (!supabaseAdmin) return { ok: false, status: null, durationMs: 0, bodyPreview: null, error: 'Supabase nije konfiguriran' }

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) {
    return { ok: false, status: null, durationMs: 0, bodyPreview: null, error: error?.message ?? 'Webhook nije pronađen' }
  }
  const row = data as Row

  if (!row.is_enabled) {
    return { ok: false, status: null, durationMs: 0, bodyPreview: null, error: 'Webhook je isključen' }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'ProtosWebAdmin/1.0',
    ...(row.headers_json ?? {}),
  }

  if (row.auth_type !== 'none' && row.auth_ciphertext && row.auth_iv && row.auth_tag) {
    try {
      const secret = decryptSecret({
        ciphertext: row.auth_ciphertext,
        iv: row.auth_iv,
        authTag: row.auth_tag,
      })
      if (row.auth_type === 'bearer') {
        headers['Authorization'] = `Bearer ${secret}`
      } else if (row.auth_type === 'basic') {
        headers['Authorization'] = `Basic ${Buffer.from(secret).toString('base64')}`
      } else if (row.auth_type === 'custom' && row.auth_header_name) {
        headers[row.auth_header_name] = secret
      }
    } catch (err) {
      return {
        ok: false,
        status: null,
        durationMs: 0,
        bodyPreview: null,
        error: `Ne mogu odšifrirati auth: ${(err as Error).message}`,
      }
    }
  }

  const payload = overrides?.payload ?? row.body_template ?? {
    event: row.event,
    source: 'protosweb.eu/admin',
    firedAt: new Date().toISOString(),
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), overrides?.timeoutMs ?? 15_000)
  const started = Date.now()
  let status: number | null = null
  let bodyPreview: string | null = null
  let ok = false
  let errorMessage: string | undefined

  try {
    // SSRF gate: resolve hostname + verify no private/blocked IP before fetch.
    // Fail-closed on any private range (RFC1918, loopback, link-local, CGN,
    // IPv6 unique local / link-local, IPv4-mapped IPv6). Runtime is Node
    // (server action → not edge) so `node:dns` is available.
    await assertPublicUrl(row.url)

    const requestInit: RequestInit = {
      method: row.method,
      headers,
      signal: controller.signal,
    }
    if (row.method !== 'GET') {
      requestInit.body = typeof payload === 'string' ? payload : JSON.stringify(payload)
    }
    const response = await fetch(row.url, requestInit)
    status = response.status
    const text = await response.text().catch(() => '')
    bodyPreview = text.slice(0, 500)
    ok = response.ok
  } catch (err) {
    errorMessage = (err as Error).message
  } finally {
    clearTimeout(timeoutId)
  }

  const durationMs = Date.now() - started

  await supabaseAdmin
    .from(TABLE)
    .update({
      last_fired_at: new Date().toISOString(),
      last_status_code: status,
      last_response: bodyPreview,
      fire_count: row.fire_count + 1,
    })
    .eq('id', id)

  return { ok, status, durationMs, bodyPreview, error: errorMessage }
}

/**
 * Convenience: fire every enabled webhook whose event matches `event`.
 * Runs in parallel, does not throw — records status per webhook.
 * Callable from app-side triggers (e.g. contact submission).
 */
export async function fireAutomationsByEvent(
  event: AutomationEvent,
  payload: unknown,
): Promise<void> {
  if (!supabaseAdmin) return
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('id')
    .eq('event', event)
    .eq('is_enabled', true)
  if (error || !data) return
  await Promise.all(
    (data as { id: string }[]).map((row) =>
      fireAutomationWebhook(row.id, { payload }).catch(() => undefined),
    ),
  )
}
