'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'

const GRID_VERTEX = `
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GRID_LOOP_SECONDS = 10
const GRID_SCROLL_RANGE = 24

const GRID_FRAGMENT = `
  varying vec3 vWorldPos;
  uniform float uScroll;

  void main() {
    float z = vWorldPos.z;
    float x = vWorldPos.x;

    float depth = max(0.8, -z + 36.0);
    float persp = 1.0 / (depth * 0.06);

    float zAnim = depth + uScroll;
    float cellZ = abs(fract(zAnim * 0.22) - 0.5);
    float cellX = abs(fract(x * persp * 0.55) - 0.5);

    float lineZ = 1.0 - smoothstep(0.0, 0.04, cellZ);
    float lineX = 1.0 - smoothstep(0.0, 0.04, cellX);

    float fade = clamp(depth * 0.04, 0.0, 1.0) * clamp(1.0 - depth * 0.006, 0.0, 1.0);

    vec3 base = vec3(0.02, 0.0, 0.07);
    vec3 magenta = vec3(1.0, 0.05, 0.65);
    vec3 cyan = vec3(0.05, 0.95, 1.0);

    vec3 col = base;
    col += magenta * lineX * fade * 1.25;
    col += cyan * lineZ * fade * 1.25;

    float horizonGlow = exp(-abs(z + 48.0) * 0.05) * 0.4;
    col += vec3(1.0, 0.35, 0.55) * horizonGlow;

    gl_FragColor = vec4(col, 1.0);
  }
`

function createSunTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#ffb347')
  grad.addColorStop(0.45, '#ff6b9d')
  grad.addColorStop(1, '#ff8800')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(256, 280, 210, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#0d0020'
  for (let y = 300; y < 512; y += 10) {
    ctx.fillRect(46, y, 420, 5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function SynthwaveGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
    }),
    [],
  )

  useFrame((state) => {
    if (materialRef.current) {
      const loopT = (state.clock.elapsedTime % GRID_LOOP_SECONDS) / GRID_LOOP_SECONDS
      materialRef.current.uniforms.uScroll.value = loopT * GRID_SCROLL_RANGE
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.001, 0]}>
      <planeGeometry args={[420, 420, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={GRID_VERTEX}
        fragmentShader={GRID_FRAGMENT}
      />
    </mesh>
  )
}

function SynthwaveSun() {
  const texture = useMemo(() => createSunTexture(), [])
  const { horizonZ, sunY } = SHOWCASE_CONFIG

  return (
    <group position={[0, sunY, horizonZ]}>
      <mesh renderOrder={-2}>
        <circleGeometry args={[16, 64]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.5]} renderOrder={-3}>
        <circleGeometry args={[22, 64]} />
        <meshBasicMaterial color={0xff66aa} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  )
}

function PalmSilhouette({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.18, 0.35, 5, 6]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      {[
        { rot: [0.4, 0, 0.5] as [number, number, number], pos: [0, 4.8, 0] as [number, number, number] },
        { rot: [0.5, 0.8, 0.2] as [number, number, number], pos: [0, 4.6, 0] as [number, number, number] },
        { rot: [0.45, -0.9, -0.3] as [number, number, number], pos: [0, 4.7, 0] as [number, number, number] },
        { rot: [0.35, 0.3, -0.8] as [number, number, number], pos: [0, 4.5, 0] as [number, number, number] },
      ].map((leaf, i) => (
        <mesh key={i} position={leaf.pos} rotation={leaf.rot}>
          <boxGeometry args={[0.12, 2.8, 0.35]} />
          <meshBasicMaterial color={0x000000} />
        </mesh>
      ))}
    </group>
  )
}

function PalmRows() {
  const { pathLength, pathWidth } = SHOWCASE_CONFIG
  const palms = useMemo(() => {
    const items: Array<[number, number, number]> = []
    for (let z = pathLength / 2 - 4; z >= -pathLength / 2 + 4; z -= 7) {
      items.push([-pathWidth / 2 - 3.5, 0, z])
      items.push([pathWidth / 2 + 3.5, 0, z + 3.5])
    }
    return items
  }, [pathLength, pathWidth])

  return (
    <>
      {palms.map((pos, i) => (
        <PalmSilhouette key={i} position={pos} />
      ))}
    </>
  )
}

function WireframeMountains() {
  const { horizonZ, pathWidth } = SHOWCASE_CONFIG

  const peaks = useMemo(
    () => [
      { x: -pathWidth * 1.2, z: horizonZ + 8, h: 10, w: 14 },
      { x: -pathWidth * 0.5, z: horizonZ + 4, h: 14, w: 18 },
      { x: pathWidth * 0.6, z: horizonZ + 6, h: 12, w: 16 },
      { x: pathWidth * 1.3, z: horizonZ + 10, h: 9, w: 13 },
    ],
    [horizonZ, pathWidth],
  )

  return (
    <>
      {peaks.map((peak, i) => (
        <group key={i} position={[peak.x, peak.h * 0.35, peak.z]}>
          <mesh>
            <coneGeometry args={[peak.w * 0.5, peak.h, 4, 1]} />
            <meshBasicMaterial color={0x120028} wireframe transparent opacity={0.85} />
          </mesh>
          <mesh scale={[1.02, 1.02, 1.02]}>
            <coneGeometry args={[peak.w * 0.5, peak.h, 4, 1]} />
            <meshBasicMaterial color={0x00eaff} wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-6, 5, -8] as [number, number, number], geo: 'box' as const, size: 1.2, color: 0xff0099 },
      { pos: [7, 7, -18] as [number, number, number], geo: 'tetra' as const, size: 1.4, color: 0x00eaff },
      { pos: [-8, 6, -28] as [number, number, number], geo: 'ico' as const, size: 1.1, color: 0xff0099 },
      { pos: [5, 8, -38] as [number, number, number], geo: 'box' as const, size: 1.5, color: 0x00eaff },
      { pos: [-4, 9, -48] as [number, number, number], geo: 'tetra' as const, size: 1.3, color: 0xff0099 },
    ],
    [],
  )

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={shape.pos}>
            {shape.geo === 'box' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
            {shape.geo === 'tetra' && <tetrahedronGeometry args={[shape.size, 0]} />}
            {shape.geo === 'ico' && <icosahedronGeometry args={[shape.size, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.75} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function SynthwaveSkyDome() {
  const material = useMemo(
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
            vec3 top = vec3(0.07, 0.0, 0.18);
            vec3 mid = vec3(0.35, 0.05, 0.45);
            vec3 horizon = vec3(1.0, 0.35, 0.55);
            vec3 col = mix(mix(top, mid, smoothstep(0.0, 0.55, h)), horizon, smoothstep(0.45, 1.0, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  return (
    <mesh scale={[500, 500, 500]} material={material}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  )
}

export function SynthwaveLighting() {
  const { pathLength, pathWidth, horizonZ } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x4a2060} intensity={0.55} />
      <hemisphereLight args={[0xff66aa, 0x120028, 0.45]} />
      <directionalLight position={[0, 20, horizonZ + 10]} intensity={0.35} color={0xff8800} />
      <pointLight position={[0, 8, 0]} color={0xff0099} intensity={0.5} distance={40} />
      <pointLight position={[-pathWidth, 3, -pathLength / 4]} color={0x00eaff} intensity={0.35} distance={35} />
      <pointLight position={[pathWidth, 3, -pathLength / 4]} color={0xff0099} intensity={0.35} distance={35} />
    </>
  )
}

export function SynthwaveEnvironment() {
  return (
    <group>
      <SynthwaveSkyDome />
      <SynthwaveGrid />
      <SynthwaveSun />
      <WireframeMountains />
      <PalmRows />
      <FloatingShapes />
    </group>
  )
}
