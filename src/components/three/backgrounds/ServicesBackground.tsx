'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function HexGrid({ rows, cols, isMobile }: { rows: number; cols: number; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const hexes = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number }> = []
    const size = isMobile ? 0.55 : 0.65
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2) * size * 1.75 + (row % 2) * size * 0.875
        const y = (row - rows / 2) * size * 1.5
        items.push({ x, y, z: (Math.random() - 0.5) * 0.5 })
      }
    }
    return items
  }, [rows, cols, isMobile])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <group ref={groupRef}>
      {hexes.map((h, i) => (
        <mesh key={i} position={[h.x, h.y, h.z]} rotation={[0, 0, Math.PI / 6]}>
          <ringGeometry args={[0.28, 0.34, 6]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ff6600'}
            transparent
            opacity={0.25 + (i % 5) * 0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ServicesBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.2} />
      <HexGrid rows={isMobile ? 5 : 7} cols={isMobile ? 6 : 9} isMobile={isMobile} />
    </SafeCanvas>
  )
}
