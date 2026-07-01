'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function RadarPulse({ delay, color, z }: { delay: number; color: string; z: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime + delay) % 4.5
    const scale = 0.8 + t * 2.2
    ref.current.scale.set(scale, scale, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, 0.32 - t * 0.07)
  })

  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <ringGeometry args={[1.2, 1.25, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function SweepLine() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.35
  })

  return (
    <mesh ref={ref} position={[0, 0, -7]}>
      <planeGeometry args={[0.02, 12]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.45} depthWrite={false} />
    </mesh>
  )
}

export default function ContactBackground({ isMobile = false }: PageBackgroundProps) {
  const pulses = isMobile ? 4 : 6

  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <mesh position={[0, 0, -8]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {Array.from({ length: pulses }, (_, i) => (
        <RadarPulse key={i} delay={i * 0.75} color={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'} z={-7 - i * 0.5} />
      ))}
      <SweepLine />
    </AmbientBackgroundShell>
  )
}
