'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
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
    float depth = max(0.4, z - uHorizonZ);
    float animZ = z - uScroll;

    float mag = abs(fract(animZ * 0.11) - 0.5);
    mag = 1.0 - smoothstep(0.0, 0.018, mag);

    float persp = 18.0 / depth;
    float cyan = abs(fract(x * persp) - 0.5);
    cyan = 1.0 - smoothstep(0.0, 0.013, cyan);

    float horizonFade = smoothstep(0.0, 4.0, depth);
    float farFade = 1.0 - smoothstep(85.0, 145.0, depth);
    float sideFade = 1.0 - smoothstep(22.0, 46.0, abs(x));
    float fade = horizonFade * farFade * sideFade;

    vec3 col = vec3(0.003, 0.0, 0.015);
    col += vec3(1.0, 0.05, 0.82) * mag * fade * 2.6;
    col += vec3(0.08, 1.0, 1.0) * cyan * fade * 2.4;

    float horizonGlow = exp(-abs(z - uHorizonZ - 0.5) * 0.28);
    col += vec3(1.0, 0.4, 0.68) * horizonGlow * 0.65;

    gl_FragColor = vec4(col, 1.0);
  }
`

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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={GRID_VERTEX} fragmentShader={GRID_FRAGMENT} />
    </mesh>
  )
}

export function SynthwaveLighting() {
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x553366} intensity={0.45} />
      <hemisphereLight args={[0xff77bb, 0x0a0018, 0.35]} />
      <pointLight position={[0, 8, horizonZ + 18]} color={0xff9933} intensity={0.9} distance={120} decay={1.3} />
      <pointLight position={[-pathWidth, 2, -pathLength * 0.25]} color={0x00eeff} intensity={0.4} distance={40} />
      <pointLight position={[pathWidth, 2, -pathLength * 0.25]} color={0xff0099} intensity={0.4} distance={40} />
    </>
  )
}

export function SynthwaveEnvironment() {
  return <SynthwaveGrid />
}
