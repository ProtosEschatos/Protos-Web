import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'

const BUCKET = 'showcase'

/** Public Supabase project — showcase assets must be online (Storage CDN), not only in public/showcase/. */
export const SHOWCASE_SUPABASE_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? 'https://laqnnzavwbojntfiqmxj.supabase.co'

function localDevFallback(path: string): string {
  const name = path.split('/').pop() ?? path
  return `/showcase/${name}`
}

export function getShowcaseStorageUrl(path: string): string {
  return `${SHOWCASE_SUPABASE_BASE}/storage/v1/object/public/${BUCKET}/${path}`
}

export const SHOWCASE_STORAGE = {
  project: (slug: string, viewport: 'mobile' | 'desktop') => `projects/${viewport}-${slug}.jpg`,
} as const

/** Primary URL: Supabase Storage CDN (online everywhere — Vercel, 3D, portfolio cards). */
export function getShowcaseFrameImageUrl(slug: string, viewport: ShowcaseViewport): string {
  const key = viewport === 'desktop' ? 'desktop' : 'mobile'
  return getShowcaseStorageUrl(SHOWCASE_STORAGE.project(slug, key))
}

/** Dev fallback when Storage is unreachable — never primary in production. */
export function getShowcaseFrameImageLocalUrl(slug: string, viewport: ShowcaseViewport): string {
  const key = viewport === 'desktop' ? 'desktop' : 'mobile'
  return localDevFallback(`${key}-${slug}.jpg`)
}

/** Supabase CDN first, local public/showcase only as last-resort fallback. */
export function getShowcaseFrameImageSources(slug: string, viewport: ShowcaseViewport): string[] {
  return [getShowcaseFrameImageUrl(slug, viewport), getShowcaseFrameImageLocalUrl(slug, viewport)]
}

/** Portfolio cards — same online Supabase desktop screenshot. */
export function getPortfolioShowcaseImageUrl(slug: string): string {
  return getShowcaseFrameImageUrl(slug, 'desktop')
}

/** @deprecated Use getShowcaseFrameImageUrl — kept for imports that expected a separate fallback name. */
export function getShowcaseFrameImageFallbackUrl(slug: string, viewport: ShowcaseViewport): string {
  return getShowcaseFrameImageLocalUrl(slug, viewport)
}
