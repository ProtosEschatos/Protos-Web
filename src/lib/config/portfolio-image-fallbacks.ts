/** Local preview images when portfolio_items.image_url is empty in the database. */
const FALLBACKS: Record<string, string> = {
  'bodulica.shop': '/images/portfolio/bodulica.svg',
  'www.bodulica.shop': '/images/portfolio/bodulica.svg',
  'golden-pawn.vercel.app': '/images/portfolio/golden-pawn.svg',
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
  const host = normalizeHost(projectUrl)
  if (!host) return null
  return FALLBACKS[host] ?? FALLBACKS[`www.${host}`] ?? null
}

export function withPortfolioImageFallback<T extends { image_url: string | null; project_url: string | null }>(
  item: T,
): T {
  if (item.image_url) return item
  const fallback = getPortfolioImageFallback(item.project_url)
  if (!fallback) return item
  return { ...item, image_url: fallback }
}
