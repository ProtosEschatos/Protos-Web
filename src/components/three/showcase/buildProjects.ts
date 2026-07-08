import type { ShowcaseViewport } from '@/lib/showcase-viewport'
import { PROJECT_LINKS, type ShowcaseProject } from './constants'

/** Placeholder frames — screens show "Coming Soon", no live project data. */
export function buildShowcaseProjects(t: (key: string) => string): ShowcaseProject[] {
  return PROJECT_LINKS.map((meta) => ({
    color: meta.color,
    link: '',
    title: t('frameComingSoon'),
    description: t('frameComingSoonDesc'),
    imageUrl: null,
  }))
}
