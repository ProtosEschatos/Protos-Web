import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

export type EdgeFnResult<T> =
  | { ok: true; status: number; data: T; configured: true }
  | { ok: false; status: number; data: Record<string, unknown>; configured: boolean }

export function isSupabaseEdgeConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}

/** Thin proxy to a Supabase Edge Function (anon key auth). */
export async function invokeEdgeFunction<T extends Record<string, unknown>>(
  name: string,
  body: Record<string, unknown>,
): Promise<EdgeFnResult<T>> {
  const supabaseUrl = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 503, data: {}, configured: false }
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json().catch(() => ({}))) as T & Record<string, unknown>

  if (!response.ok) {
    return { ok: false, status: response.status, data, configured: true }
  }

  return { ok: true, status: response.status, data, configured: true }
}
