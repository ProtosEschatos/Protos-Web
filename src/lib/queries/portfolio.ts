import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types/portfolio'

const PORTFOLIO_SELECT =
  'id, title, tag, description, image_url, project_url, featured, sort_order, language' as const

export async function getPortfolioItems(
  language = 'hr',
  limit = 12,
): Promise<PortfolioItem[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('portfolio_items')
    .select(PORTFOLIO_SELECT)
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

/** Active portfolio rows with a live URL — used to populate 3D showcase frames. */
export async function getShowcasePortfolioItems(
  language = 'hr',
  limit = 8,
): Promise<PortfolioItem[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('portfolio_items')
    .select(PORTFOLIO_SELECT)
    .eq('active', true)
    .eq('language', language)
    .not('project_url', 'is', null)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('getShowcasePortfolioItems error:', error)
    return []
  }

  return data ?? []
}
