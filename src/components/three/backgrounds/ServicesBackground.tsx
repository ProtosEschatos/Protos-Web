'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function HexField({ rows, cols }: { rows: number; cols: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const hexes = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number; i: number }> = []
    const size = 0.85
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        items.push({
          x: (col - cols / 2) * size * 1.75 + (row % 2) * size * 0.875,
          y: (row - rows / 2) * size * 1.5,
          z: -5 - Math.random() * 6,
          i: row * cols + col,
        })
      }
    }
    return items
  }, [rows, cols])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.06) * 0.03
    groupRef.current.rotation.y = t * 0.02
  })

  return (
    <group ref={groupRef}>
      {hexes.map((h) => (
        <mesh key={h.i} position={[h.x, h.y, h.z]} rotation={[0, 0, Math.PI / 6]}>
          <ringGeometry args={[0.22, 0.26, 6]} />
          <meshBasicMaterial
            color={h.i % 3 === 0 ? '#06b6d4' : h.i % 3 === 1 ? '#8b5cf6' : '#ff6600'}
            transparent
            opacity={0.22 + (h.i % 4) * 0.04}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ServicesBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <HexField rows={isMobile ? 6 : 9} cols={isMobile ? 7 : 11} />
    </AmbientBackgroundShell>
  )
}
