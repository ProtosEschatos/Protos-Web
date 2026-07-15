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

export type ProjectLink = {
  color: number
  link: string
  screenshotMobile: string
  screenshotDesktop: string
}

// Empty until real projects are ready to publish. Add entries here (screenshots via
// getShowcaseStorageUrl from '@/lib/showcase/showcase-storage') to populate the gallery; any
// remaining FRAME_SLOTS render as empty placeholder frames.
export const PROJECT_LINKS: ProjectLink[] = []

export const INITIAL_CHARACTER_HEADING = 0

export function showcaseFrameSlotCount(projectCount: number): number {
  return Math.max(projectCount, 1)
}

export type ShowcaseProject = {
  title: string
  description: string
  color: number
  link: string
  imageUrl: string | null
  imageSources: string[]
}

export type FrameMarker = {
  x: number
  z: number
  color: number
}

export function initCharacterPosition(group: import('three').Group, heading = INITIAL_CHARACTER_HEADING) {
  // Start mid-gallery so side-wall frames are visible immediately (not at far entrance).
  group.position.set(0, 0, 4)
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
