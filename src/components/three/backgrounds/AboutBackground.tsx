'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function OrbitRing({
  radius,
  color,
  speed,
  rotation,
  z,
}: {
  radius: number
  color: string
  speed: number
  rotation: [number, number, number]
  z: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * speed
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.05) * 0.02
  })

  return (
    <mesh ref={ref} rotation={rotation} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.008, 6, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.42} depthWrite={false} />
    </mesh>
  )
}

function ConstellationNodes({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const r = 3.5 + (i % 4) * 0.9
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, Math.sin(angle * 1.4) * 1.2, Math.sin(angle) * r - 2]}
          >
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#8b5cf6' : '#06b6d4'} transparent opacity={0.62} depthWrite={false} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function AboutBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <OrbitRing radius={4.5} color="#8b5cf6" speed={0.06} rotation={[Math.PI / 2.8, 0, 0]} z={-3} />
      <OrbitRing radius={6.2} color="#06b6d4" speed={-0.04} rotation={[Math.PI / 3.5, Math.PI / 5, 0]} z={-5} />
      <OrbitRing radius={7.8} color="#ff6600" speed={0.03} rotation={[Math.PI / 2.2, -Math.PI / 6, 0]} z={-7} />
      <ConstellationNodes count={isMobile ? 12 : 22} />
    </AmbientBackgroundShell>
  )
}
