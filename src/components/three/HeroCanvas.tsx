'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function ParticleSphere() {
  const meshRef = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 0.5

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const t = Math.random()
      if (t < 0.33) {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0.4
        colors[i * 3 + 2] = 0
      } else if (t < 0.66) {
        colors[i * 3] = 0.55
        colors[i * 3 + 1] = 0.36
        colors[i * 3 + 2] = 0.96
      } else {
        colors[i * 3] = 0.02
        colors[i * 3 + 1] = 0.71
        colors[i * 3 + 2] = 0.83
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
  })

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <points ref={meshRef} geometry={geometry}>
        <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
    </Float>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <Stars radius={50} depth={80} count={3000} factor={3} saturation={0} fade speed={1} />
      <ParticleSphere />
    </Canvas>
  )
}
