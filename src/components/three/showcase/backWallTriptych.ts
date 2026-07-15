import { SHOWCASE_CONFIG } from './constants'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { getShowcaseLayoutScale, lerpScale } from '@/lib/showcase/showcase-layout-scale'
import { getFrameDimensions } from './frameDimensions'

export type BackWallTriptychLayout = {
  z: number
  textZ: number
  centerY: number
  inscriptionY: number
  thirdWidth: number
  leftX: number
  centerX: number
  rightX: number
  textPlaneW: number
  textPlaneH: number
  dividerX: [number, number]
  bandW: number
  bandH: number
  floorMarkerZ: number
}

export function getBackWallCenterY(viewport: ShowcaseViewport, width?: number): number {
  const { centerY } = getFrameDimensions(viewport, width)
  const scale = getShowcaseLayoutScale(viewport, width)
  const lift = viewport === 'mobile' ? 1.0 : lerpScale(1.05, 1.35, scale)
  return centerY + lift
}

/** Back wall split in thirds: inscription | poklon | inscription. */
export function getBackWallTriptychLayout(viewport: ShowcaseViewport, width?: number): BackWallTriptychLayout {
  const { galleryWidth, galleryLength } = SHOWCASE_CONFIG
  const scale = getShowcaseLayoutScale(viewport, width)
  const centerY = getBackWallCenterY(viewport, width)
  const thirdWidth = galleryWidth / 3
  const z = -galleryLength / 2 + 0.35
  const compact = viewport === 'mobile'
  const textPlaneH = compact ? 4.8 : lerpScale(5.0, 6.2, scale)
  const textPlaneW = thirdWidth * (compact ? 0.9 : lerpScale(0.88, 0.94, scale))
  const bandH = compact ? 5.2 : lerpScale(5.4, 6.4, scale)
  const inscriptionY = centerY + (compact ? 0.15 : lerpScale(0.2, 0.45, scale))

  return {
    z,
    textZ: z + 0.06,
    centerY,
    inscriptionY,
    thirdWidth,
    leftX: -thirdWidth,
    centerX: 0,
    rightX: thirdWidth,
    textPlaneW,
    textPlaneH,
    dividerX: [-thirdWidth / 2, thirdWidth / 2],
    bandW: galleryWidth - 0.6,
    bandH,
    floorMarkerZ: z + 1.4,
  }
}
