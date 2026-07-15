import { SHOWCASE_CONFIG } from './constants'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { getFrameDimensions } from './frameDimensions'

export type BackWallTriptychLayout = {
  z: number
  textZ: number
  centerY: number
  thirdWidth: number
  leftX: number
  centerX: number
  rightX: number
  textPlaneW: number
  textPlaneH: number
  dividerX: [number, number]
  bandW: number
  bandH: number
}

export function getBackWallCenterY(viewport: ShowcaseViewport): number {
  const { centerY } = getFrameDimensions(viewport)
  const lift = viewport === 'mobile' ? 1.0 : 1.45
  return centerY + lift
}

/** Back wall split in thirds: inscription | poklon | inscription. */
export function getBackWallTriptychLayout(viewport: ShowcaseViewport): BackWallTriptychLayout {
  const { galleryWidth, galleryLength } = SHOWCASE_CONFIG
  const centerY = getBackWallCenterY(viewport)
  const thirdWidth = galleryWidth / 3
  const z = -galleryLength / 2 + 0.35
  const compact = viewport === 'mobile'

  return {
    z,
    textZ: z + 0.06,
    centerY,
    thirdWidth,
    leftX: -thirdWidth,
    centerX: 0,
    rightX: thirdWidth,
    textPlaneW: thirdWidth * (compact ? 0.9 : 0.95),
    textPlaneH: compact ? 4.8 : 6.8,
    dividerX: [-thirdWidth / 2, thirdWidth / 2],
    bandW: galleryWidth - 0.6,
    bandH: compact ? 5.2 : 6.8,
  }
}
