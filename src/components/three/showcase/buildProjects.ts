import type { PortfolioItem } from '@/actions/portfolio'
import { normalizeProjectUrl } from '@/lib/showcase-screenshots'
import { PROJECT_LINKS, type ShowcaseProject } from './constants'

export function buildShowcaseProjects(
  t: (key: string) => string,
  portfolioItems: PortfolioItem[],
): ShowcaseProject[] {
  return PROJECT_LINKS.map((meta, index) => {
    const dbItem = portfolioItems.find(
      (item) => item.project_url && normalizeProjectUrl(item.project_url) === normalizeProjectUrl(meta.link),
    )

    return {
      color: meta.color,
      link: meta.link,
      title: dbItem?.title ?? t(`project${index + 1}_title`),
      description: dbItem?.description ?? t(`project${index + 1}_desc`),
      imageUrl: meta.screenshot,
    }
  })
}
