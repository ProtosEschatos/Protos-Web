import type { PortfolioItem } from '@/types/portfolio'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { normalizeProjectUrl } from '@/lib/showcase/showcase-utils'
import { PROJECT_LINKS, type ShowcaseProject } from './constants'

export function buildShowcaseProjects(
  t: (key: string) => string,
  portfolioItems: PortfolioItem[],
  viewport: ShowcaseViewport,
): ShowcaseProject[] {
  return PROJECT_LINKS.map((meta, index) => {
    const dbItem = portfolioItems.find(
      (item) => item.project_url && normalizeProjectUrl(item.project_url) === normalizeProjectUrl(meta.link),
    )

    const fallback = viewport === 'desktop' ? meta.screenshotDesktop : meta.screenshotMobile
    const imageUrl = dbItem?.image_url ?? fallback

    return {
      color: meta.color,
      link: meta.link,
      title: dbItem?.title ?? t(`project${index + 1}_title`),
      description: dbItem?.description ?? t(`project${index + 1}_desc`),
      imageUrl,
    }
  })
}
