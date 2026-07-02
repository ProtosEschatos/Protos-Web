'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { createPalmTexture, createStarField, createSunTexture } from './synthwaveTextures'

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
    mag = 1.0 - smoothstep(0.0, 0.018, mag);

    float persp = 14.0 / depth;
    float cyan = abs(fract(x * persp) - 0.5);
    cyan = 1.0 - smoothstep(0.0, 0.014, cyan);

    float horizonFade = smoothstep(0.0, 6.0, depth);
    float farFade = 1.0 - smoothstep(95.0, 160.0, depth);
    float sideFade = 1.0 - smoothstep(28.0, 55.0, abs(x));
    float fade = horizonFade * farFade * sideFade;

    vec3 base = vec3(0.006, 0.0, 0.028);
    vec3 col = base;
    col += vec3(1.0, 0.06, 0.78) * mag * fade * 2.1;
    col += vec3(0.08, 0.98, 1.0) * cyan * fade * 2.0;

    float horizonGlow = exp(-abs(z - uHorizonZ - 1.5) * 0.22);
    col += vec3(1.0, 0.35, 0.62) * horizonGlow * 0.45;
    col += vec3(1.0, 0.55, 0.2) * horizonGlow * 0.12;

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

function SynthwaveSun() {
  const texture = useMemo(() => createSunTexture(), [])
  const { horizonZ, sunY, sunRadius } = SHOWCASE_CONFIG

  return (
    <group position={[0, sunY, horizonZ]}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={-5}>
          <circleGeometry args={[sunRadius * 1.55, 96]} />
          <meshBasicMaterial color={0xff3399} transparent opacity={0.14} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh renderOrder={-4}>
          <circleGeometry args={[sunRadius * 1.25, 96]} />
          <meshBasicMaterial color={0xff8800} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh renderOrder={-3}>
          <circleGeometry args={[sunRadius, 96]} />
          <meshBasicMaterial map={texture ?? undefined} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}

function PalmRow() {
  const texture = useMemo(() => createPalmTexture(), [])
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  const palms = useMemo(() => {
    const items: Array<{ x: number; z: number; scale: number }> = []
    const startZ = pathLength / 2 - 2
    const endZ = horizonZ + 8
    for (let z = startZ; z >= endZ; z -= 5.5) {
      const depthT = (z - horizonZ) / (startZ - horizonZ)
      const scale = 0.35 + depthT * 2.4
      items.push({ x: -(pathWidth / 2 + 4.5), z, scale })
      items.push({ x: pathWidth / 2 + 4.5, z: z - 2.75, scale: scale * 0.92 })
    }
    return items
  }, [pathLength, pathWidth, horizonZ])

  if (!texture) return null

  return (
    <>
      {palms.map((palm, i) => (
        <Billboard key={i} position={[palm.x, palm.scale * 4.2, palm.z]} follow lockX={false} lockY lockZ={false}>
          <mesh renderOrder={-1}>
            <planeGeometry args={[palm.scale * 2.2, palm.scale * 5.5]} />
            <meshBasicMaterial
              map={texture}
              transparent
              alphaTest={0.02}
              depthWrite={false}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Billboard>
      ))}
    </>
  )
}

function WireframeMountains() {
  const { horizonZ, pathWidth } = SHOWCASE_CONFIG

  const mountains = useMemo(() => {
    const peaks = [
      { x: -pathWidth * 1.45, z: horizonZ + 14, h: 16, w: 22 },
      { x: -pathWidth * 0.75, z: horizonZ + 8, h: 22, w: 28 },
      { x: -pathWidth * 0.15, z: horizonZ + 11, h: 18, w: 24 },
      { x: pathWidth * 0.35, z: horizonZ + 9, h: 20, w: 26 },
      { x: pathWidth * 1.05, z: horizonZ + 13, h: 17, w: 23 },
      { x: pathWidth * 1.65, z: horizonZ + 16, h: 14, w: 20 },
    ]

    return peaks.map((peak) => {
      const geo = new THREE.ConeGeometry(peak.w * 0.5, peak.h, 4, 1)
      return { peak, geo, edges: new THREE.EdgesGeometry(geo) }
    })
  }, [horizonZ, pathWidth])

  return (
    <>
      {mountains.map(({ peak, geo, edges }, i) => (
        <group key={i} position={[peak.x, peak.h * 0.42, peak.z]}>
          <mesh geometry={geo}>
            <meshBasicMaterial color={0x080018} transparent opacity={0.95} depthWrite={false} />
          </mesh>
          <lineSegments geometry={edges} renderOrder={1}>
            <lineBasicMaterial color={0x00eeff} transparent opacity={0.85} toneMapped={false} />
          </lineSegments>
        </group>
      ))}
    </>
  )
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null)

  const shapes = useMemo(
    () => [
      { pos: [-7, 6, -6] as [number, number, number], geo: 'box' as const, size: 1.6, color: 0xff0099 },
      { pos: [8, 8, -14] as [number, number, number], geo: 'tetra' as const, size: 1.8, color: 0x00eeff },
      { pos: [-9, 7, -24] as [number, number, number], geo: 'ico' as const, size: 1.5, color: 0xff0099 },
      { pos: [6, 9, -34] as [number, number, number], geo: 'box' as const, size: 2.0, color: 0x00eeff },
      { pos: [-5, 10, -44] as [number, number, number], geo: 'tetra' as const, size: 1.7, color: 0xff0099 },
      { pos: [10, 6, -52] as [number, number, number], geo: 'ico' as const, size: 1.4, color: 0x00eeff },
    ],
    [],
  )

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.4} rotationIntensity={0.55} floatIntensity={0.75}>
          <mesh position={shape.pos}>
            {shape.geo === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
            {shape.geo === 'tetra' && <tetrahedronGeometry args={[shape.size, 0]} />}
            {shape.geo === 'ico' && <icosahedronGeometry args={[shape.size, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.9} toneMapped={false} />
          </mesh>
          <mesh position={shape.pos} scale={0.55}>
            {shape.geo === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
            {shape.geo === 'tetra' && <tetrahedronGeometry args={[shape.size, 0]} />}
            {shape.geo === 'ico' && <icosahedronGeometry args={[shape.size, 0]} />}
            <meshBasicMaterial color={shape.color} transparent opacity={0.18} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function SynthwaveSky() {
  const starPositions = useMemo(() => createStarField(), [])

  const skyMaterial = useMemo(
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
            vec3 zenith = vec3(0.04, 0.0, 0.14);
            vec3 mid = vec3(0.28, 0.04, 0.42);
            vec3 dusk = vec3(0.95, 0.28, 0.52);
            vec3 col = mix(mix(zenith, mid, smoothstep(0.0, 0.62, h)), dusk, smoothstep(0.38, 0.92, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  return (
    <>
      <mesh scale={[480, 480, 480]} material={skyMaterial}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
      <points renderOrder={-6}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={0xffffff} size={0.9} transparent opacity={0.75} sizeAttenuation toneMapped={false} />
      </points>
    </>
  )
}

function HorizonGlow() {
  const { horizonZ } = SHOWCASE_CONFIG
  return (
    <mesh position={[0, 0.02, horizonZ + 1]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
      <planeGeometry args={[120, 8]} />
      <meshBasicMaterial color={0xff4488} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

export function SynthwaveLighting() {
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x552266} intensity={0.35} />
      <hemisphereLight args={[0xff66aa, 0x120028, 0.55]} />
      <directionalLight position={[0, 30, horizonZ + 20]} intensity={0.45} color={0xff9933} />
      <pointLight position={[0, 12, horizonZ + 15]} color={0xff6600} intensity={1.2} distance={120} decay={1.2} />
      <pointLight position={[-pathWidth, 4, -pathLength * 0.15]} color={0x00eeff} intensity={0.55} distance={50} />
      <pointLight position={[pathWidth, 4, -pathLength * 0.15]} color={0xff0099} intensity={0.55} distance={50} />
    </>
  )
}

export function SynthwaveEnvironment() {
  return (
    <group>
      <SynthwaveSky />
      <SynthwaveGrid />
      <HorizonGlow />
      <SynthwaveSun />
      <WireframeMountains />
      <PalmRow />
      <FloatingShapes />
    </group>
  )
}
