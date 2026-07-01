'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import type { PageBackgroundProps } from '@/lib/site-background-routes'

function ProcessSphere({ color, position, speed }: { color: string; position: [number, number, number]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
  })

  return (
    <Float speed={2} floatIntensity={0.5} rotationIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial color={color} transparent opacity={0.15} wireframe distort={0.3} speed={2} />
      </mesh>
    </Float>
  )
}

function ConnectingLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const geometry = useMemo(() => {
    const points: number[] = []
    const positions = [
      [-3, 0, 0],
      [-1, 0, 0],
      [1, 0, 0],
      [3, 0, 0],
    ]
    for (let i = 0; i < positions.length - 1; i++) {
      points.push(...positions[i], ...positions[i + 1])
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    const mat = linesRef.current.material as THREE.LineBasicMaterial
    mat.opacity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
    </lineSegments>
  )
}

function FloatingParticles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8b5cf6" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function ProcessBackground({ isMobile = false }: PageBackgroundProps) {
  return (
    <SafeCanvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      fallback={null}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff6600" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#8b5cf6" />
      <ProcessSphere color="#ff6600" position={[-3, 0, 0]} speed={0.5} />
      <ProcessSphere color="#8b5cf6" position={[-1, 0, 0]} speed={0.7} />
      <ProcessSphere color="#06b6d4" position={[1, 0, 0]} speed={0.6} />
      <ProcessSphere color="#ff8800" position={[3, 0, 0]} speed={0.4} />
      <ConnectingLines />
      <FloatingParticles count={isMobile ? 50 : 100} />
    </SafeCanvas>
  )
}
