'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/site-background-routes'
import { BACKGROUND_FOG } from '@/lib/site-background-routes'

function FloatingInterfaceFrames({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const frames = useMemo(
    () => [
      { position: [-3.5, 1.55, -10], rotation: [0.1, 0.35, -0.08], scale: [1.5, 0.62, 1] },
      { position: [2.1, -1.45, -8.5], rotation: [-0.08, -0.42, 0.1], scale: [1.1, 0.46, 1] },
      { position: [-1.25, -2.2, -11], rotation: [0.18, 0.1, 0.08], scale: [0.95, 0.38, 1] },
    ] satisfies Array<{
      position: [number, number, number]
      rotation: [number, number, number]
      scale: [number, number, number]
    }>,
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 0.65 + i) * 0.0009
      child.rotation.z += Math.sin(t * 0.4 + i) * 0.0006
    })
  })

  if (isMobile) return null

  return (
    <group ref={groupRef}>
      {frames.map((frame, i) => (
        <mesh
          key={i}
          position={frame.position}
          rotation={frame.rotation}
          scale={frame.scale}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
          <meshBasicMaterial color={i === 1 ? '#06b6d4' : '#ff8800'} transparent opacity={0.16} wireframe depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function SignalNodes({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = isMobile ? 22 : 36

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const column = (i % 9) - 4
      const row = Math.floor(i / 9) - 2
      positions[i * 3] = column * 0.72 + Math.sin(i * 1.7) * 0.22
      positions[i * 3 + 1] = row * 0.58 + Math.cos(i * 1.3) * 0.18
      positions[i * 3 + 2] = -7.5 - (i % 5) * 0.7
      colors[i * 3] = i % 3 === 0 ? 1 : 0.1
      colors[i * 3 + 1] = i % 3 === 1 ? 0.85 : 0.45
      colors[i * 3 + 2] = i % 3 === 2 ? 1 : 0.65
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    pointsRef.current.rotation.y = Math.sin(t * 0.12) * 0.14
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = pulseOpacity(t * 0.7, 0, 0.34, 0.68)
  })

  return (
    <points ref={pointsRef} geometry={geometry} position={isMobile ? [0.2, -0.4, 0] : [-0.7, -0.2, 0]}>
      <pointsMaterial size={isMobile ? 0.055 : 0.045} vertexColors transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function HomeBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.home} showGlow={false}>
      <Stars radius={90} depth={60} count={isMobile ? 900 : 1700} factor={1.8} saturation={0} fade speed={0.2} />
      <FloatingInterfaceFrames isMobile={isMobile} />
      <SignalNodes isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
