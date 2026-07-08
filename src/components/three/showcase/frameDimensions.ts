import type { ShowcaseViewport } from '@/lib/showcase-viewport'

export type FrameDimensions = {
  viewW: number
  viewH: number
  frameW: number
  depth: number
  centerY: number
}

/** Screens enlarged 50% along the diagonal → width and height both scaled by 1.5. */
const DIAGONAL_SCALE = 1.5

export function getFrameDimensions(viewport: ShowcaseViewport): FrameDimensions {
  if (viewport === 'desktop') {
    return {
      viewW: 2.9 * DIAGONAL_SCALE,
      viewH: 1.65 * DIAGONAL_SCALE,
      frameW: 0.11 * DIAGONAL_SCALE,
      depth: 0.1,
      centerY: 2.6,
    }
  }

  return {
    viewW: 1.35 * DIAGONAL_SCALE,
    viewH: 2.75 * DIAGONAL_SCALE,
    frameW: 0.1 * DIAGONAL_SCALE,
    depth: 0.1,
    centerY: 2.9,
  }
}
