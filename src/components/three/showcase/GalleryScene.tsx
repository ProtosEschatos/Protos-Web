'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SHOWCASE_CONFIG, INITIAL_CHARACTER_HEADING, type ShowcaseProject } from './constants'
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

function ProjectFrame({ project, index }: { project: ShowcaseProject; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const viewW = 1.35
  const viewH = 2.75
  const frameW = 0.12
  const depth = 0.18
  const outerW = viewW + frameW * 2
  const outerH = viewH + frameW * 2
  const edgeColors = [0x6366f1, 0x06b6d4, 0xf59e0b, 0x818cf8]
  const edgeColor = edgeColors[index % edgeColors.length]

  const side = index % 2 === 0 ? -1 : 1
  const row = Math.floor(index / 2)
  const startZ = -SHOWCASE_CONFIG.galleryLength / 2 + 6
  const z = startZ + row * SHOWCASE_CONFIG.frameSpacing
  const x = side * (SHOWCASE_CONFIG.galleryWidth / 2 - 0.05)
  const y = 2.55

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = y + Math.sin(state.clock.elapsedTime + index) * 0.012
    }
  })

  return (
    <>
      <group ref={groupRef} position={[x, y, z]} rotation={[0, side * Math.PI / 2, 0]} renderOrder={8}>
        <mesh position={[0, 0, -depth * 0.35]} renderOrder={8}>
          <boxGeometry args={[outerW + 0.28, outerH + 0.28, depth * 0.75]} />
          <meshStandardMaterial color={0x1e293b} roughness={0.85} metalness={0.15} />
        </mesh>

        <mesh position={[0, 0, -depth * 0.08]} renderOrder={9}>
          <boxGeometry args={[outerW + 0.06, outerH + 0.06, depth * 0.45]} />
          <meshStandardMaterial color={0x020617} roughness={0.95} metalness={0.05} />
        </mesh>

        <WindowFrameBar position={[0, outerH / 2 - frameW / 2, depth * 0.08]} size={[outerW, frameW, depth * 0.85]} />
        <WindowFrameBar position={[0, -outerH / 2 + frameW / 2, depth * 0.08]} size={[outerW, frameW, depth * 0.85]} />
        <WindowFrameBar position={[-outerW / 2 + frameW / 2, 0, depth * 0.08]} size={[frameW, viewH, depth * 0.85]} />
        <WindowFrameBar position={[outerW / 2 - frameW / 2, 0, depth * 0.08]} size={[frameW, viewH, depth * 0.85]} />

        <mesh position={[0, -outerH / 2 - 0.05, depth * 0.12]} renderOrder={9}>
          <boxGeometry args={[outerW + 0.18, 0.08, depth * 0.65]} />
          <meshStandardMaterial color={0x64748b} metalness={0.45} roughness={0.5} />
        </mesh>

        <mesh position={[0, 0, depth * 0.06]} renderOrder={10}>
          <planeGeometry args={[viewW, viewH]} />
          <meshStandardMaterial color={0x0f172a} roughness={0.3} metalness={0.2} />
        </mesh>

        <FrameScreenshot
          imageUrl={project.imageUrl}
          width={viewW * 0.96}
          height={viewH * 0.96}
          z={depth * 0.07}
          fallbackColor={edgeColor}
        />

        <mesh position={[0, 0, depth * 0.085]} renderOrder={14}>
          <planeGeometry args={[viewW * 0.96, viewH * 0.96]} />
          <meshBasicMaterial color={0xc7d9ff} transparent opacity={0.06} depthWrite={false} />
        </mesh>

        <mesh position={[0, outerH / 2 - frameW / 2 + 0.015, depth * 0.09]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.04, 0.02, 0.03]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, -outerH / 2 + frameW / 2 - 0.015, depth * 0.09]} renderOrder={15}>
          <boxGeometry args={[outerW - 0.04, 0.02, 0.03]} />
          <meshBasicMaterial color={edgeColor} transparent opacity={0.9} />
        </mesh>

        <pointLight position={[0, 0.4, 0.55]} color={edgeColor} intensity={0.9} distance={4} decay={2} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * (SHOWCASE_CONFIG.galleryWidth / 2 - 2.5), 0.02, z]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * (SHOWCASE_CONFIG.galleryWidth / 2 - 2.5), 0.015, z]}>
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
  keys: React.MutableRefObject<Record<string, boolean>>
  characterRef: React.RefObject<THREE.Group | null>
  onCharacterMove: (pos: THREE.Vector3, rotationY: number) => void
  onNearestProject: (project: ShowcaseProject | null) => void
}

export function ShowcaseScene({ projects, isPlaying, keys, characterRef, onCharacterMove, onNearestProject }: SceneProps) {
  const walkPhase = useRef(0)
  const headingRef = useRef(INITIAL_CHARACTER_HEADING)
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])
  const framePositions = useMemo(
    () =>
      projects.map((project, index) => {
        const side = index % 2 === 0 ? -1 : 1
        const row = Math.floor(index / 2)
        const z = -SHOWCASE_CONFIG.galleryLength / 2 + 6 + row * SHOWCASE_CONFIG.frameSpacing
        return { project, pos: new THREE.Vector3(side * (SHOWCASE_CONFIG.galleryWidth / 2 - 2), 0, z) }
      }),
    [projects],
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

      if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
        headingRef.current += turnSpeed
        moving = true
      }
      if (keys.current['KeyD'] || keys.current['ArrowRight']) {
        headingRef.current -= turnSpeed
        moving = true
      }

      character.quaternion.setFromAxisAngle(yAxis, headingRef.current)

      if (keys.current['KeyW'] || keys.current['ArrowUp']) {
        moveDir.set(0, 0, -moveSpeed)
        moveDir.applyQuaternion(character.quaternion)
        character.position.add(moveDir)
        moving = true
      }
      if (keys.current['KeyS'] || keys.current['ArrowDown']) {
        moveDir.set(0, 0, moveSpeed)
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

      let closest: ShowcaseProject | null = null
      let closestDist = Infinity
      framePositions.forEach(({ project, pos }) => {
        const dist = character.position.distanceTo(pos)
        if (dist < 5 && dist < closestDist) {
          closestDist = dist
          closest = project
        }
      })
      onNearestProject(closestDist < 4 ? closest : null)
    } else {
      character.quaternion.setFromAxisAngle(yAxis, headingRef.current)
    }

    const offset = new THREE.Vector3(0, 4, 6)
    offset.applyQuaternion(character.quaternion)
    camera.position.copy(character.position).add(offset)
    camera.lookAt(character.position.x, character.position.y + 1.5, character.position.z)
    onCharacterMove(character.position.clone(), headingRef.current)
  })

  return (
    <>
      <color attach="background" args={['#0a0a1a']} />
      <fog attach="fog" args={['#0a0a1a', 20, 80]} />
      <GalleryLighting />
      <Starfield />
      <GalleryShell />
      <PortfolioWallText />
      {projects.map((project, index) => (
        <ProjectFrame key={project.link} project={project} index={index} />
      ))}
      <AstronautCharacter ref={characterRef} />
    </>
  )
}
