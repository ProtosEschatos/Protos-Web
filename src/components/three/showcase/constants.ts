import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'

export const SHOWCASE_CONFIG = {
  /** Units per second (legacy was 0.35/frame @ ~60fps) */
  moveSpeed: 21,
  /** Radians per second (legacy was 0.05/frame @ ~60fps) */
  turnSpeed: 3,
  /** Extra speed on touch devices where FPS is often lower */
  mobileSpeedMultiplier: 1.35,
  touchDeadZone: 0.1,
  galleryLength: 48,
  galleryWidth: 24,
  galleryHeight: 10,
  frameSpacing: 8,
  characterHeight: 2,
} as const

export const PROJECT_LINKS = [
  {
    color: 0x6366f1,
    link: 'https://bodulica.shop',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('bodulica', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('bodulica', 'desktop')),
  },
  {
    color: 0x06b6d4,
    link: 'https://zeustrading.online',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('zeustrading', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('zeustrading', 'desktop')),
  },
  {
    color: 0xf59e0b,
    link: 'https://cosmic-blueprint.net',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('cosmic-blueprint', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('cosmic-blueprint', 'desktop')),
  },
  {
    color: 0x818cf8,
    link: 'https://protosweb.eu',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('protosweb', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('protosweb', 'desktop')),
  },
] as const

export const INITIAL_CHARACTER_HEADING = 0

export type ShowcaseProject = {
  title: string
  description: string
  color: number
  link: string
  imageUrl: string | null
}

export type FrameMarker = {
  x: number
  z: number
  color: number
}

export function initCharacterPosition(group: import('three').Group, heading = INITIAL_CHARACTER_HEADING) {
  group.position.set(0, 0, SHOWCASE_CONFIG.galleryLength / 2 - 3)
  group.rotation.set(0, heading, 0, 'YXZ')
}

export type FrameTransform = {
  side: number
  x: number
  y: number
  z: number
  rotationY: number
  floorX: number
}

export function getFrameTransform(index: number, centerY = 2.45): FrameTransform {
  const { galleryLength, galleryWidth, frameSpacing } = SHOWCASE_CONFIG
  const side = index % 2 === 0 ? -1 : 1
  const row = Math.floor(index / 2)
  const startZ = -galleryLength / 2 + 6
  const z = startZ + row * frameSpacing
  const inset = 0.25
  const x = side * (galleryWidth / 2 - inset)
  return {
    side,
    x,
    y: centerY,
    z,
    rotationY: side === -1 ? Math.PI / 2 : -Math.PI / 2,
    floorX: side * (galleryWidth / 2 - 2.5),
  }
}

export function getFrameMarkers(): FrameMarker[] {
  return PROJECT_LINKS.map((meta, index) => {
    const { z, floorX } = getFrameTransform(index)
    return {
      x: floorX,
      z,
      color: meta.color,
    }
  })
}
