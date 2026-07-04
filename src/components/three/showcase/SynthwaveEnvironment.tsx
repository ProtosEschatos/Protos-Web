'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'
import { SHOWCASE_CONFIG } from './constants'

const LOOP = 10
const GRID_SCROLL = 22
const SKY_RADIUS = 500
const HORIZON_Y = 3.5
const PANORAMA_URL = getShowcaseStorageUrl(SHOWCASE_STORAGE.environment360)

const GRID_VERT = `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GRID_FRAG = `
  varying vec3 vWorldPos;
  uniform float uScroll;

  void main() {
    float x = vWorldPos.x;
    float z = vWorldPos.z;
    float depth = max(0.45, -z);
    float az = z - uScroll;

    float magF = abs(fract(az * 0.105) - 0.5);
    float mag = 1.0 - smoothstep(0.0, 0.018, magF);

    float persp = 17.0 / depth;
    float cyanF = abs(fract(x * persp) - 0.5);
    float cyan = 1.0 - smoothstep(0.0, 0.014, cyanF);

    float fade = smoothstep(0.0, 5.0, depth) * (1.0 - smoothstep(85.0, 140.0, depth));
    fade *= 1.0 - smoothstep(10.0, 20.0, abs(x));
    fade *= 0.45;

    vec3 base = vec3(0.035, 0.0, 0.11);
    vec3 col = base;
    col += vec3(1.0, 0.02, 0.78) * mag * fade * 2.0;
    col += vec3(0.02, 0.98, 1.0) * cyan * fade * 1.8;

    gl_FragColor = vec4(col, fade * 0.95);
  }
`

function PanoramaSphere() {
  const texture = useTexture(PANORAMA_URL)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh position={[0, HORIZON_Y, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={-20}>
      <sphereGeometry args={[SKY_RADIUS, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function SynthwaveGridFloor() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const t = (clock.elapsedTime % LOOP) / LOOP
    matRef.current.uniforms.uScroll.value = t * GRID_SCROLL
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} renderOrder={-4}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={GRID_VERT}
        fragmentShader={GRID_FRAG}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export function SynthwaveEnvironment() {
  const { scene } = useThree()

  useEffect(() => {
    useTexture.preload(PANORAMA_URL)
  }, [])

  useEffect(() => {
    const prevBg = scene.background
    const prevFog = scene.fog
    scene.background = new THREE.Color(0x120028)
    scene.fog = new THREE.FogExp2(0x120028, 0.0012)
    return () => {
      scene.background = prevBg
      scene.fog = prevFog
    }
  }, [scene])

  return (
    <group name="SynthwaveEnvironment360">
      <Suspense fallback={null}>
        <PanoramaSphere />
      </Suspense>
      <SynthwaveGridFloor />
    </group>
  )
}

export function SynthwaveLighting() {
  const { pathWidth } = SHOWCASE_CONFIG
  return (
    <>
      <ambientLight color={0x8844aa} intensity={0.55} />
      <hemisphereLight args={[0xff66bb, 0x120028, 0.35]} />
      <pointLight position={[0, 10, -20]} color={0xff8833} intensity={1.8} distance={140} decay={1.1} />
      <pointLight position={[-pathWidth * 0.8, 4, 0]} color={0x00eeff} intensity={0.55} distance={55} />
      <pointLight position={[pathWidth * 0.8, 4, 0]} color={0xff0099} intensity={0.55} distance={55} />
    </>
  )
}

useTexture.preload(PANORAMA_URL)
