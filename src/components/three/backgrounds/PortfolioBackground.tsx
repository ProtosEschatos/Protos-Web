'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity, staggerPhase } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'
import { BACKGROUND_FOG, BACKGROUND_GLOW } from '@/lib/showcase/site-background-routes'

const FRAMES = [
  { x: -5, y: 2, z: -5, w: 1.1, h: 0.65, color: '#6366f1', phase: 0, inner: '#818cf8' },
  { x: 2, y: -1, z: -7, w: 1.3, h: 0.75, color: '#06b6d4', phase: 1.2, inner: '#22d3ee' },
  { x: 5.5, y: 1.5, z: -6, w: 1.0, h: 0.6, color: '#f59e0b', phase: 2.1, inner: '#fbbf24' },
  { x: -2, y: -2.5, z: -9, w: 0.9, h: 0.55, color: '#818cf8', phase: 0.7, inner: '#a5b4fc' },
  { x: 3.5, y: -3, z: -8, w: 1.05, h: 0.62, color: '#ff6600', phase: 1.8, inner: '#ff8833' },
  { x: 0, y: 3.5, z: -10, w: 1.2, h: 0.7, color: '#8b5cf6', phase: 2.6, inner: '#a78bfa' },
]

const THUMBNAILS = [
  { x: -1, y: 0.5, z: -6.5, color: '#6366f1', phase: 0.3 },
  { x: 4, y: -0.5, z: -7.5, color: '#06b6d4', phase: 1.5 },
  { x: -3.5, y: -1.5, z: -8.5, color: '#ff6600', phase: 2.2 },
]

function FloatingThumbnail({
  x,
  y,
  z,
  color,
  phase,
}: {
  x: number
  y: number
  z: number
  color: string
  phase: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + phase
    ref.current.position.x = x + Math.sin(t * 0.4) * 0.6
    ref.current.position.y = y + Math.cos(t * 0.35) * 0.4
    ref.current.rotation.z = Math.sin(t * 0.25) * 0.08
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 0.8, staggerPhase(phase, 4), 0.15, 0.45)
  })

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <planeGeometry args={[0.35, 0.22]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
    </mesh>
  )
}

function DistantFrame({
  x,
  y,
  z,
  w,
  h,
  color,
  inner,
  phase,
}: {
  x: number
  y: number
  z: number
  w: number
  h: number
  color: string
  inner: string
  phase: number
}) {
  const ref = useRef<THREE.Group>(null)
  const shimmerRef = useRef<THREE.Mesh>(null)
  const frameW = 0.025

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + phase
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.12
    ref.current.rotation.z = Math.cos(t * 0.18) * 0.04
    ref.current.position.y = y + Math.sin(t * 0.35) * 0.2

    if (shimmerRef.current) {
      const sweep = ((t * 0.15) % 2) - 1
      shimmerRef.current.position.x = sweep * (w * 0.4)
      const mat = shimmerRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = pulseOpacity(t * 1.2, phase, 0.05, 0.35)
    }
  })

  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[w - frameW * 2, h - frameW * 2]} />
        <meshBasicMaterial color={inner} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh ref={shimmerRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[w * 0.15, h - frameW * 2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      {[
        [0, h / 2, w + frameW, frameW],
        [0, -h / 2, w + frameW, frameW],
        [-w / 2, 0, frameW, h],
        [w / 2, 0, frameW, h],
      ].map(([px, py, fw, fh], i) => (
        <mesh key={i} position={[px, py, 0.02]}>
          <planeGeometry args={[fw, fh]} />
          <meshBasicMaterial color={color} transparent opacity={0.42} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function PortfolioBackground({ isMobile = false }: PageBackgroundProps) {
  const frames = isMobile ? FRAMES.slice(0, 4) : FRAMES
  const thumbs = isMobile ? THUMBNAILS.slice(0, 2) : THUMBNAILS

  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.portfolio} glowColor={BACKGROUND_GLOW.portfolio}>
      {frames.map((f, i) => (
        <DistantFrame key={i} {...f} />
      ))}
      {thumbs.map((t, i) => (
        <FloatingThumbnail key={i} {...t} />
      ))}
    </AmbientBackgroundShell>
  )
}
