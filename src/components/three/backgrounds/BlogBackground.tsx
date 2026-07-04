'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'
import { BACKGROUND_FOG, BACKGROUND_GLOW } from '@/lib/site-background-routes'

function DataStreams({ count, isMobile }: { count: number; isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const burstRef = useRef({ nextAt: 3, active: false, t: 0, centerX: 0, centerY: 0 })

  const { positions, colors, speeds, baseX, baseZ } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const bx = new Float32Array(count)
    const bz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      bx[i] = (Math.random() - 0.5) * 24
      pos[i * 3] = bx[i]
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      bz[i] = -6 - Math.random() * 8
      pos[i * 3 + 2] = bz[i]
      spd[i] = 0.004 + Math.random() * 0.012
      col[i * 3] = 1
      col[i * 3 + 1] = 0.4 + Math.random() * 0.25
      col[i * 3 + 2] = 0.08 + Math.random() * 0.12
    }
    return { positions: pos, colors: col, speeds: spd, baseX: bx, baseZ: bz }
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime

    if (t > burstRef.current.nextAt && !burstRef.current.active) {
      burstRef.current = {
        nextAt: t + 4 + Math.random() * 3,
        active: true,
        t: 0,
        centerX: (Math.random() - 0.5) * 12,
        centerY: (Math.random() - 0.5) * 8,
      }
    }
    if (burstRef.current.active) {
      burstRef.current.t += delta
      if (burstRef.current.t > 0.8) burstRef.current.active = false
    }

    const burst = burstRef.current
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i]
      if (y > 8) y = -8
      let x = baseX[i] + Math.sin(t * 0.2 + i * 0.1) * 0.04

      if (burst.active) {
        const dx = x - burst.centerX
        const dy = y - burst.centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 3) {
          x += (dx / Math.max(dist, 0.01)) * burst.t * 0.15
          y += (dy / Math.max(dist, 0.01)) * burst.t * 0.15
        }
      }

      attr.setXYZ(i, x, y, baseZ[i])
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

function BlogScanLine() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = Math.sin(t * 0.4) * 5
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.08 + Math.abs(Math.sin(t * 0.8)) * 0.12
  })

  return (
    <mesh ref={ref} position={[0, 0, -8]}>
      <planeGeometry args={[28, 0.04]} />
      <meshBasicMaterial color="#ff8800" transparent opacity={0.1} depthWrite={false} />
    </mesh>
  )
}

export default function BlogBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.blog} glowColor={BACKGROUND_GLOW.blog}>
      <BlogScanLine />
      <DataStreams count={isMobile ? 100 : 200} isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
