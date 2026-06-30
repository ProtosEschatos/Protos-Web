/** Same-origin proxy URL for WebGL textures (avoids CORS). */
export function getProjectScreenshotUrl(siteUrl: string): string {
  return `/api/showcase-screenshot?url=${encodeURIComponent(siteUrl)}`
}

export function normalizeProjectUrl(url: string): string {
  return url.replace(/\/$/, '').toLowerCase()
}
