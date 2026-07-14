/** Shared Supabase env resolution — supports publishable + legacy JWT anon keys. */

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY
  )
}
