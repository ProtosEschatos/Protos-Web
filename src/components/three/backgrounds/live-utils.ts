import * as THREE from 'three'

/** Offset animation phase by index so elements don't pulse in sync. */
export function staggerPhase(index: number, period: number): number {
  return (index / Math.max(period, 1)) * Math.PI * 2
}

/** Sinusoidal opacity pulse between min and max. */
export function pulseOpacity(t: number, phase: number, min: number, max: number): number {
  const mid = (min + max) / 2
  const amp = (max - min) / 2
  return mid + Math.sin(t + phase) * amp
}

/** Sinusoidal scale pulse around 1.0. */
export function pulseScale(t: number, phase: number, amplitude: number): number {
  return 1 + Math.sin(t + phase) * amplitude
}

export type Vec3 = { x: number; y: number; z: number }

/** Linear interpolation along a closed or open path of 3D points. t in [0, 1]. */
export function lerpAlongPath(points: Vec3[], t: number): Vec3 {
  if (points.length === 0) return { x: 0, y: 0, z: 0 }
  if (points.length === 1) return points[0]

  const segments = points.length - 1
  const scaled = t * segments
  const idx = Math.min(Math.floor(scaled), segments - 1)
  const localT = scaled - idx
  const a = points[idx]
  const b = points[idx + 1]

  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT,
    z: a.z + (b.z - a.z) * localT,
  }
}

/** Ripple wave value 0–1 based on distance from wave front. */
export function rippleWave(t: number, index: number, speed: number, width: number): number {
  const front = (t * speed) % 1
  const cell = index / 100
  const dist = Math.abs(cell - front)
  const wrapped = Math.min(dist, 1 - dist)
  return Math.max(0, 1 - wrapped / width)
}

/** Smooth step for fade in/out. */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Random point on a ring in XY plane. */
export function pointOnRing(radius: number, angle: number): THREE.Vector2 {
  return new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius)
}
