'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SHOWCASE_CONFIG, INITIAL_CHARACTER_HEADING, getFrameTransform, type ShowcaseProject } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/lib/showcase-viewport'
import type { TouchInput } from '@/lib/showcase-viewport'
import { AstronautCharacter, animateAstronautWalk, resetAstronautPose } from './AstronautCharacter'
import { FrameScreenshot } from './FrameScreenshot'

const LETTER_BLOCKS = [
  [
    { x: -4, y: 0, w: 0.15, h: 1.2 },
    { x: -3.8, y: 0.5, w: 0.4, h: 0.15 },
    { x: -3.5, y: 0.3, w: 0.15, h: 0.5 },
    { x: -3.8, y: 0.1, w: 0.4, h: 0.15 },
  ],
  [
    { x: -3.0, y: 0, w: 0.15, h: 1.2 },
    { x: -2.5, y: 0, w: 0.15, h: 1.2 },
    { x: -2.75, y: 0.5, w: 0.4, h: 0.15 },
    { x: -2.75, y: -0.5, w: 0.4, h: 0.15 },
  ],
  [
    { x: -2.0, y: 0, w: 0.15, h: 1.2 },
    { x: -1.8, y: 0.5, w: 0.4, h: 0.15 },
    { x: -1.5, y: 0.3, w: 0.15, h: 0.5 },
    { x: -1.8, y: 0.1, w: 0.4, h: 0.15 },
    { x: -1.5, y: -0.3, w: 0.15, h: 0.5 },
  ],
  [
    { x: -1.0, y: 0.5, w: 0.6, h: 0.15 },
    { x: -1.0, y: 0, w: 0.15, h: 1.2 },
  ],
  [
    { x: -0.3, y: 0, w: 0.15, h: 1.2 },
    { x: -0.1, y: 0.5, w: 0.4, h: 0.15 },
    { x: -0.1, y: 0.1, w: 0.3, h: 0.15 },
  ],
  [
    { x: 0.5, y: 0, w: 0.15, h: 1.2 },
    { x: 1.0, y: 0, w: 0.15, h: 1.2 },
    { x: 0.75, y: 0.5, w: 0.4, h: 0.15 },
    { x: 0.75, y: -0.5, w: 0.4, h: 0.15 },
  ],
  [
    { x: 1.5, y: 0, w: 0.15, h: 1.2 },
    { x: 1.7, y: -0.5, w: 0.4, h: 0.15 },
  ],
  [{ x: 2.3, y: 0, w: 0.15, h: 1.2 }],
  [
    { x: 2.8, y: 0, w: 0.15, h: 1.2 },
    { x: 3.3, y: 0, w: 0.15, h: 1.2 },
    { x: 3.05, y: 0.5, w: 0.4, h: 0.15 },
    { x: 3.05, y: -0.5, w: 0.4, h: 0.15 },
  ],
] as const

function Starfield() {
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const radius = 80 + Math.random() * 50
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.cos(phi)
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={0xffffff} size={0.5} transparent opacity={0.8} />
    </points>
  )
}

function PortfolioWallText() {
  const letterMat = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.9 }), [])

  return (
    <group position={[0, SHOWCASE_CONFIG.galleryHeight * 0.5, -SHOWCASE_CONFIG.galleryLength / 2 + 0.3]}>
      {LETTER_BLOCKS.flatMap((letter, li) =>
        letter.map((block, bi) => (
          <mesh key={`${li}-${bi}`} material={letterMat} position={[block.x, block.y, 0.1]}>
            <boxGeometry args={[block.w, block.h, 0.1]} />
          </mesh>
        )),
      )}
      <mesh position={[0, -1, 0.05]}>
        <boxGeometry args={[6, 0.05, 0.02]} />
        <meshBasicMaterial color={0x6366f1} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[8, 3]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

function WindowFrameBar({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number, number]
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={0x94a3b8} metalness={0.55} roughness={0.35} />
    </mesh>
  )
}

function ProjectFrame({
  project,
  index,
  viewport,
}: {
  project: ShowcaseProject
  index: number
  viewport: ShowcaseViewport
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewW, viewH, frameW, depth, centerY } = getFrameDimensions(viewport)
  const outerW = viewW + frameW * 2
  const outerH = viewH + frameW * 2
  const edgeColors = [0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8]
  const edgeColor = project.color ?? edgeColors[index % edgeColors.length]

  const { x, z, rotationY, floorX } = getFrameTransform(index, centerY)
  const baseY = centerY

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime + index) * 0.01
    }
  })

  return (
    <>
      <group ref={groupRef} position={[x, baseY, z]} rotation={[0, rotationY, 0]} renderOrder={10}>
        <mesh position={[0, 0, -depth * 0.5]} renderOrder={10}>
          <boxGeometry args={[outerW + 0.08, outerH + 0.08, depth]} />
          <meshStandardMaterial color={0x334155} metalness={0.6} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0, 0.001]} renderOrder={11}>
          <planeGeometry args={[viewW, viewH]} />
          <meshStandardMaterial color={0x020617} roughness={0.4} metalness={0.2} />
        </mesh>

        <FrameScreenshot
          imageUrl={project.imageUrl}
          width={viewW * 0.94}
          height={viewH * 0.94}
          z={0.012}
          fallbackColor={edgeColor}
        />

        <WindowFrameBar position={[0, outerH / 2 - frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
        <WindowFrameBar position={[0, -outerH / 2 + frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
        <WindowFrameBar position={[-outerW / 2 + frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />
        <WindowFrameBar position={[outerW / 2 - frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />

        <mesh position={[0, -outerH / 2 - 0.04, depth * 0.12]} renderOrder={12}>
          <boxGeometry args={[outerW + 0.12, 0.06, depth * 0.45]} />
          <meshStandardMaterial color={0x64748b} metalness={0.5} roughness={0.45} />
        </mesh>

        <mesh position={[0, 0, 0.018]} renderOrder={14}>
          <planeGeometry args={[viewW * 0.94, viewH * 0.94]} />
          <meshBasicMaterial color={0xc7d9ff} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[0, outerH / 2 - frameW / 2 + 0.01, depth * 0.22]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, -outerH / 2 + frameW / 2 - 0.01, depth * 0.22]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.95} />
        </mesh>

        <pointLight position={[0, 0.2, 0.35]} color={edgeColor} intensity={1.1} distance={5} decay={2} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[floorX, 0.022, z]}>
        <planeGeometry args={[1.9, 1.1]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[floorX, 0.026, z]}>
        <planeGeometry args={[1.25, 0.08]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.55} />
      </mesh>
    </>
  )
}

function BackdropPlane() {
  const texture = useTexture('/textures/backdrop.png')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  return (
    <mesh position={[0, 50, -260]}>
      <planeGeometry args={[360, 180]} />
      <meshBasicMaterial map={texture} fog={false} depthWrite={false} />
    </mesh>
  )
}

function SideBillboards({ side }: { side: -1 | 1 }) {
  const texture = useTexture(side === -1 ? '/textures/city-strip.png' : '/textures/desert-strip.png')
  const zPositions = useMemo(() => [-15, -55, -95, -135], [])

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  return (
    <>
      {zPositions.map((z) => (
        <mesh
          key={`${side}-${z}`}
          position={[side * 22, 12.5, z]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[45, 25]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
            fog
          />
        </mesh>
      ))}
    </>
  )
}

function SynthwaveGround() {
  const { galleryLength, galleryWidth } = SHOWCASE_CONFIG

  const groundMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPos;
          void main(){
            vec2 g = abs(fract(vPos.xy * 0.12) - 0.5);
            float line = min(g.x, g.y);
            float grid = 1.0 - smoothstep(0.0, 0.02, line);
            float d = length(vPos.xy) * 0.005;
            float fade = 1.0 - smoothstep(0.15, 0.9, d);
            vec3 base = vec3(0.04, 0.01, 0.09);
            vec3 gridCol = vec3(0.45, 0.12, 0.65);
            vec3 col = base + gridCol * grid * fade * 0.35;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  const roadMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main(){
            vec3 base = vec3(0.05, 0.02, 0.11);
            float edge = smoothstep(0.47, 0.5, abs(vUv.x - 0.5));
            vec3 edgeCol = vec3(1.0, 0.18, 0.84);
            float cx = abs(vUv.x - 0.5);
            float centerMask = 1.0 - smoothstep(0.006, 0.014, cx);
            float dash = step(0.5, fract(vUv.y * 25.0));
            vec3 centerCol = vec3(0.13, 0.85, 0.93) * centerMask * dash;
            vec3 col = base + edgeCol * edge * 1.6 + centerCol * 0.8;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={groundMat} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, -galleryLength / 2 + 8]}
        material={roadMat}
        receiveShadow
      >
        <planeGeometry args={[galleryWidth, galleryLength]} />
      </mesh>
      {[-galleryWidth / 2 + 0.06, galleryWidth / 2 - 0.06].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.035, -galleryLength / 2 + 8]}>
          <planeGeometry args={[0.12, galleryLength]} />
          <meshBasicMaterial color={0xff2fd6} transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  )
}

function NeonGate() {
  const { galleryLength, galleryWidth } = SHOWCASE_CONFIG
  const z = -galleryLength / 2 + 5

  return (
    <group position={[0, 0, z]}>
      <mesh position={[-galleryWidth / 2, 7, 0]}>
        <boxGeometry args={[0.5, 14, 0.5]} />
        <meshBasicMaterial color={0xff2fd6} />
      </mesh>
      <mesh position={[galleryWidth / 2, 7, 0]}>
        <boxGeometry args={[0.5, 14, 0.5]} />
        <meshBasicMaterial color={0xff2fd6} />
      </mesh>
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[galleryWidth + 1, 0.5, 0.5]} />
        <meshBasicMaterial color={0x22d3ee} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 12 - i * 1.7, 0]}>
          <boxGeometry args={[galleryWidth - 0.5, 0.15, 0.15]} />
          <meshBasicMaterial color={0xff88dd} transparent opacity={0.75 - i * 0.1} />
        </mesh>
      ))}
    </group>
  )
}

function Palm({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 3 * scale, 0]}>
        <cylinderGeometry args={[0.15 * scale, 0.22 * scale, 6 * scale, 6]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.1 * scale, 6 * scale, Math.sin(a) * 1.1 * scale]}
            rotation={[Math.sin(a) * 1.1, 0, Math.cos(a) * 1.1]}
          >
            <coneGeometry args={[0.25 * scale, 3 * scale, 4]} />
            <meshBasicMaterial color={0x000000} />
          </mesh>
        )
      })}
    </group>
  )
}

function Palms() {
  const { galleryLength, galleryWidth } = SHOWCASE_CONFIG
  const palms = useMemo(() => {
    const list: { x: number; z: number; scale: number }[] = []
    for (let z = galleryLength / 2 - 8; z > -galleryLength / 2; z -= 18) {
      const scale = 0.72 + ((Math.abs(Math.round(z)) % 5) * 0.04)
      list.push({ x: -galleryWidth / 2 - 1.5, z, scale })
      list.push({ x: galleryWidth / 2 + 1.5, z, scale: scale + 0.06 })
    }
    return list
  }, [galleryLength, galleryWidth])

  return (
    <>
      {palms.map((p, i) => (
        <Palm key={i} position={[p.x, 0, p.z]} scale={p.scale} />
      ))}
    </>
  )
}

function FloatingWireShapes() {
  const shapes = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1
        return {
          geometry:
            i % 3 === 0
              ? new THREE.BoxGeometry(1.3, 1.3, 1.3)
              : i % 3 === 1
                ? new THREE.OctahedronGeometry(0.9)
                : new THREE.TetrahedronGeometry(1.1),
          color: [0xff2fd6, 0x22d3ee, 0xffffff][i % 3],
          position: new THREE.Vector3(side * (2.5 + (i % 4) * 0.9), 4 + (i % 5), -18 - i * 13),
          spinX: (i % 2 === 0 ? 1 : -1) * 0.006,
          spinY: (i % 3 === 0 ? -1 : 1) * 0.008,
          phase: i * 0.7,
        }
      }),
    [],
  )
  const refs = useRef<Array<THREE.LineSegments | null>>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((shape, i) => {
      if (!shape) return
      const data = shapes[i]
      shape.rotation.x += data.spinX
      shape.rotation.y += data.spinY
      shape.position.y = data.position.y + Math.sin(t + data.phase) * 0.5
    })
  })

  return (
    <>
      {shapes.map((shape, i) => (
        <lineSegments
          key={i}
          ref={(node) => {
            refs.current[i] = node
          }}
          position={shape.position}
        >
          <edgesGeometry args={[shape.geometry]} />
          <lineBasicMaterial color={shape.color} transparent opacity={0.85} />
        </lineSegments>
      ))}
    </>
  )
}

function GalleryShell() {
  return (
    <>
      <BackdropPlane />
      <SideBillboards side={-1} />
      <SideBillboards side={1} />
      <SynthwaveGround />
      <NeonGate />
      <Palms />
      <FloatingWireShapes />
    </>
  )
}

function GalleryLighting() {
  const { galleryLength, galleryWidth, galleryHeight } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x8866cc} intensity={0.9} />
      <directionalLight
        color={0xffaadd}
        position={[0, galleryHeight + 10, -30]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight color={0x22d3ee} intensity={0.5} position={[-10, 6, 8]} />
      <pointLight position={[-5, galleryHeight - 1, 0]} color={0xff2fd6} intensity={0.7} distance={25} />
      <pointLight position={[5, galleryHeight - 1, 0]} color={0x22d3ee} intensity={0.7} distance={25} />
      <pointLight position={[0, 1, -galleryLength / 2 + 3]} color={0x22d3ee} intensity={0.6} distance={24} />
      <hemisphereLight args={[0x4a5568, 0x1a0028, 0.35]} />
      {[1, 2, 3].map((i) => {
        const z = -galleryLength / 2 + (galleryLength / 4) * i
        const color = i % 2 === 0 ? 0x06b6d4 : 0x6366f1
        return <pointLight key={i} position={[0, galleryHeight - 0.5, z]} color={color} intensity={0.5} distance={12} />
      })}
      <pointLight position={[-galleryWidth / 2 + 1, 0.5, 0]} color={0x06b6d4} intensity={0.3} distance={15} />
      <pointLight position={[galleryWidth / 2 - 1, 0.5, 0]} color={0x06b6d4} intensity={0.3} distance={15} />
    </>
  )
}

type SceneProps = {
  projects: ShowcaseProject[]
  isPlaying: boolean
  viewport: ShowcaseViewport
  keys: React.MutableRefObject<Record<string, boolean>>
  touchInput: React.MutableRefObject<TouchInput>
  characterRef: React.RefObject<THREE.Group | null>
  onNearestProject: (project: ShowcaseProject | null) => void
}

export function ShowcaseScene({
  projects,
  isPlaying,
  viewport,
  keys,
  touchInput,
  characterRef,
  onNearestProject,
}: SceneProps) {
  const walkPhase = useRef(0)
  const headingRef = useRef(INITIAL_CHARACTER_HEADING)
  const lastNearestLinkRef = useRef<string | null>(null)
  const smoothTouch = useRef({ x: 0, y: 0 })
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])
  const framePositions = useMemo(
    () =>
      projects.map((project, index) => {
        const { centerY } = getFrameDimensions(viewport)
        const { x, z } = getFrameTransform(index, centerY)
        return { project, pos: new THREE.Vector3(x, centerY * 0.35, z) }
      }),
    [projects, viewport],
  )

  useEffect(() => {
    if (characterRef.current) {
      headingRef.current = INITIAL_CHARACTER_HEADING
      characterRef.current.quaternion.setFromAxisAngle(yAxis, headingRef.current)
    }
  }, [characterRef, yAxis])

  useFrame(({ camera }, delta) => {
    const character = characterRef.current
    if (!character) return

    const dt = Math.min(delta, 0.05)

    if (isPlaying) {
      let moving = false
      const { moveSpeed, turnSpeed, mobileSpeedMultiplier, touchDeadZone, galleryLength, galleryWidth } =
        SHOWCASE_CONFIG
      const touch = touchInput.current
      const deadZone = touchDeadZone
      const mobileBoost = viewport === 'mobile' ? mobileSpeedMultiplier : 1

      if (touch.active) {
        const blend = 1 - Math.exp(-14 * dt)
        smoothTouch.current.x = THREE.MathUtils.lerp(smoothTouch.current.x, touch.x, blend)
        smoothTouch.current.y = THREE.MathUtils.lerp(smoothTouch.current.y, touch.y, blend)
      } else {
        smoothTouch.current.x = 0
        smoothTouch.current.y = 0
      }

      const tx = touch.active ? smoothTouch.current.x : 0
      const ty = touch.active ? smoothTouch.current.y : 0

      const turnLeft = keys.current['KeyA'] || keys.current['ArrowLeft'] || (touch.active && tx < -deadZone)
      const turnRight = keys.current['KeyD'] || keys.current['ArrowRight'] || (touch.active && tx > deadZone)
      const moveForward = keys.current['KeyW'] || keys.current['ArrowUp'] || (touch.active && ty < -deadZone)
      const moveBack = keys.current['KeyS'] || keys.current['ArrowDown'] || (touch.active && ty > deadZone)

      if (turnLeft) {
        const intensity = touch.active && tx < -deadZone ? Math.min(1, Math.abs(tx)) : 1
        headingRef.current += turnSpeed * intensity * dt * mobileBoost
        moving = true
      }
      if (turnRight) {
        const intensity = touch.active && tx > deadZone ? Math.min(1, Math.abs(tx)) : 1
        headingRef.current -= turnSpeed * intensity * dt * mobileBoost
        moving = true
      }

      character.quaternion.setFromAxisAngle(yAxis, headingRef.current)

      if (moveForward) {
        const intensity = touch.active && ty < -deadZone ? Math.min(1, Math.abs(ty)) : 1
        moveDir.set(0, 0, -moveSpeed * intensity * dt * mobileBoost)
        moveDir.applyQuaternion(character.quaternion)
        character.position.add(moveDir)
        moving = true
      }
      if (moveBack) {
        const intensity = touch.active && ty > deadZone ? Math.min(1, Math.abs(ty)) : 1
        moveDir.set(0, 0, moveSpeed * intensity * dt * mobileBoost)
        moveDir.applyQuaternion(character.quaternion)
        character.position.add(moveDir)
        moving = true
      }

      const margin = 1.5
      character.position.x = Math.max(-galleryWidth / 2 + margin, Math.min(galleryWidth / 2 - margin, character.position.x))
      character.position.z = Math.max(-galleryLength / 2 + margin, Math.min(galleryLength / 2 - margin, character.position.z))

      if (moving) {
        walkPhase.current += dt * 9
        animateAstronautWalk(character, walkPhase.current)
      } else {
        resetAstronautPose(character)
      }

      let nearestProject: ShowcaseProject | null = null
      let nearestDist = Infinity
      for (const { project, pos } of framePositions) {
        const dist = character.position.distanceTo(pos)
        if (dist < 5 && dist < nearestDist) {
          nearestDist = dist
          nearestProject = project
        }
      }
      const activeProject = nearestDist < 4 ? nearestProject : null
      const nextLink = activeProject?.link ?? null
      if (nextLink !== lastNearestLinkRef.current) {
        lastNearestLinkRef.current = nextLink
        onNearestProject(activeProject)
      }
    } else {
      if (lastNearestLinkRef.current !== null) {
        lastNearestLinkRef.current = null
        onNearestProject(null)
      }
      character.quaternion.setFromAxisAngle(yAxis, headingRef.current)
    }

    const offset = new THREE.Vector3(0, 4, 6)
    offset.applyQuaternion(character.quaternion)
    camera.position.copy(character.position).add(offset)
    camera.lookAt(character.position.x, character.position.y + 1.5, character.position.z)
  })

  return (
    <>
      <color attach="background" args={['#1a0028']} />
      <fog attach="fog" args={['#2a0a4a', 35, 125]} />
      <GalleryLighting />
      <Starfield />
      <GalleryShell />
      <PortfolioWallText />
      {projects.map((project, index) => (
        <ProjectFrame key={`${project.link}-${viewport}`} project={project} index={index} viewport={viewport} />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
