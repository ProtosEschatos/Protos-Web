import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'

export const SHOWCASE_CONFIG = {
  moveSpeed: 0.35,
  turnSpeed: 0.05,
  pathLength: 72,
  pathWidth: 18,
  frameSpacing: 14,
  characterHeight: 2,
  horizonZ: -58,
  sunY: 11,
} as const

export const PROJECT_LINKS = [
  {
    color: 0xff0099,
    link: 'https://bodulica.shop',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('bodulica', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('bodulica', 'desktop')),
  },
  {
    color: 0x00eaff,
    link: 'https://zeustrading.online',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('zeustrading', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('zeustrading', 'desktop')),
  },
  {
    color: 0xff8800,
    link: 'https://cosmic-blueprint.net',
    screenshotMobile: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('cosmic-blueprint', 'mobile')),
    screenshotDesktop: getShowcaseStorageUrl(SHOWCASE_STORAGE.project('cosmic-blueprint', 'desktop')),
  },
  {
    color: 0xff66cc,
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

export type FrameTransform = {
  side: number
  x: number
  y: number
  z: number
  rotationY: number
}

export function initCharacterPosition(group: import('three').Group, heading = INITIAL_CHARACTER_HEADING) {
  group.position.set(0, 0, SHOWCASE_CONFIG.pathLength / 2 - 4)
  group.rotation.set(0, heading, 0, 'YXZ')
}

export function getFrameTransform(index: number, centerY = 3.2): FrameTransform {
  const { pathLength, pathWidth, frameSpacing } = SHOWCASE_CONFIG
  const side = index % 2 === 0 ? -1 : 1
  const row = Math.floor(index / 2)
  const startZ = pathLength / 2 - 10
  const z = startZ - row * frameSpacing
  const x = side * (pathWidth / 2 + 3.5)
  return {
    side,
    x,
    y: centerY,
    z,
    rotationY: side === -1 ? Math.PI / 2 : -Math.PI / 2,
  }
}
