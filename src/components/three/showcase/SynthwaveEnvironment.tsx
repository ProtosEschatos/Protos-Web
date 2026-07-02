'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_BACKDROP } from '@/lib/showcase-backdrop'
import { SHOWCASE_CONFIG } from './constants'

const GRID_LOOP_SECONDS = 10
const GRID_CELL = 1 / 0.11

const GRID_VERTEX = `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GRID_FRAGMENT = `
  varying vec3 vWorldPos;
  uniform float uScroll;
  uniform float uHorizonZ;

  void main() {
    float x = vWorldPos.x;
    float z = vWorldPos.z;
    float depth = max(0.35, z - uHorizonZ);
    float animZ = z - uScroll;

    float mag = abs(fract(animZ * 0.11) - 0.5);
    mag = 1.0 - smoothstep(0.0, 0.016, mag);

    float persp = 16.0 / depth;
    float cyan = abs(fract(x * persp) - 0.5);
    cyan = 1.0 - smoothstep(0.0, 0.012, cyan);

    float horizonFade = smoothstep(0.0, 5.0, depth);
    float farFade = 1.0 - smoothstep(90.0, 150.0, depth);
    float sideFade = 1.0 - smoothstep(24.0, 48.0, abs(x));
    float fade = horizonFade * farFade * sideFade;

    vec3 base = vec3(0.004, 0.0, 0.02);
    vec3 col = base;
    col += vec3(1.0, 0.04, 0.82) * mag * fade * 2.4;
    col += vec3(0.05, 1.0, 1.0) * cyan * fade * 2.2;

    float horizonGlow = exp(-abs(z - uHorizonZ - 1.0) * 0.25);
    col += vec3(1.0, 0.38, 0.65) * horizonGlow * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`

function useBackdropTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(
      SHOWCASE_BACKDROP,
      (tex) => {
        if (!active) {
          tex.dispose()
          return
        }
        tex.mapping = THREE.EquirectangularReflectionMapping
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        if (active) setTexture(null)
      },
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  return texture
}

function SynthwaveBackdrop() {
  const texture = useBackdropTexture()

  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[480, 64, 64]} />
      <meshBasicMaterial
        map={texture ?? undefined}
        color={texture ? 0xffffff : 0x120028}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function SynthwaveGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { horizonZ } = SHOWCASE_CONFIG

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
      uHorizonZ: { value: horizonZ },
    }),
    [horizonZ],
  )

  useFrame((state) => {
    if (!materialRef.current) return
    const loop = (state.clock.elapsedTime % GRID_LOOP_SECONDS) / GRID_LOOP_SECONDS
    materialRef.current.uniforms.uScroll.value = loop * GRID_CELL
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={0}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={GRID_VERTEX} fragmentShader={GRID_FRAGMENT} />
    </mesh>
  )
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-7, 7, -8] as [number, number, number], geo: 'box' as const, size: 1.5, color: 0xff0099 },
      { pos: [8, 9, -16] as [number, number, number], geo: 'tetra' as const, size: 1.7, color: 0x00eeff },
      { pos: [-9, 8, -28] as [number, number, number], geo: 'ico' as const, size: 1.4, color: 0xff0099 },
      { pos: [6, 10, -40] as [number, number, number], geo: 'box' as const, size: 1.9, color: 0x00eeff },
      { pos: [-5, 11, -52] as [number, number, number], geo: 'tetra' as const, size: 1.6, color: 0xff0099 },
    ],
    [],
  )

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.45} floatIntensity={0.65}>
          <mesh position={shape.pos} renderOrder={2}>
            {shape.geo === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
            {shape.geo === 'tetra' && <tetrahedronGeometry args={[shape.size, 0]} />}
            {shape.geo === 'ico' && <icosahedronGeometry args={[shape.size, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.88} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export function SynthwaveLighting() {
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x663377} intensity={0.28} />
      <hemisphereLight args={[0xff66aa, 0x120028, 0.4]} />
      <pointLight position={[0, 10, horizonZ + 20]} color={0xff8800} intensity={0.8} distance={140} decay={1.4} />
      <pointLight position={[-pathWidth, 3, -pathLength * 0.2]} color={0x00eeff} intensity={0.35} distance={45} />
      <pointLight position={[pathWidth, 3, -pathLength * 0.2]} color={0xff0099} intensity={0.35} distance={45} />
    </>
  )
}

export function SynthwaveEnvironment() {
  return (
    <group>
      <SynthwaveBackdrop />
      <SynthwaveGrid />
      <FloatingShapes />
    </group>
  )
}
