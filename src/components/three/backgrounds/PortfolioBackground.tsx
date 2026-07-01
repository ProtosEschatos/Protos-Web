'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

const FRAME_LAYOUT = [
  { x: -2.5, y: 1.2, z: 0, w: 1.4, h: 0.9, color: '#6366f1' },
  { x: 0, y: -0.5, z: -0.5, w: 1.6, h: 1.0, color: '#06b6d4' },
  { x: 2.5, y: 1.0, z: 0.3, w: 1.3, h: 0.85, color: '#f59e0b' },
  { x: -1.2, y: -1.5, z: 0.2, w: 1.2, h: 0.75, color: '#818cf8' },
  { x: 1.5, y: -1.8, z: -0.3, w: 1.1, h: 0.7, color: '#ff6600' },
  { x: 0, y: 2.0, z: -0.8, w: 1.5, h: 0.95, color: '#8b5cf6' },
]

function FloatingFrame({
  x,
  y,
  z,
  w,
  h,
  color,
  speed,
}: {
  x: number
  y: number
  z: number
  w: number
  h: number
  color: string
  speed: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.15
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.08
  })

  const frameW = 0.06

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.2}>
      <group ref={groupRef} position={[x, y, z]}>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, h / 2 - frameW / 2, 0.01]}>
          <boxGeometry args={[w + frameW, frameW, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, -h / 2 + frameW / 2, 0.01]}>
          <boxGeometry args={[w + frameW, frameW, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-w / 2 + frameW / 2, 0, 0.01]}>
          <boxGeometry args={[frameW, h, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[w / 2 - frameW / 2, 0, 0.01]}>
          <boxGeometry args={[frameW, h, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

export default function PortfolioBackground({ isMobile = false }: PageBackgroundProps) {
  const frames = isMobile ? FRAME_LAYOUT.slice(0, 4) : FRAME_LAYOUT

  return (
    <SafeCanvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.25} />
      {frames.map((f, i) => (
        <FloatingFrame key={i} {...f} speed={0.3 + i * 0.05} />
      ))}
    </SafeCanvas>
  )
}
