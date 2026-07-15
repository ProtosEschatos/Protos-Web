import type { PortfolioItem } from '@/types/portfolio'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { SHOWCASE_ALLOWLIST } from '@/lib/showcase/showcase-allowlist'
import { getShowcaseFrameImageSources } from '@/lib/showcase/showcase-storage'
import { type ShowcaseProject } from './constants'

const FRAME_COLORS = [0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8, 0xff6600, 0x8b5cf6, 0x10b981, 0xec4899]

export function buildShowcaseProjects(
  _portfolioItems: PortfolioItem[],
  viewport: ShowcaseViewport,
): ShowcaseProject[] {
  return [...SHOWCASE_ALLOWLIST]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((entry, index) => ({
      color: FRAME_COLORS[index % FRAME_COLORS.length],
      link: entry.projectUrl,
      title: entry.title,
      description: entry.description,
      imageUrl: getShowcaseFrameImageSources(entry.slug, viewport)[0] ?? null,
      imageSources: getShowcaseFrameImageSources(entry.slug, viewport),
    }))
}
