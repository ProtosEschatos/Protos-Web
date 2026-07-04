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
  environment360: 'environment/synthwave-360-panorama.jpg',
  project: (slug: string, viewport: 'mobile' | 'desktop') => `projects/${viewport}-${slug}.jpg`,
} as const
