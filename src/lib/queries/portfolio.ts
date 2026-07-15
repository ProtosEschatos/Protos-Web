import { normalizePortfolioUrl, SHOWCASE_ALLOWLIST, isAllowedPortfolioUrl } from '@/lib/showcase/showcase-allowlist'
import { withPortfolioImageFallback } from '@/lib/config/portfolio-image-fallbacks'
import { getShowcaseFrameImageUrl } from '@/lib/showcase/showcase-storage'
import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types/portfolio'

function allowlistFallbackItems(language: string): PortfolioItem[] {
  return SHOWCASE_ALLOWLIST.map((entry) =>
    withPortfolioImageFallback({
      id: entry.slug,
      title: entry.title,
      tag: entry.tag,
      description: entry.description,
      image_url: null,
      project_url: entry.projectUrl,
      featured: false,
      sort_order: entry.sortOrder,
      language,
    }),
  )
}

export async function getPortfolioItems(
  language = 'hr',
  limit = 12,
): Promise<PortfolioItem[]> {
  if (!supabase) {
    return allowlistFallbackItems(language).slice(0, limit)
  }

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('id, title, tag, description, image_url, project_url, featured, sort_order, language')
    .eq('active', true)
    .eq('language', language)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(limit * 2)

  if (error) {
    console.error('getPortfolioItems error:', error)
    return allowlistFallbackItems(language).slice(0, limit)
  }

  const filtered = (data ?? [])
    .filter((item) => isAllowedPortfolioUrl(item.project_url))
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
    .slice(0, limit)
    .map((item) => withPortfolioImageFallback(item))

  if (filtered.length > 0) return filtered

  return allowlistFallbackItems(language).slice(0, limit)
}

const HOME_FEATURED_SLUG = 'bodulica'

/** Featured Bodulica card for home and /portfolio (local showcase screenshot). */
export async function getHomeFeaturedPortfolioItem(language = 'hr'): Promise<PortfolioItem | null> {
  const entry = SHOWCASE_ALLOWLIST.find((item) => item.slug === HOME_FEATURED_SLUG)
  if (!entry) return null

  const items = await getPortfolioItems(language, 12)
  const match = items.find(
    (item) =>
      isAllowedPortfolioUrl(item.project_url) &&
      normalizePortfolioUrl(item.project_url!) === normalizePortfolioUrl(entry.projectUrl),
  )

  const base =
    match ??
    withPortfolioImageFallback({
      id: entry.slug,
      title: entry.title,
      tag: entry.tag,
      description: entry.description,
      image_url: null,
      project_url: entry.projectUrl,
      featured: true,
      sort_order: entry.sortOrder,
      language,
    })

  return {
    ...base,
    image_url: getShowcaseFrameImageUrl(HOME_FEATURED_SLUG, 'desktop'),
  }
}
