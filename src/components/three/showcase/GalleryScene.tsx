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
import { SynthwaveRoom, SynthwaveLighting } from './SynthwaveRoom'

function NeonFrameBar({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={0x1a0033} metalness={0.7} roughness={0.25} emissive={0xff0099} emissiveIntensity={0.15} />
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
  const edgeColors = [0xff0099, 0x00eaff, 0xff8800, 0xff66cc]
  const edgeColor = project.color ?? edgeColors[index % edgeColors.length]

  const { x, z, rotationY } = getFrameTransform(index, centerY)
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
          <meshStandardMaterial color={0x120028} metalness={0.75} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0.001]} renderOrder={11}>
          <planeGeometry args={[viewW, viewH]} />
          <meshStandardMaterial color={0x050010} roughness={0.35} metalness={0.4} />
        </mesh>

        <FrameScreenshot
          imageUrl={project.imageUrl}
          width={viewW * 0.94}
          height={viewH * 0.94}
          z={0.012}
          fallbackColor={edgeColor}
        />

        <NeonFrameBar position={[0, outerH / 2 - frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
        <NeonFrameBar position={[0, -outerH / 2 + frameW / 2, depth * 0.15]} size={[outerW, frameW, depth * 0.5]} />
        <NeonFrameBar position={[-outerW / 2 + frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />
        <NeonFrameBar position={[outerW / 2 - frameW / 2, 0, depth * 0.15]} size={[frameW, viewH, depth * 0.5]} />

        <mesh position={[0, -outerH / 2 - 0.04, depth * 0.12]} renderOrder={12}>
          <boxGeometry args={[outerW + 0.12, 0.06, depth * 0.45]} />
          <meshStandardMaterial color={0x2a1045} metalness={0.6} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0, 0.018]} renderOrder={14}>
          <planeGeometry args={[viewW * 0.94, viewH * 0.94]} />
          <meshBasicMaterial color={0xff66cc} transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[0, outerH / 2 - frameW / 2 + 0.01, depth * 0.22]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, -outerH / 2 + frameW / 2 - 0.01, depth * 0.22]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.02, 0.018, 0.025]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.95} />
        </mesh>

        <pointLight position={[0, 0.2, 0.35]} color={edgeColor} intensity={1.4} distance={6} decay={2} />
      </group>
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
      const { moveSpeed, turnSpeed, pathLength, pathWidth } = SHOWCASE_CONFIG
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
      character.position.x = Math.max(-pathWidth / 2 + margin, Math.min(pathWidth / 2 - margin, character.position.x))
      character.position.z = Math.max(-pathLength / 2 + margin, Math.min(pathLength / 2 - margin, character.position.z))

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

    const offset = new THREE.Vector3(0, 3.2, 7.5)
    offset.applyQuaternion(character.quaternion)
    camera.position.copy(character.position).add(offset)
    camera.lookAt(character.position.x, character.position.y + 1.5, character.position.z)
  })

  return (
    <>
      <SynthwaveLighting />
      <SynthwaveRoom />
      {projects.map((project, index) => (
        <ProjectFrame key={`${project.link}-${viewport}`} project={project} index={index} viewport={viewport} />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
