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
  /** Stitched 360° panorama from concept sheet (right|back|left|front) */
  environment360: 'environment/synthwave-360-panorama.jpg',
  /** 2:1 skybox fallback derived from panorama */
  environmentEquirect: 'environment/synthwave-360-equirect.jpg',
  /** Legacy single backdrop */
  environment: 'environment/synthwave-room.jpg',
  project: (slug: string, viewport: 'mobile' | 'desktop') => `projects/${viewport}-${slug}.jpg`,
} as const

export function useShowcaseAssetUrl(storagePath: string, localPath: string) {
  return getShowcaseStorageUrl(storagePath)
}
