import { requireAdmin } from '@/lib/auth/require-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { AdminPortfolioItem } from '@/types/admin-portfolio'

export async function adminListPortfolioItems(language = 'hr'): Promise<AdminPortfolioItem[]> {
  await requireAdmin()
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .select('id, title, tag, description, image_url, project_url, featured, active, sort_order, language, created_at')
    .eq('language', language)
    .order('sort_order', { ascending: true })
    .limit(100)

  if (error) {
    console.error('adminListPortfolioItems:', error)
    return []
  }
  return data ?? []
}

export async function adminGetPortfolioItem(id: string): Promise<AdminPortfolioItem | null> {
  await requireAdmin()
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .select('id, title, tag, description, image_url, project_url, featured, active, sort_order, language, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data
}
