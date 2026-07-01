'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function OrbitRing({
  radius,
  color,
  speed,
  rotation,
}: {
  radius: number
  color: string
  speed: number
  rotation: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.015, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  )
}

function ConstellationNodes({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const r = 1.2 + (i % 3) * 0.6
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle * 1.3) * 0.8,
      z: Math.sin(angle) * r,
    }
  })

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#8b5cf6' : '#06b6d4'} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default function AboutBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.25} />
      <OrbitRing radius={2.2} color="#8b5cf6" speed={0.15} rotation={[Math.PI / 3, 0, 0]} />
      <OrbitRing radius={3.0} color="#06b6d4" speed={-0.1} rotation={[Math.PI / 4, Math.PI / 6, 0]} />
      <OrbitRing radius={3.8} color="#ff6600" speed={0.08} rotation={[Math.PI / 2.5, -Math.PI / 5, 0]} />
      <ConstellationNodes count={isMobile ? 8 : 14} />
    </SafeCanvas>
  )
}
