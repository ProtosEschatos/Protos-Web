'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import { lerpAlongPath, pulseOpacity, type Vec3 } from '@/components/three/backgrounds/live-utils'
import type { PageBackgroundProps } from '@/lib/showcase/site-background-routes'
import { BACKGROUND_FOG, BACKGROUND_GLOW } from '@/lib/showcase/site-background-routes'

const NODES = [
  { x: -4, y: 1.2, z: -4, color: '#ff6600', speed: 0.35 },
  { x: -1.5, y: -0.8, z: -6, color: '#8b5cf6', speed: 0.5 },
  { x: 1.5, y: 0.6, z: -5, color: '#06b6d4', speed: 0.42 },
  { x: 4, y: -1, z: -7, color: '#ff8800', speed: 0.28 },
  { x: 0, y: 2, z: -8, color: '#818cf8', speed: 0.38 },
]

function ProcessNode({
  x,
  y,
  z,
  color,
  speed,
  index,
  nodeCount,
}: {
  x: number
  y: number
  z: number
  color: string
  speed: number
  index: number
  nodeCount: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const active = index === Math.floor(t * 0.4) % nodeCount
    ref.current.rotation.x = t * speed * 0.25
    ref.current.rotation.y = t * speed * 0.18
    ref.current.position.y = y + Math.sin(t * 0.4 + x) * 0.15
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = active ? pulseOpacity(t * 2, 0, 0.35, 0.55) : 0.28
  })

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <icosahedronGeometry args={[0.55, 2]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.28} depthWrite={false} />
    </mesh>
  )
}

function ConnectingLines({ nodeCount }: { nodeCount: number }) {
  const ref = useRef<THREE.LineSegments>(null)
  const nodes = NODES.slice(0, nodeCount)
  const geometry = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      pts.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[i + 1].x, nodes[i + 1].y, nodes[i + 1].z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [nodes])

  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    mat.opacity = pulseOpacity(state.clock.elapsedTime * 1.2, 0, 0.18, 0.42)
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.32} depthWrite={false} />
    </lineSegments>
  )
}

function TravelingDot({ nodeCount }: { nodeCount: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const path = useMemo<Vec3[]>(
    () => NODES.slice(0, nodeCount).map((n) => ({ x: n.x, y: n.y, z: n.z })),
    [nodeCount]
  )

  useFrame((state) => {
    if (!ref.current || path.length < 2) return
    const t = (state.clock.elapsedTime * 0.12) % 1
    const pos = lerpAlongPath(path, t)
    ref.current.position.set(pos.x, pos.y, pos.z)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = pulseOpacity(state.clock.elapsedTime * 3, 0, 0.5, 0.95)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} depthWrite={false} />
    </mesh>
  )
}

function LineFlowParticles({ nodeCount }: { nodeCount: number }) {
  const ref = useRef<THREE.Points>(null)
  const nodes = NODES.slice(0, nodeCount)
  const count = (nodes.length - 1) * 4

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      ph[i] = i / count
      pos[i * 3] = nodes[0]?.x ?? 0
      pos[i * 3 + 1] = nodes[0]?.y ?? 0
      pos[i * 3 + 2] = nodes[0]?.z ?? 0
    }
    return { positions: pos, phases: ph }
  }, [count, nodes])

  const path = useMemo<Vec3[]>(() => nodes.map((n) => ({ x: n.x, y: n.y, z: n.z })), [nodes])

  useFrame((state) => {
    if (!ref.current || path.length < 2) return
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const localT = (t * 0.08 + phases[i]) % 1
      const pos = lerpAlongPath(path, localT)
      attr.setXYZ(i, pos.x, pos.y, pos.z)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ff6600" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function AmbientDust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = -4 - Math.random() * 10
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#8b5cf6" transparent opacity={0.42} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function ProcessBackground({ isMobile = false }: PageBackgroundProps) {
  const nodes = isMobile ? NODES.slice(0, 3) : NODES

  return (
    <AmbientBackgroundShell isMobile={isMobile} fogColor={BACKGROUND_FOG.process} glowColor={BACKGROUND_GLOW.process}>
      {nodes.map((n, i) => (
        <ProcessNode key={`${n.x}-${n.z}`} {...n} index={i} nodeCount={nodes.length} />
      ))}
      <ConnectingLines nodeCount={nodes.length} />
      <TravelingDot nodeCount={nodes.length} />
      <LineFlowParticles nodeCount={nodes.length} />
      <AmbientDust count={isMobile ? 40 : 80} />
    </AmbientBackgroundShell>
  )
}
