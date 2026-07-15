/**
 * Single source of truth for production asset URLs (Supabase Storage CDN).
 * Local files under public/ are source inputs — upload via npm run sync:production-assets.
 */

export const SUPABASE_STORAGE_BASE =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? 'https://laqnnzavwbojntfiqmxj.supabase.co'

export const STORAGE_BUCKETS = {
  showcase: 'showcase',
  site: 'site-assets',
} as const

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

/** Public object URL on Supabase Storage CDN. */
export function getPublicStorageUrl(bucket: StorageBucket, path: string): string {
  const normalized = path.replace(/^\/+/, '')
  return `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/${bucket}/${normalized}`
}

export const SHOWCASE_STORAGE = {
  project: (slug: string, viewport: 'mobile' | 'desktop') => `projects/${viewport}-${slug}.jpg`,
  giftWallInscription: 'environment/gift-wall-inscription.png',
} as const

export const SITE_STORAGE = {
  portfolioSvg: (name: string) => `portfolio/${name}.svg`,
  loaderVideo: 'loader/boot-bg.mp4',
  favicon: 'brand/favicon.svg',
  ogImage: 'brand/og-image.svg',
} as const

export const siteFaviconUrl = getPublicStorageUrl(STORAGE_BUCKETS.site, SITE_STORAGE.favicon)
export const siteBrandOgImageUrl = getPublicStorageUrl(STORAGE_BUCKETS.site, SITE_STORAGE.ogImage)
export const giftWallInscriptionUrl = getPublicStorageUrl(
  STORAGE_BUCKETS.showcase,
  SHOWCASE_STORAGE.giftWallInscription,
)
