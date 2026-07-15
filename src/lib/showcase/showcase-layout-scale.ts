import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'

/** Smooth scale for desktop/tablet widths — avoids a hard jump at 768px only. */
export function getShowcaseLayoutScale(viewport: ShowcaseViewport, width?: number): number {
  if (viewport === 'mobile') return 1
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1280)
  if (w < 768) return 1
  if (w >= 1920) return 1.08
  if (w >= 1280) return 1
  return 0.92 + ((w - 768) / (1280 - 768)) * 0.08
}

export function lerpScale(min: number, max: number, scale: number): number {
  return min + (max - min) * ((scale - 0.92) / (1.08 - 0.92))
}
