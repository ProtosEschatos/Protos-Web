import { isAllowedPortfolioUrl } from '@/lib/showcase/showcase-allowlist'
import { portfolioUrlToShowcaseSlug } from '@/lib/showcase/portfolio-slug'
import { getShowcaseFrameImageUrl } from '@/lib/showcase/showcase-storage'

/** Local SVG placeholders when project URL is not on the showcase allowlist. */
const SVG_FALLBACKS: Record<string, string> = {
  'bodulica.shop': '/images/portfolio/bodulica.svg',
  'www.bodulica.shop': '/images/portfolio/bodulica.svg',
  'golden-pawn.vercel.app': '/images/portfolio/golden-pawn.svg',
  'auto-moto.vercel.app': '/images/portfolio/auto-moto.svg',
  'lumina-dent.vercel.app': '/images/portfolio/dentalna-ordinacija.svg',
}

function normalizeHost(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host
  } catch {
    return null
  }
}

export function getPortfolioImageFallback(projectUrl: string | null | undefined): string | null {
  if (!projectUrl) return null

  if (isAllowedPortfolioUrl(projectUrl)) {
    const slug = portfolioUrlToShowcaseSlug(projectUrl)
    return getShowcaseFrameImageUrl(slug, 'desktop')
  }

  const host = normalizeHost(projectUrl)
  if (!host) return null
  return SVG_FALLBACKS[host] ?? SVG_FALLBACKS[`www.${host}`] ?? null
}

export function withPortfolioImageFallback<T extends { image_url: string | null; project_url: string | null }>(
  item: T,
): T {
  if (item.project_url && isAllowedPortfolioUrl(item.project_url)) {
    const slug = portfolioUrlToShowcaseSlug(item.project_url)
    return { ...item, image_url: getShowcaseFrameImageUrl(slug, 'desktop') }
  }

  if (item.image_url) return item
  const fallback = getPortfolioImageFallback(item.project_url)
  if (!fallback) return item
  return { ...item, image_url: fallback }
}
