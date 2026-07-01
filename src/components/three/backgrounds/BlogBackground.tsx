'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function DataStreams({ count, isMobile }: { count: number; isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = -6 - Math.random() * 8
      spd[i] = 0.004 + Math.random() * 0.012
      col[i * 3] = 1
      col[i * 3 + 1] = 0.4 + Math.random() * 0.25
      col[i * 3 + 2] = 0.08 + Math.random() * 0.12
    }
    return { positions: pos, colors: col, speeds: spd }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i]
      if (y > 8) y = -8
      attr.setY(i, y)
      attr.setX(i, attr.getX(i) + Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.0008)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.018 : 0.028}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function BlogBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <DataStreams count={isMobile ? 100 : 200} isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
