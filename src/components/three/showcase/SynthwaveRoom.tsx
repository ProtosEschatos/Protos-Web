'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'

const LOOP = 10
const GRID_SCROLL = 22
const SKY_RADIUS = 360
const SKY_HEIGHT = 230

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
  uniform float uHorizonZ;

  void main() {
    float x = vWorldPos.x;
    float z = vWorldPos.z;
    float depth = max(0.45, z - uHorizonZ);
    float az = z - uScroll;

    float magF = abs(fract(az * 0.105) - 0.5);
    float mag = 1.0 - smoothstep(0.0, 0.018, magF);

    float persp = 17.0 / depth;
    float cyanF = abs(fract(x * persp) - 0.5);
    float cyan = 1.0 - smoothstep(0.0, 0.014, cyanF);

    float fade = smoothstep(0.0, 5.0, depth) * (1.0 - smoothstep(85.0, 140.0, depth));
    fade *= 1.0 - smoothstep(10.0, 20.0, abs(x));
    fade *= 0.82;

    vec3 base = vec3(0.035, 0.0, 0.11);
    vec3 col = base;
    col += vec3(1.0, 0.02, 0.78) * mag * fade * 2.0;
    col += vec3(0.02, 0.98, 1.0) * cyan * fade * 1.8;

    gl_FragColor = vec4(col, fade * 0.95);
  }
`


function PanoramaSky360({ url }: { url: string }) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  const { horizonZ } = SHOWCASE_CONFIG

  return (
    <mesh position={[0, SKY_HEIGHT * 0.42, horizonZ + 38]} renderOrder={-20}>
      <cylinderGeometry args={[SKY_RADIUS, SKY_RADIUS, SKY_HEIGHT, 96, 1, true]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function EquirectFallbackSky({ url }: { url: string }) {
  const texture = useTexture(url)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh scale={[-380, 380, 380]} renderOrder={-20}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Skybox360() {
  const primary = getShowcaseStorageUrl(SHOWCASE_STORAGE.environment360)
  const equirectPrimary = getShowcaseStorageUrl(SHOWCASE_STORAGE.environmentEquirect)
  const panoramaFallback = '/showcase/environment/synthwave-360-panorama.jpg'
  const equirectFallback = '/showcase/environment/synthwave-360-equirect.jpg'
  const [mode, setMode] = useState<'loading' | 'panorama' | 'equirect'>('loading')
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const tryUrl = async (candidate: string) => {
      try {
        const res = await fetch(candidate, { method: 'HEAD' })
        return res.ok ? candidate : null
      } catch {
        return null
      }
    }

    void (async () => {
      const panorama =
        (await tryUrl(primary)) ??
        (await tryUrl(panoramaFallback))
      if (cancelled) return
      if (panorama) {
        setMode('panorama')
        setUrl(panorama)
        return
      }
      const equirect =
        (await tryUrl(equirectPrimary)) ??
        (await tryUrl(equirectFallback))
      if (cancelled) return
      if (equirect) {
        setMode('equirect')
        setUrl(equirect)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [primary, equirectPrimary, panoramaFallback, equirectFallback])

  if (!url || mode === 'loading') return null
  if (mode === 'equirect') return <EquirectFallbackSky url={url} />
  return <PanoramaSky360 url={url} />
}

function SynthwaveFloor() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { horizonZ } = SHOWCASE_CONFIG

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
      uHorizonZ: { value: horizonZ },
    }),
    [horizonZ],
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

export function SynthwaveRoom() {
  const { scene } = useThree()

  useEffect(() => {
    const prevBg = scene.background
    const prevFog = scene.fog
    scene.background = null
    scene.fog = new THREE.FogExp2(0x1a0038, 0.006)
    return () => {
      scene.background = prevBg
      scene.fog = prevFog
    }
  }, [scene])

  return (
    <group name="SynthwaveEnvironment360">
      <Skybox360 />
      <SynthwaveFloor />
    </group>
  )
}

export function SynthwaveLighting() {
  const { horizonZ, pathWidth } = SHOWCASE_CONFIG
  return (
    <>
      <ambientLight color={0x8844aa} intensity={0.55} />
      <hemisphereLight args={[0xff66bb, 0x120028, 0.35]} />
      <pointLight position={[0, 10, horizonZ + 6]} color={0xff8833} intensity={1.8} distance={140} decay={1.1} />
      <pointLight position={[-pathWidth * 0.8, 4, 0]} color={0x00eeff} intensity={0.55} distance={55} />
      <pointLight position={[pathWidth * 0.8, 4, 0]} color={0xff0099} intensity={0.55} distance={55} />
    </>
  )
}
