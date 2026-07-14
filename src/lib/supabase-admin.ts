import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSupabaseUrl } from './supabase/env'

const supabaseUrl = getSupabaseUrl()
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null
