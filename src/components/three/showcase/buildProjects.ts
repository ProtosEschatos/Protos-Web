import type { PortfolioItem } from '@/types/portfolio'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { normalizeProjectUrl } from '@/lib/showcase/showcase-utils'
import {
  FRAME_SLOTS,
  PROJECT_LINKS,
  SHOWCASE_FRAME_COLORS,
  type ShowcaseProject,
} from './constants'

function findProjectLinkMeta(projectUrl: string) {
  const normalized = normalizeProjectUrl(projectUrl)
  return PROJECT_LINKS.find((meta) => normalizeProjectUrl(meta.link) === normalized)
}

export function buildShowcaseProjects(
  _t: (key: string) => string,
  portfolioItems: PortfolioItem[],
  viewport: ShowcaseViewport,
): ShowcaseProject[] {
  const showcaseItems = portfolioItems
    .filter((item) => item.project_url)
    .slice(0, FRAME_SLOTS)

  return showcaseItems.map((item, index) => {
    const meta = findProjectLinkMeta(item.project_url!)
    const fallbackScreenshot = meta
      ? viewport === 'desktop'
        ? meta.screenshotDesktop
        : meta.screenshotMobile
      : null

    return {
      color: meta?.color ?? SHOWCASE_FRAME_COLORS[index % SHOWCASE_FRAME_COLORS.length],
      link: item.project_url!,
      title: item.title,
      description: item.description ?? '',
      imageUrl: item.image_url ?? fallbackScreenshot,
    }
  })
}
