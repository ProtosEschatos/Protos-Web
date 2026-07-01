'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity, smoothStep } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function RadarPulse({ delay, color, z }: { delay: number; color: string; z: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime + delay) % 4.5
    const scale = 0.8 + t * 2.2
    ref.current.scale.set(scale, scale, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, 0.32 - t * 0.07)
  })

  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <ringGeometry args={[1.2, 1.25, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function SweepLine() {
  const mainRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const rot = state.clock.elapsedTime * 0.35
    if (mainRef.current) mainRef.current.rotation.z = rot
    if (trailRef.current) {
      trailRef.current.rotation.z = rot - 0.25
      const mat = trailRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = pulseOpacity(state.clock.elapsedTime * 2, 0, 0.08, 0.22)
    }
  })

  return (
    <group position={[0, 0, -7]}>
      <mesh ref={trailRef}>
        <planeGeometry args={[0.06, 12]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh ref={mainRef}>
        <planeGeometry args={[0.02, 12]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.45} depthWrite={false} />
      </mesh>
    </group>
  )
}

function RadarBlips({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, lifetimes, angles, radii } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const life = new Float32Array(count)
    const ang = new Float32Array(count)
    const rad = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      ang[i] = Math.random() * Math.PI * 2
      rad[i] = 1.5 + Math.random() * 4
      life[i] = -Math.random() * 5
      pos[i * 3] = Math.cos(ang[i]) * rad[i]
      pos[i * 3 + 1] = Math.sin(ang[i]) * rad[i]
      pos[i * 3 + 2] = -7 - Math.random() * 2
    }
    return { positions: pos, lifetimes: life, angles: ang, radii: rad }
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const mat = ref.current.material as THREE.PointsMaterial

    for (let i = 0; i < count; i++) {
      lifetimes[i] += delta
      if (lifetimes[i] > 2.5) {
        lifetimes[i] = 0
        angles[i] = Math.random() * Math.PI * 2
        radii[i] = 1.5 + Math.random() * 4
      }
      const fade = smoothStep(0, 0.3, lifetimes[i]) * (1 - smoothStep(1.8, 2.5, lifetimes[i]))
      attr.setXYZ(i, Math.cos(angles[i]) * radii[i], Math.sin(angles[i]) * radii[i], -7 - i * 0.3)
      if (i === count - 1) mat.opacity = 0.35 + fade * 0.45
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#22d3ee" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function SecondaryEmitter({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.x = 3.5 + Math.sin(t * 0.2) * 0.3
    groupRef.current.position.y = -2 + Math.cos(t * 0.15) * 0.2
  })

  if (isMobile) return null

  return (
    <group ref={groupRef} position={[3.5, -2, -9]}>
      <mesh>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <RadarPulse delay={1.2} color="#8b5cf6" z={0} />
      <RadarPulse delay={2.4} color="#8b5cf6" z={-0.3} />
    </group>
  )
}

export default function ContactBackground({ isMobile = false }: PageBackgroundProps) {
  const pulses = isMobile ? 4 : 6

  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <mesh position={[0, 0, -8]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {Array.from({ length: pulses }, (_, i) => (
        <RadarPulse key={i} delay={i * 0.75} color={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'} z={-7 - i * 0.5} />
      ))}
      <SweepLine />
      <RadarBlips count={isMobile ? 6 : 12} />
      <SecondaryEmitter isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
