export function normalizeProjectUrl(url: string): string {
  return url.replace(/\/$/, '').toLowerCase()
}
