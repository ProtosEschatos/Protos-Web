import { isAllowedPortfolioUrl } from '@/lib/showcase/showcase-allowlist'
import { portfolioUrlToShowcaseSlug } from '@/lib/showcase/portfolio-slug'
import { getPortfolioShowcaseImageUrl } from '@/lib/showcase/showcase-storage'
import { SITE_STORAGE, STORAGE_BUCKETS, getPublicStorageUrl } from '@/lib/assets/storage-cdn'

const PORTFOLIO_SVG_BY_HOST: Record<string, string> = {
  'bodulica.shop': 'bodulica',
  'www.bodulica.shop': 'bodulica',
  'golden-pawn.vercel.app': 'golden-pawn',
  'auto-moto.vercel.app': 'auto-moto',
  'lumina-dent.vercel.app': 'dentalna-ordinacija',
}

function normalizeHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function getPortfolioSvgUrl(name: string): string {
  return getPublicStorageUrl(STORAGE_BUCKETS.site, SITE_STORAGE.portfolioSvg(name))
}

export function getPortfolioImageFallback(projectUrl: string | null | undefined): string | null {
  if (!projectUrl) return null

  if (isAllowedPortfolioUrl(projectUrl)) {
    return getPortfolioShowcaseImageUrl(portfolioUrlToShowcaseSlug(projectUrl))
  }

  const host = normalizeHost(projectUrl)
  if (!host) return null
  const svgName = PORTFOLIO_SVG_BY_HOST[host] ?? PORTFOLIO_SVG_BY_HOST[`www.${host}`]
  if (!svgName) return null
  return getPortfolioSvgUrl(svgName)
}

export function withPortfolioImageFallback<T extends { image_url: string | null; project_url: string | null }>(
  item: T,
): T {
  if (item.project_url && isAllowedPortfolioUrl(item.project_url)) {
    const slug = portfolioUrlToShowcaseSlug(item.project_url)
    return { ...item, image_url: getPortfolioShowcaseImageUrl(slug) }
  }

  if (item.image_url?.startsWith('http')) return item

  const fallback = getPortfolioImageFallback(item.project_url)
  if (!fallback) return item
  return { ...item, image_url: fallback }
}
