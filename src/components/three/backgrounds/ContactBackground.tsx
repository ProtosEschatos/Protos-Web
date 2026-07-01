'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function RadarPulse({ delay, color }: { delay: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime + delay) % 3
    const scale = 0.5 + t * 1.2
    ref.current.scale.set(scale, scale, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, 0.45 - t * 0.15)
  })

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.8, 0.85, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SweepLine() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.6
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[0.04, 4.5]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
    </mesh>
  )
}

export default function ContactBackground({ isMobile = false }: PageBackgroundProps) {
  const pulses = isMobile ? 3 : 5

  return (
    <SafeCanvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.2} />
      <mesh>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
      </mesh>
      {Array.from({ length: pulses }, (_, i) => (
        <RadarPulse key={i} delay={i * 0.6} color={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'} />
      ))}
      <SweepLine />
    </SafeCanvas>
  )
}
