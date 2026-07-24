'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { pulseOpacity } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'

function DistantParticleSphere({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const count = isMobile ? 600 : 1200

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 5 + Math.random() * 2
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) - 4
      colors[i * 3] = 0.9 + Math.random() * 0.1
      colors[i * 3 + 1] = 0.35 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.05 + Math.random() * 0.15
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.025
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial size={0.018} vertexColors transparent opacity={0.72} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function NebulaPulse() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scale = 1 + Math.sin(t * 0.15) * 0.15
    ref.current.scale.set(scale, scale, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(t * 0.2, 0, 0.04, 0.12)
  })

  return (
    <mesh ref={ref} position={[2, 1, -12]}>
      <planeGeometry args={[8, 4.5]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} depthWrite={false} />
    </mesh>
  )
}

function ShootingStar({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const activeRef = useRef(false)
  const progressRef = useRef(0)
  const waitRef = useRef(0)
  const nextSpawnRef = useRef(8)
  const startRef = useRef(new THREE.Vector3())
  const endRef = useRef(new THREE.Vector3())

  const spawn = () => {
    startRef.current.set(-12 + Math.random() * 4, 4 + Math.random() * 3, -8 - Math.random() * 4)
    endRef.current.set(8 + Math.random() * 6, -2 - Math.random() * 3, -10 - Math.random() * 4)
    progressRef.current = 0
    activeRef.current = true
  }

  useFrame((_state, delta) => {
    if (!ref.current || isMobile) return

    if (!activeRef.current) {
      waitRef.current += delta
      if (waitRef.current >= nextSpawnRef.current) {
        waitRef.current = 0
        nextSpawnRef.current = 8 + Math.random() * 4
        spawn()
      }
      ref.current.visible = false
      return
    }

    ref.current.visible = true
    progressRef.current += delta * 0.45
    if (progressRef.current >= 1) {
      activeRef.current = false
      ref.current.visible = false
      return
    }

    const p = progressRef.current
    ref.current.position.lerpVectors(startRef.current, endRef.current, p)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = p < 0.1 ? p * 8 : p > 0.85 ? (1 - p) * 6.67 : 0.85
    ref.current.rotation.z = Math.atan2(
      endRef.current.y - startRef.current.y,
      endRef.current.x - startRef.current.x
    )
  })

  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[2.5, 0.03]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export default function HomeBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      <Stars radius={90} depth={60} count={isMobile ? 1200 : 2200} factor={2.2} saturation={0} fade speed={0.35} />
      <NebulaPulse />
      <DistantParticleSphere isMobile={isMobile} />
      <ShootingStar isMobile={isMobile} />
    </AmbientBackgroundShell>
  )
}
