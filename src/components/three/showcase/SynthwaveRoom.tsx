'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Billboard, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'
import { createPalmSilhouetteTexture, createStarPositions, createSunTexture } from './synthwaveTextures'

const LOOP = 10
const GRID_SCROLL = 22

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

    vec3 base = vec3(0.035, 0.0, 0.11);
    vec3 col = base;
    col += vec3(1.0, 0.02, 0.78) * mag * fade * 2.2;
    col += vec3(0.02, 0.98, 1.0) * cyan * fade * 2.0;
    col += vec3(0.15, 0.0, 0.35) * (1.0 - fade) * 0.5;

    float hg = exp(-abs(z - uHorizonZ - 1.0) * 0.18);
    col += vec3(1.0, 0.32, 0.58) * hg * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`

function SupabaseEnvironmentPlane({ url }: { url: string }) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  const { horizonZ } = SHOWCASE_CONFIG

  return (
    <mesh position={[0, 14, horizonZ - 8]} renderOrder={-11}>
      <planeGeometry args={[140, 78]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

function SupabaseEnvironmentBackdrop() {
  const primary = getShowcaseStorageUrl(SHOWCASE_STORAGE.environment)
  const fallback = '/showcase/synthwave-room.jpg'
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(primary, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setUrl(res.ok ? primary : fallback)
      })
      .catch(() => {
        if (!cancelled) setUrl(fallback)
      })
    return () => {
      cancelled = true
    }
  }, [primary, fallback])

  if (!url) return null
  return <SupabaseEnvironmentPlane url={url} />
}

function SynthwaveSky() {
  const stars = useMemo(() => createStarPositions(), [])
  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {},
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPos;
          void main() {
            float h = clamp(vPos.y * 0.5 + 0.5, 0.0, 1.0);
            vec3 top = vec3(0.03, 0.0, 0.12);
            vec3 mid = vec3(0.25, 0.02, 0.38);
            vec3 horizon = vec3(0.95, 0.22, 0.52);
            vec3 col = mix(mix(top, mid, smoothstep(0.0, 0.6, h)), horizon, smoothstep(0.35, 0.88, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  return (
    <>
      <mesh scale={[420, 420, 420]} material={skyMat} renderOrder={-10}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
      <points renderOrder={-9}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color={0xffffff} size={0.85} transparent opacity={0.8} sizeAttenuation toneMapped={false} />
      </points>
    </>
  )
}

function SynthwaveSun() {
  const map = useMemo(() => createSunTexture(), [])
  const { horizonZ, sunY } = SHOWCASE_CONFIG

  return (
    <group position={[0, sunY, horizonZ]}>
      <Billboard follow lockX={false} lockY lockZ={false}>
        <mesh renderOrder={-8}>
          <circleGeometry args={[48, 96]} />
          <meshBasicMaterial color={0xff2288} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh renderOrder={-7}>
          <circleGeometry args={[38, 96]} />
          <meshBasicMaterial color={0xff8800} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh renderOrder={-6}>
          <circleGeometry args={[32, 96]} />
          <meshBasicMaterial map={map ?? undefined} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}

function WireframeMountains() {
  const { horizonZ, pathWidth } = SHOWCASE_CONFIG
  const peaks = useMemo(
    () => [
      { x: -pathWidth * 1.3, z: horizonZ + 12, h: 18, w: 24 },
      { x: -pathWidth * 0.55, z: horizonZ + 6, h: 24, w: 30 },
      { x: pathWidth * 0.45, z: horizonZ + 8, h: 21, w: 27 },
      { x: pathWidth * 1.25, z: horizonZ + 14, h: 16, w: 22 },
    ],
    [horizonZ, pathWidth],
  )

  const mountainMeshes = useMemo(
    () =>
      peaks.map((p) => {
        const geo = new THREE.ConeGeometry(p.w * 0.5, p.h, 4, 1)
        const edges = new THREE.EdgesGeometry(geo)
        return { geo, edges, ...p }
      }),
    [peaks],
  )

  return (
    <>
      {mountainMeshes.map((p, i) => (
        <group key={i} position={[p.x, p.h * 0.42, p.z]} renderOrder={-5}>
          <mesh geometry={p.geo}>
            <meshBasicMaterial color={0x0a0018} transparent opacity={0.92} depthWrite={false} />
          </mesh>
          <lineSegments geometry={p.edges}>
            <lineBasicMaterial color={0x00eeff} transparent opacity={0.9} toneMapped={false} />
          </lineSegments>
        </group>
      ))}
    </>
  )
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} renderOrder={-4}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <shaderMaterial ref={matRef} uniforms={uniforms} vertexShader={GRID_VERT} fragmentShader={GRID_FRAG} toneMapped={false} />
    </mesh>
  )
}

function PalmRow() {
  const tex = useMemo(() => createPalmSilhouetteTexture(), [])
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  const palms = useMemo(() => {
    const list: Array<{ x: number; z: number; s: number }> = []
    const start = pathLength / 2 - 2
    const end = horizonZ + 10
    for (let z = start; z >= end; z -= 6) {
      const t = (z - horizonZ) / (start - horizonZ)
      const s = 0.4 + t * 2.6
      list.push({ x: -(pathWidth / 2 + 4), z, s })
      list.push({ x: pathWidth / 2 + 4, z: z - 3, s: s * 0.92 })
    }
    return list
  }, [pathLength, pathWidth, horizonZ])

  if (!tex) return null

  return (
    <>
      {palms.map((p, i) => (
        <Billboard key={i} position={[p.x, p.s * 4.5, p.z]} follow lockX={false} lockY lockZ={false}>
          <mesh renderOrder={-2}>
            <planeGeometry args={[p.s * 2.4, p.s * 6]} />
            <meshBasicMaterial map={tex} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      ))}
    </>
  )
}

function FloatingShapes() {
  const items = useMemo(
    () => [
      { pos: [-5, 6, -6] as [number, number, number], geo: 'box' as const, s: 1.4, c: 0xff0099 },
      { pos: [6, 7.5, -14] as [number, number, number], geo: 'tetra' as const, s: 1.6, c: 0x00eeff },
      { pos: [-7, 6.5, -24] as [number, number, number], geo: 'ico' as const, s: 1.3, c: 0xff0099 },
      { pos: [5, 8, -34] as [number, number, number], geo: 'box' as const, s: 1.8, c: 0x00eeff },
      { pos: [-4, 9, -44] as [number, number, number], geo: 'tetra' as const, s: 1.5, c: 0xff0099 },
      { pos: [8, 7, -52] as [number, number, number], geo: 'ico' as const, s: 1.2, c: 0x00eeff },
    ],
    [],
  )

  return (
    <>
      {items.map((item, i) => (
        <Float key={i} speed={1.1} rotationIntensity={0.5} floatIntensity={0.7}>
          <mesh position={item.pos} renderOrder={-1}>
            {item.geo === 'box' && <boxGeometry args={[item.s, item.s, item.s]} />}
            {item.geo === 'tetra' && <tetrahedronGeometry args={[item.s, 0]} />}
            {item.geo === 'ico' && <icosahedronGeometry args={[item.s, 0]} />}
            <meshBasicMaterial color={item.c} wireframe transparent opacity={0.88} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export function SynthwaveRoom() {
  const { scene } = useThree()

  useEffect(() => {
    const bg = new THREE.Color(0x0a0018)
    const prevBg = scene.background
    const prevFog = scene.fog
    scene.background = bg
    scene.fog = new THREE.FogExp2(0x1a0038, 0.008)
    return () => {
      scene.background = prevBg
      scene.fog = prevFog
    }
  }, [scene])

  return (
    <group name="SynthwaveEnvironment">
      <SupabaseEnvironmentBackdrop />
      <SynthwaveSky />
      <SynthwaveSun />
      <WireframeMountains />
      <SynthwaveFloor />
      <PalmRow />
      <FloatingShapes />
    </group>
  )
}

export function SynthwaveLighting() {
  const { horizonZ, pathWidth } = SHOWCASE_CONFIG
  return (
    <>
      <ambientLight color={0x5533aa} intensity={0.35} />
      <hemisphereLight args={[0xff66bb, 0x0a0018, 0.45]} />
      <pointLight position={[0, 14, horizonZ + 8]} color={0xff8833} intensity={1.5} distance={120} decay={1.2} />
      <pointLight position={[-pathWidth, 3, 0]} color={0x00eeff} intensity={0.4} distance={45} />
      <pointLight position={[pathWidth, 3, 0]} color={0xff0099} intensity={0.4} distance={45} />
    </>
  )
}
