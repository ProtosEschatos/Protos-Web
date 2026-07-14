import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../database.types'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

export function createClient() {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  if (!url || !key) {
    throw new Error('Missing Supabase URL or anon/publishable key')
  }
  return createBrowserClient<Database>(url, key)
}
