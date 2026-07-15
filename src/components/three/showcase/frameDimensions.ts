import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { getShowcaseLayoutScale, lerpScale } from '@/lib/showcase/showcase-layout-scale'

export type FrameDimensions = {
  viewW: number
  viewH: number
  frameW: number
  depth: number
  centerY: number
}

export function getFrameDimensions(viewport: ShowcaseViewport, width?: number): FrameDimensions {
  const scale = getShowcaseLayoutScale(viewport, width)

  if (viewport === 'desktop') {
    return {
      viewW: lerpScale(3.35, 3.85, scale),
      viewH: lerpScale(1.95, 2.18, scale),
      frameW: 0.12,
      depth: 0.1,
      centerY: 2.45,
    }
  }

  return {
    viewW: 1.35,
    viewH: 2.75,
    frameW: 0.1,
    depth: 0.1,
    centerY: 2.45,
  }
}
