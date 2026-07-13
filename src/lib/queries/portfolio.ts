import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types/portfolio'
import { withPortfolioImageFallback } from '@/lib/config/portfolio-image-fallbacks'

export async function getPortfolioItems(
  language = 'hr',
  limit = 12,
): Promise<PortfolioItem[]> {
  if (!supabase) return []

  const fetchByLanguage = async (lang: string) => {
    const { data, error } = await supabase!
      .from('portfolio_items')
      .select('id, title, tag, description, image_url, project_url, featured, sort_order, language')
      .eq('active', true)
      .eq('language', lang)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('getPortfolioItems error:', error)
      return []
    }
    return data ?? []
  }

  const rows = await fetchByLanguage(language)
  const result = rows.length > 0 || language === 'hr' ? rows : await fetchByLanguage('hr')
  return result.map(withPortfolioImageFallback)
}
