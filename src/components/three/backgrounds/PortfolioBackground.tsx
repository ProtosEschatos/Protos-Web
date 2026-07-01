'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

const FRAMES = [
  { x: -5, y: 2, z: -5, w: 1.1, h: 0.65, color: '#6366f1', phase: 0 },
  { x: 2, y: -1, z: -7, w: 1.3, h: 0.75, color: '#06b6d4', phase: 1.2 },
  { x: 5.5, y: 1.5, z: -6, w: 1.0, h: 0.6, color: '#f59e0b', phase: 2.1 },
  { x: -2, y: -2.5, z: -9, w: 0.9, h: 0.55, color: '#818cf8', phase: 0.7 },
  { x: 3.5, y: -3, z: -8, w: 1.05, h: 0.62, color: '#ff6600', phase: 1.8 },
  { x: 0, y: 3.5, z: -10, w: 1.2, h: 0.7, color: '#8b5cf6', phase: 2.6 },
]

function DistantFrame({
  x,
  y,
  z,
  w,
  h,
  color,
  phase,
}: {
  x: number
  y: number
  z: number
  w: number
  h: number
  color: string
  phase: number
}) {
  const ref = useRef<THREE.Group>(null)
  const frameW = 0.025

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + phase
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.12
    ref.current.rotation.z = Math.cos(t * 0.18) * 0.04
    ref.current.position.y = y + Math.sin(t * 0.35) * 0.2
  })

  return (
    <group ref={ref} position={[x, y, z]}>
      {[
        [0, h / 2, w + frameW, frameW],
        [0, -h / 2, w + frameW, frameW],
        [-w / 2, 0, frameW, h],
        [w / 2, 0, frameW, h],
      ].map(([px, py, fw, fh], i) => (
        <mesh key={i} position={[px, py, 0]}>
          <planeGeometry args={[fw, fh]} />
          <meshBasicMaterial color={color} transparent opacity={0.14} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function PortfolioBackground({ isMobile = false }: PageBackgroundProps) {
  const frames = isMobile ? FRAMES.slice(0, 4) : FRAMES

  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      {frames.map((f, i) => (
        <DistantFrame key={i} {...f} />
      ))}
    </AmbientBackgroundShell>
  )
}
