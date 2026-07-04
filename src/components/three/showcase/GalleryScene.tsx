'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOWCASE_CONFIG, INITIAL_CHARACTER_HEADING, getFrameTransform, type ShowcaseProject } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/lib/showcase-viewport'
import type { TouchInput } from '@/lib/showcase-viewport'
import { AstronautCharacter, animateAstronautWalk, resetAstronautPose } from './AstronautCharacter'
import { FrameScreenshot } from './FrameScreenshot'

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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[floorX, 0.025, z]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[floorX, 0.035, z]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

function GalleryShell() {
  const { galleryLength, galleryWidth, galleryHeight } = SHOWCASE_CONFIG

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[galleryWidth * 4, galleryLength * 2.6]} />
        <meshStandardMaterial color={0x12081f} roughness={0.55} metalness={0.15} />
      </mesh>
      <gridHelper args={[Math.max(galleryWidth, galleryLength) * 2.4, 44, 0x7c3aed, 0x251044]} position={[0, 0.01, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[4.8, galleryLength * 1.7]} />
        <meshStandardMaterial color={0x070512} roughness={0.28} metalness={0.35} />
      </mesh>

      {[-2.55, 2.55].map((x) => (
        <mesh key={`road-edge-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.04, 0]}>
          <planeGeometry args={[0.08, galleryLength * 1.7]} />
          <meshBasicMaterial color={0xff2bd6} transparent opacity={0.9} />
        </mesh>
      ))}

      {Array.from({ length: 13 }).map((_, i) => {
        const z = galleryLength / 2 - 2 - i * 3.2
        return (
          <mesh key={`center-dash-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, z]}>
            <planeGeometry args={[0.08, 1.1]} />
            <meshBasicMaterial color={0x00eaff} transparent opacity={0.75} />
          </mesh>
        )
      })}

      {Array.from({ length: 8 }).map((_, i) => {
        const z = -galleryLength / 2 + 2.5 + i * 4
        return (
          <group key={`gate-${i}`}>
            <mesh position={[-3.15, 1.05, z]}>
              <boxGeometry args={[0.08, 2.1, 0.08]} />
              <meshBasicMaterial color={i % 2 === 0 ? 0xff2bd6 : 0x00eaff} transparent opacity={0.5} />
            </mesh>
            <mesh position={[3.15, 1.05, z]}>
              <boxGeometry args={[0.08, 2.1, 0.08]} />
              <meshBasicMaterial color={i % 2 === 0 ? 0xff2bd6 : 0x00eaff} transparent opacity={0.5} />
            </mesh>
            <mesh position={[0, 2.1, z]}>
              <boxGeometry args={[6.3, 0.06, 0.08]} />
              <meshBasicMaterial color={i % 2 === 0 ? 0xff2bd6 : 0x00eaff} transparent opacity={0.35} />
            </mesh>
          </group>
        )
      })}

      {([-1, 1] as const).map((side) => (
        <mesh key={`haze-${side}`} position={[side * 7.8, 1.15, -galleryLength / 2 - 1.5]} rotation={[0, side === -1 ? Math.PI / 7 : -Math.PI / 7, 0]}>
          <planeGeometry args={[11, 2.2]} />
          <meshBasicMaterial color={side === -1 ? 0x2f124f : 0x3b1b2f} transparent opacity={0.42} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {Array.from({ length: 18 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const row = Math.floor(i / 2)
        const height = 1.1 + ((row * 37) % 6) * 0.32
        const width = 0.7 + ((row * 19) % 4) * 0.16
        const x = side * (6.2 + (row % 3) * 0.72)
        const z = -galleryLength / 2 - 2.5 + row * 1.25
        return (
          <group key={`skyline-${i}`} position={[x, height / 2, z]}>
            <mesh>
              <boxGeometry args={[width, height, 0.7]} />
              <meshStandardMaterial color={0x130923} roughness={0.7} metalness={0.2} emissive={0x120425} emissiveIntensity={0.35} />
            </mesh>
            <mesh position={[0, height * 0.12, -0.36]}>
              <boxGeometry args={[width * 0.72, 0.035, 0.02]} />
              <meshBasicMaterial color={row % 2 === 0 ? 0xff2bd6 : 0x00eaff} transparent opacity={0.55} />
            </mesh>
          </group>
        )
      })}

      <mesh position={[0, 1.9, -galleryLength / 2 - 5.2]}>
        <planeGeometry args={[7.5, 2.8]} />
        <meshBasicMaterial color={0xff6a3d} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.95, -galleryLength / 2 - 5.25]}>
        <planeGeometry args={[5.8, 0.08]} />
        <meshBasicMaterial color={0xff2bd6} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.45, -galleryLength / 2 - 5.2]}>
        <planeGeometry args={[7.2, 0.05]} />
        <meshBasicMaterial color={0x00eaff} transparent opacity={0.24} depthWrite={false} />
      </mesh>
    </group>
  )
}

function GalleryLighting() {
  const { galleryLength, galleryWidth, galleryHeight } = SHOWCASE_CONFIG

  return (
    <>
      <ambientLight color={0x5b4a7b} intensity={0.5} />
      <directionalLight
        position={[5, galleryHeight + 10, -10]}
        intensity={0.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-4, 3, 0]} color={0xff2bd6} intensity={0.8} distance={22} />
      <pointLight position={[4, 3, 0]} color={0x00eaff} intensity={0.8} distance={22} />
      <pointLight position={[0, 2, -galleryLength / 2 - 4]} color={0xff6a3d} intensity={1} distance={28} />
      <hemisphereLight args={[0x624b8f, 0x12081f, 0.34]} />
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

  useFrame(({ camera }) => {
    const character = characterRef.current
    if (!character) return

    if (isPlaying) {
      let moving = false
      const { moveSpeed, turnSpeed, galleryLength, galleryWidth } = SHOWCASE_CONFIG
      const touch = touchInput.current
      const deadZone = 0.14

      const turnLeft = keys.current['KeyA'] || keys.current['ArrowLeft'] || (touch.active && touch.x < -deadZone)
      const turnRight = keys.current['KeyD'] || keys.current['ArrowRight'] || (touch.active && touch.x > deadZone)
      const moveForward = keys.current['KeyW'] || keys.current['ArrowUp'] || (touch.active && touch.y < -deadZone)
      const moveBack = keys.current['KeyS'] || keys.current['ArrowDown'] || (touch.active && touch.y > deadZone)

      if (turnLeft) {
        const intensity = touch.active && touch.x < -deadZone ? Math.min(1, Math.abs(touch.x)) : 1
        headingRef.current += turnSpeed * intensity
        moving = true
      }
      if (turnRight) {
        const intensity = touch.active && touch.x > deadZone ? Math.min(1, Math.abs(touch.x)) : 1
        headingRef.current -= turnSpeed * intensity
        moving = true
      }

      character.quaternion.setFromAxisAngle(yAxis, headingRef.current)

      if (moveForward) {
        const intensity =
          touch.active && touch.y < -deadZone ? Math.min(1, Math.abs(touch.y)) : 1
        moveDir.set(0, 0, -moveSpeed * intensity)
        moveDir.applyQuaternion(character.quaternion)
        character.position.add(moveDir)
        moving = true
      }
      if (moveBack) {
        const intensity = touch.active && touch.y > deadZone ? Math.min(1, Math.abs(touch.y)) : 1
        moveDir.set(0, 0, moveSpeed * intensity)
        moveDir.applyQuaternion(character.quaternion)
        character.position.add(moveDir)
        moving = true
      }

      const margin = 1.5
      character.position.x = Math.max(-galleryWidth / 2 + margin, Math.min(galleryWidth / 2 - margin, character.position.x))
      character.position.z = Math.max(-galleryLength / 2 + margin, Math.min(galleryLength / 2 - margin, character.position.z))

      if (moving) {
        walkPhase.current += 0.15
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
      <color attach="background" args={['#090312']} />
      <fog attach="fog" args={['#090312', 16, 54]} />
      <GalleryLighting />
      <Starfield />
      <GalleryShell />
      {projects.map((project, index) => (
        <ProjectFrame key={`${project.link}-${viewport}`} project={project} index={index} viewport={viewport} />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
