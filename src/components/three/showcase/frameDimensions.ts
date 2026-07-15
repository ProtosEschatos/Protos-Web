import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'

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
      viewW: 3.85,
      viewH: 2.18,
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
