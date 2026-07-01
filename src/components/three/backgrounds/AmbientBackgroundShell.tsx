'use client'

import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

type AmbientBackgroundShellProps = PageBackgroundProps & {
  children: ReactNode
  cameraZ?: number
  fogNear?: number
  fogFar?: number
}

function AmbientSceneGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.018 + scrollY * 0.00008
    groupRef.current.rotation.x = Math.sin(t * 0.01) * 0.05
    groupRef.current.position.y = -scrollY * 0.00035
  })

  return (
    <group ref={groupRef} position={[0, 0, -6]} scale={1.05}>
      {children}
    </group>
  )
}

export default function AmbientBackgroundShell({
  isMobile = false,
  children,
  cameraZ = 14,
  fogNear = 22,
  fogFar = 55,
}: AmbientBackgroundShellProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, cameraZ], fov: 48 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={isMobile ? [1, 1.2] : [1, 1.4]}
      fallback={null}
    >
      <fog attach="fog" args={['#0a0a1a', fogNear, fogFar]} />
      <ambientLight intensity={0.45} />
      <AmbientSceneGroup>{children}</AmbientSceneGroup>
    </SafeCanvas>
  )
}
