'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function DataStreams({ count, isMobile }: { count: number; isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
      spd[i] = 0.008 + Math.random() * 0.02
      col[i * 3] = 1
      col[i * 3 + 1] = 0.4 + Math.random() * 0.3
      col[i * 3 + 2] = 0.1 + Math.random() * 0.2
    }
    return { positions: pos, colors: col, speeds: spd }
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i]
      if (y > 5) y = -5
      attr.setY(i, y)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={isMobile ? 0.025 : 0.035} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

export default function BlogBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.2} />
      <DataStreams count={isMobile ? 80 : 160} isMobile={isMobile} />
    </SafeCanvas>
  )
}
