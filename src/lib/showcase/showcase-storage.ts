import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'

const BUCKET = 'showcase'

function localFallback(path: string): string {
  if (path.startsWith('environment/')) return `/showcase/${path}`
  const name = path.split('/').pop() ?? path
  return `/showcase/${name}`
}

export function getShowcaseStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) return localFallback(path)
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}

export const SHOWCASE_STORAGE = {
  project: (slug: string, viewport: 'mobile' | 'desktop') => `projects/${viewport}-${slug}.jpg`,
} as const

/**
 * Same-origin screenshot for 3D frame textures (WebGL + Three.js).
 * Files live in public/showcase/ — avoids cross-origin texture failures.
 */
export function getShowcaseFrameImageUrl(slug: string, viewport: ShowcaseViewport): string {
  const key = viewport === 'desktop' ? 'desktop' : 'mobile'
  return `/showcase/${key}-${slug}.jpg`
}

/** Supabase CDN mirror — used when local public file fails or on preview deploys. */
export function getShowcaseFrameImageFallbackUrl(slug: string, viewport: ShowcaseViewport): string {
  const key = viewport === 'desktop' ? 'desktop' : 'mobile'
  return getShowcaseStorageUrl(SHOWCASE_STORAGE.project(slug, key))
}

/** Local first, then Supabase Storage CDN. */
export function getShowcaseFrameImageSources(slug: string, viewport: ShowcaseViewport): string[] {
  const primary = getShowcaseFrameImageUrl(slug, viewport)
  const remote = getShowcaseFrameImageFallbackUrl(slug, viewport)
  if (primary === remote) return [primary]
  return [primary, remote]
}

/** Portfolio cards always use optimized local desktop JPEG from public/showcase/. */
export function getPortfolioShowcaseImageUrl(slug: string): string {
  return getShowcaseFrameImageUrl(slug, 'desktop')
}
