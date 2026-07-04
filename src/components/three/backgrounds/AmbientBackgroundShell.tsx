'use client'

import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import { pulseOpacity } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

type AmbientBackgroundShellProps = PageBackgroundProps & {
  children: ReactNode
  cameraZ?: number
  fogNear?: number
  fogFar?: number
  fogColor?: string
  glowColor?: string
  showGlow?: boolean
}

function AmbientSceneGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.035 + scrollY * 0.00015
    groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.08
    groupRef.current.position.y = -scrollY * 0.0005
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={1.1}>
      {children}
    </group>
  )
}

function RouteGlow({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scale = 1 + Math.sin(t * 0.3) * 0.14
    ref.current.scale.set(scale, scale, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 0.45, 0, 0.28, 0.55)
  })

  return (
    <mesh ref={ref} position={[0, 0, -15]}>
      <circleGeometry args={[13, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function AmbientBackgroundShell({
  isMobile = false,
  children,
  cameraZ = 12,
  fogNear = 42,
  fogFar = 92,
  fogColor = '#0a0a1a',
  glowColor = '#ff6600',
  showGlow = true,
}: AmbientBackgroundShellProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, cameraZ], fov: 52 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={showGlow ? 0.72 : 0.45} />
      {showGlow ? <pointLight position={[4, 3, 6]} intensity={0.55} color={glowColor} /> : null}
      <AmbientSceneGroup>
        {showGlow ? <RouteGlow color={glowColor} /> : null}
        {children}
      </AmbientSceneGroup>
    </SafeCanvas>
  )
}
