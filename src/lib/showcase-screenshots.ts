/** Same-origin proxy URL for WebGL textures (avoids CORS). */
export function getProjectScreenshotUrl(siteUrl: string, viewport: 'mobile' | 'desktop' = 'mobile'): string {
  return `/api/showcase-screenshot?url=${encodeURIComponent(siteUrl)}&viewport=${viewport}`
}

export function normalizeProjectUrl(url: string): string {
  return url.replace(/\/$/, '').toLowerCase()
}
