'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity, pulseScale, staggerPhase } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/site-background-routes'
import { BACKGROUND_FOG, BACKGROUND_GLOW } from '@/lib/site-background-routes'

function OrbitRing({
  radius,
  color,
  speed,
  rotation,
  z,
}: {
  radius: number
  color: string
  speed: number
  rotation: [number, number, number]
  z: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * speed
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.05) * 0.02
  })

  return (
    <mesh ref={ref} rotation={rotation} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.008, 6, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.42} depthWrite={false} />
    </mesh>
  )
}

function RingSatellite({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const angle = state.clock.elapsedTime * speed
    ref.current.position.x = Math.cos(angle) * radius
    ref.current.position.y = Math.sin(angle) * radius * 0.35
    ref.current.position.z = 0
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} depthWrite={false} />
    </mesh>
  )
}

function buildNodePositions(count: number): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const r = 3.5 + (i % 4) * 0.9
    return new THREE.Vector3(
      Math.cos(angle) * r,
      Math.sin(angle * 1.4) * 1.2,
      Math.sin(angle) * r - 2
    )
  })
}

function ConstellationLines({ positions }: { positions: THREE.Vector3[] }) {
  const ref = useRef<THREE.LineSegments>(null)
  const geometry = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i]
      const b = positions[(i + 1) % positions.length]
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    mat.opacity = pulseOpacity(state.clock.elapsedTime * 0.5, 0, 0.15, 0.35)
  })

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, 0, -6]}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.25} depthWrite={false} />
    </lineSegments>
  )
}

function ConstellationNodes({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const positions = useMemo(() => buildNodePositions(count), [count])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <>
      <ConstellationLines positions={positions} />
      <group ref={groupRef} position={[0, 0, -6]}>
        {positions.map((pos, i) => (
          <PulsingNode key={i} position={pos} index={i} />
        ))}
      </group>
    </>
  )
}

function PulsingNode({ position, index }: { position: THREE.Vector3; index: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const phase = staggerPhase(index, 12)
    const scale = pulseScale(t * 1.4, phase, 0.35)
    ref.current.scale.setScalar(scale)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 1.4, phase, 0.35, 0.78)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial
        color={index % 2 === 0 ? '#8b5cf6' : '#06b6d4'}
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </mesh>
  )
}

function AboutCore() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scale = 1 + Math.sin(t * 0.5) * 0.12
    ref.current.scale.setScalar(scale)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 0.6, 0, 0.12, 0.32)
  })

  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} depthWrite={false} />
    </mesh>
  )
}

export default function AboutBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.about} glowColor={BACKGROUND_GLOW.about}>
      <AboutCore />
      <OrbitRing radius={4.5} color="#8b5cf6" speed={0.06} rotation={[Math.PI / 2.8, 0, 0]} z={-3} />
      <group rotation={[Math.PI / 2.8, 0, 0]} position={[0, 0, -3]}>
        <RingSatellite radius={4.5} speed={0.5} color="#fbbf24" />
      </group>
      <OrbitRing radius={6.2} color="#06b6d4" speed={-0.04} rotation={[Math.PI / 3.5, Math.PI / 5, 0]} z={-5} />
      <OrbitRing radius={7.8} color="#ff6600" speed={0.03} rotation={[Math.PI / 2.2, -Math.PI / 6, 0]} z={-7} />
      <ConstellationNodes count={isMobile ? 12 : 22} />
    </AmbientBackgroundShell>
  )
}
