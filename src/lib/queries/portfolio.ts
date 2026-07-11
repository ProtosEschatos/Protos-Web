import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types/portfolio'

export async function getPortfolioItems(
  language = 'hr',
  limit = 12,
): Promise<PortfolioItem[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('id, title, tag, description, image_url, project_url, featured, sort_order, language')
    .eq('active', true)
    .eq('language', language)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('getPortfolioItems error:', error)
    return []
  }

  return data ?? []
}
