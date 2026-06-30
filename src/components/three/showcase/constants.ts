export const SHOWCASE_CONFIG = {
  moveSpeed: 0.35,
  turnSpeed: 0.05,
  galleryLength: 24,
  galleryWidth: 12,
  galleryHeight: 10,
  frameSpacing: 8,
  characterHeight: 2,
} as const

export const PROJECT_LINKS = [
  { color: 0x6366f1, link: 'https://bodulica.shop', screenshot: '/showcase/mobile-bodulica.jpg' },
  { color: 0x06b6d4, link: 'https://zeustrading.online', screenshot: '/showcase/mobile-zeustrading.jpg' },
  { color: 0xf59e0b, link: 'https://cosmic-blueprint.net', screenshot: '/showcase/mobile-cosmic-blueprint.jpg' },
  { color: 0x818cf8, link: 'https://www.protosweb.eu', screenshot: '/showcase/mobile-protosweb.jpg' },
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

export function getFrameMarkers(): FrameMarker[] {
  const { galleryLength, galleryWidth, frameSpacing } = SHOWCASE_CONFIG
  const startZ = -galleryLength / 2 + 6
  return PROJECT_LINKS.map((meta, index) => {
    const side = index % 2 === 0 ? -1 : 1
    const row = Math.floor(index / 2)
    const z = startZ + row * frameSpacing
    return {
      x: side * (galleryWidth / 2 - 2),
      z,
      color: meta.color,
    }
  })
}
