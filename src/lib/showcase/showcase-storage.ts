import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import {
  SHOWCASE_STORAGE,
  STORAGE_BUCKETS,
  getPublicStorageUrl,
} from '@/lib/assets/storage-cdn'

export { SUPABASE_STORAGE_BASE as SHOWCASE_SUPABASE_BASE } from '@/lib/assets/storage-cdn'

function showcaseUrl(path: string): string {
  return getPublicStorageUrl(STORAGE_BUCKETS.showcase, path)
}

/** Online Supabase CDN — primary for 3D frames, portfolio cards, everywhere. */
export function getShowcaseFrameImageUrl(slug: string, viewport: ShowcaseViewport): string {
  const key = viewport === 'desktop' ? 'desktop' : 'mobile'
  return showcaseUrl(SHOWCASE_STORAGE.project(slug, key))
}

/** Production uses Supabase CDN only — no local /showcase/ paths at runtime. */
export function getShowcaseFrameImageSources(slug: string, viewport: ShowcaseViewport): string[] {
  return [getShowcaseFrameImageUrl(slug, viewport)]
}

export function getPortfolioShowcaseImageUrl(slug: string): string {
  return getShowcaseFrameImageUrl(slug, 'desktop')
}

/** @deprecated */
export function getShowcaseStorageUrl(path: string): string {
  return showcaseUrl(path)
}

/** @deprecated */
export function getShowcaseFrameImageLocalUrl(slug: string, viewport: ShowcaseViewport): string {
  return getShowcaseFrameImageUrl(slug, viewport)
}

/** @deprecated */
export function getShowcaseFrameImageFallbackUrl(slug: string, viewport: ShowcaseViewport): string {
  return getShowcaseFrameImageUrl(slug, viewport)
}
