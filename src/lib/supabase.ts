import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSupabaseAnonKey, getSupabaseUrl } from './supabase/env'

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

/** Legacy singleton for existing queries/actions. */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null
