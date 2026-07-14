'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { SHOWCASE_CONFIG, INITIAL_CHARACTER_HEADING, FRAME_SLOTS, getFrameTransform, type ShowcaseProject } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import type { TouchInput } from '@/hooks/use-showcase-viewport'
import { AstronautCharacter, animateAstronautWalk, resetAstronautPose } from './AstronautCharacter'
import { FrameScreenshot } from './FrameScreenshot'

function GalleryWallMotto() {
  const { galleryHeight, galleryLength } = SHOWCASE_CONFIG
  const wallZ = -galleryLength / 2 + 0.14
  const centerY = galleryHeight * 0.52

  const lineProps = {
    anchorX: 'center' as const,
    anchorY: 'middle' as const,
    outlineWidth: 0.028,
    outlineColor: '#0f172a',
    letterSpacing: 0.06,
    maxWidth: 10,
    textAlign: 'center' as const,
  }

  return (
    <group position={[0, centerY, wallZ]}>
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[9.5, 3.4]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.14} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[8.4, 2.8]} />
        <meshBasicMaterial color={0x0f172a} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[7.6, 2.4]} />
        <meshBasicMaterial color={0x1e1b4b} transparent opacity={0.35} />
      </mesh>

      <Text
        {...lineProps}
        position={[0, 0.52, 0.02]}
        fontSize={0.58}
        color="#e0f2fe"
      >
        Astra Castra
      </Text>

      <mesh position={[0, 0.02, 0.01]}>
        <boxGeometry args={[4.8, 0.035, 0.02]} />
        <meshBasicMaterial color={0x6366f1} transparent opacity={0.9} />
      </mesh>

      <Text
        {...lineProps}
        position={[0, -0.48, 0.02]}
        fontSize={0.58}
        color="#a5f3fc"
      >
        Numen Lumen
      </Text>

      <pointLight position={[0, 0, 1.2]} color={0x67e8f9} intensity={1.1} distance={7} />
    </group>
  )
}

function GalleryWallFeaturedPortal({ title, badge }: { title: string; badge: string }) {
  const { galleryHeight, galleryLength } = SHOWCASE_CONFIG
  const wallZ = -galleryLength / 2 + 0.14
  const centerY = galleryHeight * 0.52 - 2.05

  return (
    <group position={[0, centerY, wallZ]}>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[3.6, 2.15]} />
        <meshBasicMaterial color={0x6366f1} transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[3.2, 1.85]} />
        <meshBasicMaterial color={0x0f172a} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.05, 1.7]} />
        <meshBasicMaterial color={0x1e1b4b} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 1.85, 0.04]} />
        <meshStandardMaterial
          color={0x312e81}
          emissive={0x4338ca}
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.45}
        />
      </mesh>

      <Text
        anchorX="center"
        anchorY="middle"
        position={[0, 0.42, 0.05]}
        fontSize={0.22}
        color="#c4b5fd"
        letterSpacing={0.12}
        maxWidth={2.8}
        textAlign="center"
      >
        {badge}
      </Text>

      <Text
        anchorX="center"
        anchorY="middle"
        position={[0, -0.08, 0.05]}
        fontSize={0.28}
        color="#e0f2fe"
        outlineWidth={0.02}
        outlineColor="#0f172a"
        maxWidth={2.9}
        textAlign="center"
      >
        {title}
      </Text>

      <mesh position={[0, -0.62, 0.04]}>
        <boxGeometry args={[1.6, 0.28, 0.03]} />
        <meshStandardMaterial color={0x06b6d4} emissive={0x0891b2} emissiveIntensity={0.6} metalness={0.3} roughness={0.4} />
      </mesh>

      <Text
        anchorX="center"
        anchorY="middle"
        position={[0, -0.62, 0.07]}
        fontSize={0.14}
        color="#ecfeff"
        letterSpacing={0.08}
      >
        E
      </Text>

      <pointLight position={[0, 0.2, 0.8]} color={0xa78bfa} intensity={0.9} distance={4} />
    </group>
  )
}

export function getFeaturedWallDemoPosition() {
  const { galleryHeight, galleryLength } = SHOWCASE_CONFIG
  const wallZ = -galleryLength / 2 + 0.14
  const centerY = galleryHeight * 0.52 - 2.05
  return new THREE.Vector3(0, centerY, wallZ)
}

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
  project: ShowcaseProject | null
  index: number
  viewport: ShowcaseViewport
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

        <FrameScreenshot
          imageUrl={project?.imageUrl ?? null}
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
  keys: React.MutableRefObject<Record<string, boolean>>
  touchInput: React.MutableRefObject<TouchInput>
  characterRef: React.RefObject<THREE.Group | null>
  featuredDemoTitle: string
  featuredDemoBadge: string
  onNearestProject: (project: ShowcaseProject | null) => void
  onNearFeaturedDemo: (near: boolean) => void
}

export function ShowcaseScene({
  projects,
  isPlaying,
  viewport,
  keys,
  touchInput,
  characterRef,
  featuredDemoTitle,
  featuredDemoBadge,
  onNearestProject,
  onNearFeaturedDemo,
}: SceneProps) {
  const walkPhase = useRef(0)
  const headingRef = useRef(INITIAL_CHARACTER_HEADING)
  const lastNearestLinkRef = useRef<string | null>(null)
  const lastNearFeaturedRef = useRef(false)
  const smoothTouch = useRef({ x: 0, y: 0 })
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])
  const featuredWallPos = useMemo(() => getFeaturedWallDemoPosition(), [])
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

      const featuredDist = character.position.distanceTo(featuredWallPos)
      const nearFeaturedDemo = featuredDist < 4.8 && character.position.z < -SHOWCASE_CONFIG.galleryLength / 3
      if (nearFeaturedDemo !== lastNearFeaturedRef.current) {
        lastNearFeaturedRef.current = nearFeaturedDemo
        onNearFeaturedDemo(nearFeaturedDemo)
      }

      const activeProject = !nearFeaturedDemo && nearestDist < 4 ? nearestProject : null
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
      if (lastNearFeaturedRef.current) {
        lastNearFeaturedRef.current = false
        onNearFeaturedDemo(false)
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
      <GalleryWallMotto />
      <GalleryWallFeaturedPortal title={featuredDemoTitle} badge={featuredDemoBadge} />
      {Array.from({ length: FRAME_SLOTS }).map((_, index) => (
        <ProjectFrame
          key={`frame-${index}-${viewport}`}
          project={projects[index] ?? null}
          index={index}
          viewport={viewport}
        />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
