'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'

/**
 * Cyberpunk multi-lane flying-cars background layer.
 *
 * Procedural low-poly cars in 6 parallax lanes (3 on mobile) with additive
 * neon underglow, headlights, and elongated light trails. No GLB dependency —
 * intentionally low-poly to match the cyberpunk aesthetic and keep the frame
 * budget cheap enough to stack on top of the existing starfield.
 *
 * Positioning is chosen so cars stay comfortably behind the fog band
 * (fogNear=42, fogFar=92 in AmbientBackgroundShell) — they emerge from fog,
 * cross the visible strip, and dissolve into fog again on the opposite side.
 */

type CarLane = {
  /** Base Y position — different lanes at different heights. */
  yBase: number
  /** Z depth — negative = farther from camera. */
  z: number
  /** Signed speed in world units / second. Sign controls direction. */
  speed: number
  /** Neon accent color (headlights, underglow, trail). */
  colorHex: string
  /** Overall car scale — closer cars appear larger. */
  scale: number
  /** Time offset so cars never sync-spawn. */
  phase: number
}

/** Half-span across which a car travels before wrapping to the other edge. */
const HALF_SPAN = 22

const DESKTOP_LANES: CarLane[] = [
  { yBase: -2.6, z: -8, speed: 3.2, colorHex: '#00e5ff', scale: 2.6, phase: 0.0 },
  { yBase: 0.5, z: -12, speed: 2.4, colorHex: '#ff2bd6', scale: 3.4, phase: 1.6 },
  { yBase: 2.1, z: -6, speed: 4.0, colorHex: '#f9ff2b', scale: 2.2, phase: 2.9 },
  { yBase: -1.1, z: -14, speed: -2.1, colorHex: '#ff2b6b', scale: 3.9, phase: 4.1 },
  { yBase: 1.6, z: -10, speed: -3.4, colorHex: '#2bff9d', scale: 2.8, phase: 0.9 },
  { yBase: -0.4, z: -7, speed: -2.8, colorHex: '#ff8a2b', scale: 2.4, phase: 4.6 },
]

const MOBILE_LANES: CarLane[] = [DESKTOP_LANES[1], DESKTOP_LANES[3], DESKTOP_LANES[4]]

function useCarMaterials(colorHex: string) {
  return useMemo(() => {
    const color = new THREE.Color(colorHex)
    return {
      chassis: new THREE.MeshStandardMaterial({
        color: '#0a0a1a',
        metalness: 0.72,
        roughness: 0.28,
      }),
      cabin: new THREE.MeshStandardMaterial({
        color: '#111124',
        metalness: 0.5,
        roughness: 0.45,
        emissive: color,
        emissiveIntensity: 0.18,
      }),
      neon: new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      neonSoft: new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      headlight: new THREE.MeshBasicMaterial({ color }),
    }
  }, [colorHex])
}

function Car({ lane }: { lane: CarLane }) {
  const groupRef = useRef<THREE.Group>(null)
  const mats = useCarMaterials(lane.colorHex)
  const loopSpan = HALF_SPAN * 2

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime + lane.phase
    const forward = lane.speed > 0
    const traversed = (t * Math.abs(lane.speed)) % loopSpan
    const x = forward ? -HALF_SPAN + traversed : HALF_SPAN - traversed
    // Subtle hover so the cars feel like they're floating, not sliding on rails.
    const y = lane.yBase + Math.sin(t * 1.15) * 0.07
    groupRef.current.position.set(x, y, lane.z)
    groupRef.current.rotation.y = forward ? 0 : Math.PI
  })

  return (
    <group ref={groupRef} scale={lane.scale}>
      {/* Main chassis */}
      <mesh material={mats.chassis}>
        <boxGeometry args={[1.4, 0.22, 0.55]} />
      </mesh>
      {/* Cabin / greenhouse — slightly back and up */}
      <mesh position={[-0.08, 0.19, 0]} material={mats.cabin}>
        <boxGeometry args={[0.7, 0.2, 0.42]} />
      </mesh>
      {/* Underglow — horizontal neon pad below the chassis */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.neon}>
        <planeGeometry args={[1.65, 0.75]} />
      </mesh>
      {/* Headlights — twin dots at the front */}
      <mesh position={[0.72, 0.02, 0.16]} material={mats.headlight}>
        <sphereGeometry args={[0.055, 10, 10]} />
      </mesh>
      <mesh position={[0.72, 0.02, -0.16]} material={mats.headlight}>
        <sphereGeometry args={[0.055, 10, 10]} />
      </mesh>
      {/* Light trail — long additive plane trailing behind */}
      <mesh position={[-1.6, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.neonSoft}>
        <planeGeometry args={[2.6, 0.32]} />
      </mesh>
      {/* Roof strip — thin neon accent so cars remain visible against dark fog */}
      <mesh position={[-0.08, 0.31, 0]} material={mats.neon}>
        <boxGeometry args={[0.55, 0.02, 0.05]} />
      </mesh>
    </group>
  )
}

export default function FlyingCars({ isMobile = false }: PageBackgroundProps) {
  const lanes = isMobile ? MOBILE_LANES : DESKTOP_LANES
  return (
    <group>
      {lanes.map((lane, i) => (
        <Car key={`${lane.colorHex}-${i}`} lane={lane} />
      ))}
    </group>
  )
}
