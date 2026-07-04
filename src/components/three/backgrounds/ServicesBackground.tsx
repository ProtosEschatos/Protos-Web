'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity, rippleWave } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/site-background-routes'
import { BACKGROUND_FOG, BACKGROUND_GLOW } from '@/lib/site-background-routes'

const COLORS = ['#06b6d4', '#8b5cf6', '#ff6600'] as const

function HexField({ rows, cols }: { rows: number; cols: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const hexes = useMemo(() => {
    const items: Array<{ x: number; y: number; z: number; i: number; colorIdx: number }> = []
    const size = 0.85
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col
        items.push({
          x: (col - cols / 2) * size * 1.75 + (row % 2) * size * 0.875,
          y: (row - rows / 2) * size * 1.5,
          z: -5 - (i % 7) * 0.9,
          i,
          colorIdx: i % 3,
        })
      }
    }
    return items
  }, [rows, cols])

  const burstRef = useRef({ active: false, t: 0, centerIdx: 0 })
  const lastBurstSecond = useRef(-1)

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.06) * 0.03
    groupRef.current.rotation.y = t * 0.02

    const sec = Math.floor(t)
    if (sec !== lastBurstSecond.current && sec % 5 === 0) {
      lastBurstSecond.current = sec
      burstRef.current = { active: true, t: 0, centerIdx: Math.floor(Math.random() * hexes.length) }
    }
    if (burstRef.current.active) {
      burstRef.current.t += state.clock.getDelta()
      if (burstRef.current.t > 1.2) burstRef.current.active = false
    }

    hexes.forEach((h, idx) => {
      const ripple = rippleWave(t * 0.12, h.i, 1, 0.08)
      let burstScale = 1
      if (burstRef.current.active) {
        const dist = Math.abs(h.i - burstRef.current.centerIdx)
        const wave = Math.max(0, 1 - dist / 12 - burstRef.current.t * 0.8)
        burstScale = 1 + wave * 0.5
      }

      dummy.position.set(h.x, h.y, h.z)
      dummy.rotation.set(0, 0, Math.PI / 6)
      dummy.scale.setScalar((0.85 + ripple * 0.35) * burstScale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(idx, dummy.matrix)

      const color = new THREE.Color(COLORS[h.colorIdx])
      color.multiplyScalar(0.65 + ripple * 0.55)
      meshRef.current!.setColorAt(idx, color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, hexes.length]}>
        <ringGeometry args={[0.22, 0.26, 6]} />
        <meshBasicMaterial transparent opacity={0.32} depthWrite={false} vertexColors />
      </instancedMesh>
    </group>
  )
}

export default function ServicesBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.services} glowColor={BACKGROUND_GLOW.services}>
      <HexField rows={isMobile ? 6 : 9} cols={isMobile ? 7 : 11} />
    </AmbientBackgroundShell>
  )
}
