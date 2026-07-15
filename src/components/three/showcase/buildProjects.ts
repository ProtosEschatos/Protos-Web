import type { PortfolioItem } from '@/types/portfolio'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase/showcase-storage'
import { isPoklonPortfolioUrl, portfolioUrlToShowcaseSlug } from '@/lib/showcase/portfolio-slug'
import { type ShowcaseProject } from './constants'

const FRAME_COLORS = [0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8, 0xff6600, 0x8b5cf6, 0x10b981, 0xec4899]

export function buildShowcaseProjects(
  portfolioItems: PortfolioItem[],
  viewport: ShowcaseViewport,
): ShowcaseProject[] {
  const viewportKey = viewport === 'desktop' ? 'desktop' : 'mobile'

  return portfolioItems
    .filter((item) => item.project_url && !isPoklonPortfolioUrl(item.project_url))
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
    .map((item, index) => {
      const link = item.project_url!
      const slug = portfolioUrlToShowcaseSlug(link)
      const storageFallback = getShowcaseStorageUrl(
        SHOWCASE_STORAGE.project(slug, viewportKey),
      )
      const prefersStorage =
        viewport === 'desktop' && (!item.image_url || item.image_url.includes('/mobile-'))
      const imageUrl = prefersStorage ? storageFallback : (item.image_url ?? storageFallback)

      return {
        color: FRAME_COLORS[index % FRAME_COLORS.length],
        link,
        title: item.title,
        description: item.description ?? '',
        imageUrl,
      }
    })
}
