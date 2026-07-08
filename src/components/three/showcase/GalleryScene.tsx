'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOWCASE_CONFIG, INITIAL_CHARACTER_HEADING, FRAME_SLOTS, getFrameTransform, type ShowcaseProject } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/lib/showcase-viewport'
import type { TouchInput } from '@/lib/showcase-viewport'
import { AstronautCharacter, animateAstronautWalk, resetAstronautPose } from './AstronautCharacter'
import { FrameComingSoon } from './FrameComingSoon'

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
  screenLabel,
}: {
  project: ShowcaseProject | null
  index: number
  viewport: ShowcaseViewport
  screenLabel: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewW, viewH, frameW, depth, centerY } = getFrameDimensions(viewport)
  const outerW = viewW + frameW * 2
  const outerH = viewH + frameW * 2
  const edgeColors = [0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8]
  const edgeColor = project?.color ?? edgeColors[index % edgeColors.length]

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

        <FrameComingSoon
          label={screenLabel}
          width={viewW * 0.94}
          height={viewH * 0.94}
          z={0.012}
          accentColor={edgeColor}
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[floorX, 0.02, z]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial color={edgeColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[floorX, 0.015, z]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.2} />
      </mesh>
    </>
  )
}

function GalleryShell() {
  const { galleryLength, galleryWidth, galleryHeight } = SHOWCASE_CONFIG

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[galleryWidth, galleryLength]} />
        <meshStandardMaterial color={0x1a1a2e} roughness={0.3} metalness={0.7} />
      </mesh>
      <gridHelper args={[Math.max(galleryWidth, galleryLength), 20, 0x06b6d4, 0x1e3a5f]} position={[0, 0.01, 0]} />

      {[-galleryWidth / 2 + 0.05, galleryWidth / 2 - 0.05].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.1, galleryLength]} />
          <meshBasicMaterial color={0x06b6d4} transparent opacity={0.6} />
        </mesh>
      ))}

      <mesh position={[0, galleryHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[galleryWidth, galleryLength]} />
        <meshStandardMaterial color={0x0f172a} roughness={0.5} metalness={0.5} />
      </mesh>

      {Array.from({ length: 4 }).map((_, i) => {
        const z = -galleryLength / 2 + 4 + i * 5
        return (
          <group key={z}>
            <mesh position={[0, galleryHeight - 0.12, z]} castShadow>
              <boxGeometry args={[galleryWidth + 0.5, 0.25, 0.25]} />
              <meshStandardMaterial color={0x334155} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, galleryHeight - 0.26, z]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[galleryWidth - 2, 0.08]} />
              <meshBasicMaterial color={0x6366f1} transparent opacity={0.7} />
            </mesh>
          </group>
        )
      })}

      {[-galleryWidth / 2 + 0.15, galleryWidth / 2 - 0.15].map((x) => (
        <mesh key={x} position={[x, galleryHeight - 0.1, 0]}>
          <boxGeometry args={[0.2, 0.2, galleryLength]} />
          <meshStandardMaterial color={0x475569} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {([
        { rot: [0, Math.PI / 2, 0] as [number, number, number], pos: [-galleryWidth / 2, galleryHeight / 2, 0] as [number, number, number] },
        { rot: [0, -Math.PI / 2, 0] as [number, number, number], pos: [galleryWidth / 2, galleryHeight / 2, 0] as [number, number, number] },
        { rot: [0, 0, 0] as [number, number, number], pos: [0, galleryHeight / 2, -galleryLength / 2] as [number, number, number] },
        { rot: [0, Math.PI, 0] as [number, number, number], pos: [0, galleryHeight / 2, galleryLength / 2] as [number, number, number] },
      ] as const).map(({ rot, pos }, i) => (
        <mesh key={i} position={pos} rotation={rot} receiveShadow>
          <planeGeometry args={i < 2 ? [galleryLength, galleryHeight] : [galleryWidth, galleryHeight]} />
          <meshStandardMaterial color={0x1e293b} roughness={0.6} metalness={0.4} />
        </mesh>
      ))}

      {([-1, 1] as const).map((side) => (
        <mesh
          key={`inner-${side}`}
          position={[side * (galleryWidth / 2 - 0.02), galleryHeight / 2, 0]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[galleryLength, galleryHeight]} />
          <meshStandardMaterial color={0x141c2e} roughness={0.75} metalness={0.25} />
        </mesh>
      ))}

      {Array.from({ length: 6 }).map((_, i) => {
        const z = -galleryLength / 2 + 3 + i * 4
        return [-1, 1].map((side) => (
          <group key={`${i}-${side}`}>
            <mesh position={[side * (galleryWidth / 2 - 0.04), galleryHeight * 0.5, z]}>
              <boxGeometry args={[0.08, 1.5, 0.8]} />
              <meshStandardMaterial color={0x334155} roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[side * (galleryWidth / 2 - 0.01), galleryHeight * 0.65, z]} rotation={[0, (side * Math.PI) / 2, 0]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color={[0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8][i % 4]} transparent opacity={0.9} />
            </mesh>
          </group>
        ))
      })}

      <mesh position={[-8, galleryHeight + 5, -20]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color={0x6366f1} roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[-8, galleryHeight + 5, -20]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.15, 8, 32]} />
        <meshStandardMaterial color={0x6366f1} roughness={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function GalleryLighting() {
  const { galleryLength, galleryWidth, galleryHeight } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x3b4a6b} intensity={0.4} />
      <directionalLight
        position={[5, galleryHeight + 10, -10]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, galleryHeight - 1, 0]} color={0x6366f1} intensity={0.6} distance={25} />
      <pointLight position={[5, galleryHeight - 1, 0]} color={0x06b6d4} intensity={0.6} distance={25} />
      <pointLight position={[0, 1, -galleryLength / 2 + 3]} color={0x06b6d4} intensity={0.5} distance={20} />
      <hemisphereLight args={[0x4a5568, 0x1a1a2e, 0.3]} />
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
  screenLabel: string
  keys: React.MutableRefObject<Record<string, boolean>>
  touchInput: React.MutableRefObject<TouchInput>
  characterRef: React.RefObject<THREE.Group | null>
  onNearestProject: (project: ShowcaseProject | null) => void
}

export function ShowcaseScene({
  projects,
  isPlaying,
  viewport,
  screenLabel,
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
      <color attach="background" args={['#0a0a1a']} />
      <fog attach="fog" args={['#0a0a1a', 20, 80]} />
      <GalleryLighting />
      <Starfield />
      <GalleryShell />
      <PortfolioWallText />
      {Array.from({ length: FRAME_SLOTS }).map((_, index) => (
        <ProjectFrame
          key={`frame-${index}-${viewport}`}
          project={projects[index] ?? null}
          index={index}
          viewport={viewport}
          screenLabel={screenLabel}
        />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
