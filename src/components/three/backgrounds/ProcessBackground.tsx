'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AmbientBackgroundShell from '@/components/three/backgrounds/AmbientBackgroundShell'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

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
}: {
  x: number
  y: number
  z: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * speed * 0.25
    ref.current.rotation.y = t * speed * 0.18
    ref.current.position.y = y + Math.sin(t * 0.4 + x) * 0.15
  })

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <icosahedronGeometry args={[0.55, 2]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.12} depthWrite={false} />
    </mesh>
  )
}

function ConnectingLines() {
  const ref = useRef<THREE.LineSegments>(null)
  const geometry = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < NODES.length - 1; i++) {
      pts.push(NODES[i].x, NODES[i].y, NODES[i].z, NODES[i + 1].x, NODES[i + 1].y, NODES[i + 1].z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.LineBasicMaterial
    mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.1} depthWrite={false} />
    </lineSegments>
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
      <pointsMaterial size={0.01} color="#8b5cf6" transparent opacity={0.2} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function ProcessBackground({ isMobile = false }: PageBackgroundProps) {
  const nodes = isMobile ? NODES.slice(0, 3) : NODES

  return (
    <AmbientBackgroundShell isMobile={isMobile}>
      {nodes.map((n) => (
        <ProcessNode key={`${n.x}-${n.z}`} {...n} />
      ))}
      <ConnectingLines />
      <AmbientDust count={isMobile ? 40 : 80} />
    </AmbientBackgroundShell>
  )
}
