import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSupabaseAnonKey, getSupabaseUrl } from './supabase/env'

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

/** Legacy singleton for existing queries/actions — prefer createClient() from ./supabase/server in new code. */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null
