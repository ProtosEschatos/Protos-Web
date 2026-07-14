import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../database.types'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

export async function createClient() {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  if (!url || !key) {
    throw new Error('Missing Supabase URL or anon/publishable key')
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from a Server Component — middleware should refresh sessions.
        }
      },
    },
  })
}
