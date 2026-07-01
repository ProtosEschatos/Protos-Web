import type { ShowcaseViewport } from '@/lib/showcase-viewport'

export type FrameDimensions = {
  viewW: number
  viewH: number
  frameW: number
  depth: number
  centerY: number
}

export function getFrameDimensions(viewport: ShowcaseViewport): FrameDimensions {
  if (viewport === 'desktop') {
    return {
      viewW: 2.9,
      viewH: 1.65,
      frameW: 0.11,
      depth: 0.1,
      centerY: 2.35,
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
