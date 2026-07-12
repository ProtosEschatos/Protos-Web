'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'

type AmbientBackgroundShellProps = PageBackgroundProps & {
  children: ReactNode
  cameraZ?: number
  fogNear?: number
  fogFar?: number
  fogColor?: string
  glowColor?: string
  showGlow?: boolean
}

type PointerRef = { current: { x: number; y: number } }

/**
 * Tracks normalized pointer position (-1..1) in a ref so cursor movement never
 * triggers React re-renders — only the R3F frame loop reads it. Listens on
 * `window`, not the canvas, so the background can stay `pointer-events-none`
 * without losing interactivity (see dom-canvas-layers.mdc).
 */
function usePointerParallax(enabled: boolean): PointerRef {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    const handleMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [enabled])

  return pointer
}

function AmbientSceneGroup({
  children,
  pointer,
  interactive,
}: {
  children: ReactNode
  pointer: PointerRef
  interactive: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const smoothed = useRef({ x: 0, y: 0 })
  const burst = useRef(0)

  useEffect(() => {
    if (!interactive) return
    const handleDown = () => {
      burst.current = 1
    }
    window.addEventListener('pointerdown', handleDown, { passive: true })
    return () => window.removeEventListener('pointerdown', handleDown)
  }, [interactive])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const t = state.clock.elapsedTime

    const targetX = interactive ? pointer.current.x : 0
    const targetY = interactive ? pointer.current.y : 0
    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, targetX, 4, delta)
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, targetY, 4, delta)

    burst.current = Math.max(0, burst.current - delta * 1.4)
    const burstScale = 1 + burst.current * 0.045

    groupRef.current.rotation.y = t * 0.035 + scrollY * 0.00015 + smoothed.current.x * 0.14
    groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.08 - smoothed.current.y * 0.07
    groupRef.current.position.y = -scrollY * 0.0005 - smoothed.current.y * 0.18
    groupRef.current.position.x = smoothed.current.x * 0.3
    groupRef.current.scale.setScalar(1.1 * burstScale)
  })

  return (
    <group ref={groupRef} position={[0, 0, -5]} scale={1.1}>
      {children}
    </group>
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
  const [interactive] = useState(() => {
    if (isMobile || typeof window === 'undefined') return false
    return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  })
  const pointer = usePointerParallax(interactive)

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
      <AmbientSceneGroup pointer={pointer} interactive={interactive}>
        {children}
      </AmbientSceneGroup>
    </SafeCanvas>
  )
}
