'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function DistantParticleSphere({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const count = isMobile ? 600 : 1200

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 5 + Math.random() * 2
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) - 4
      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.35 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.05 + Math.random() * 0.15
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.025
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial size={0.018} vertexColors transparent opacity={0.72} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function HomeBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <Stars radius={90} depth={60} count={isMobile ? 1200 : 2200} factor={2.2} saturation={0} fade speed={0.35} />
      <DistantParticleSphere isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
