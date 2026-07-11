'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'

const ADMIN_FOG = '#100818'
const ADMIN_GLOW = '#8b5cf6'

function MistOrbs({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const count = isMobile ? 4 : 7

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const r = 2.5 + (i % 3) * 0.8
        return (
          <MistOrb
            key={i}
            position={[Math.cos(angle) * r, Math.sin(angle * 1.3) * 1.1, Math.sin(angle) * r - 3]}
            index={i}
          />
        )
      })}
    </group>
  )
}

function MistOrb({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 0.4, index * 0.7, 0.06, 0.18)
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + index) * 0.15
  })

  const color = index % 2 === 0 ? '#8b5cf6' : '#ff6600'

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.55 + (index % 3) * 0.15, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
    </mesh>
  )
}

export default function AdminBackground3D({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell
      isMobile={isMobile}
      fogColor={ADMIN_FOG}
      glowColor={ADMIN_GLOW}
      fogNear={35}
      fogFar={85}
      showGlow
    >
      <MistOrbs isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
