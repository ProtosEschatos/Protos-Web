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

/** Back wall split in thirds: inscription | poklon | inscription. */
export function getBackWallTriptychLayout(viewport: ShowcaseViewport): BackWallTriptychLayout {
  const { galleryWidth, galleryLength } = SHOWCASE_CONFIG
  const { centerY } = getFrameDimensions(viewport)
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
    textPlaneW: thirdWidth * (compact ? 0.82 : 0.88),
    textPlaneH: compact ? 2.4 : 3.4,
    dividerX: [-thirdWidth / 2, thirdWidth / 2],
    bandW: galleryWidth - 0.6,
    bandH: compact ? 3.6 : 4.6,
  }
}
