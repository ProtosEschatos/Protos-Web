'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, KeyboardControls, useKeyboardControls, Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

const CONFIG = {
  moveSpeed: 0.35,
  turnSpeed: 0.05,
  galleryLength: 28,
  galleryWidth: 12,
  galleryHeight: 10,
}

type ShowcaseProject = {
  title: string
  description: string
  color: number
  link: string
}

const PROJECT_META = [
  { color: 0xff6600, link: 'https://bodulica.shop' },
  { color: 0x06b6d4, link: 'https://zeustrading.online' },
  { color: 0x8b5cf6, link: 'https://cosmic-blueprint.net' },
  { color: 0xf59e0b, link: 'https://protosweb.eu' },
] as const

const SUIT = 0xf4f6f8
const SUIT_SHADOW = 0xd8dde6
const ACCENT = 0xff6600
const GLOVE = 0xff8800

function ProjectFrame({
  project,
  index,
  onProximity,
  isActive,
}: {
  project: ShowcaseProject
  index: number
  onProximity: (dist: number) => void
  isActive: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const holoRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const { camera } = useThree()

  const fw = 2.6
  const fh = 3.4
  const fd = 0.18
  const bw = 0.14
  const ec = project.color

  const side = index % 2 === 0 ? 1 : -1
  const row = Math.floor(index / 2)
  const zPos = -CONFIG.galleryLength / 2 + 5 + row * 9
  const xPos = side * (CONFIG.galleryWidth / 2 - 0.55)

  useFrame((state) => {
    if (groupRef.current) {
      onProximity(camera.position.distanceTo(groupRef.current.position))
    }
    const t = state.clock.elapsedTime
    if (holoRef.current) {
      const mat = holoRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (isActive ? 0.35 : 0.18) + Math.sin(t * 2.5 + index) * 0.06
    }
    if (glowRef.current) {
      glowRef.current.intensity = isActive ? 1.4 + Math.sin(t * 3) * 0.2 : 0.6
    }
  })

  return (
    <group ref={groupRef} position={[xPos, 2.2, zPos]} rotation={[0, side === 1 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      <pointLight ref={glowRef} position={[0, 0, 1.2]} color={ec} intensity={0.6} distance={5} />

      {/* Outer glow */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[fw + 1.2, fh + 1.2]} />
        <meshBasicMaterial color={ec} transparent opacity={isActive ? 0.12 : 0.05} />
      </mesh>

      {/* Frame body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[fw + bw * 2, fh + bw * 2, fd]} />
        <meshStandardMaterial color={0x1e293b} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Accent edges */}
      {[-1, 1].map((sign) => (
        <mesh key={sign} position={[sign * (fw / 2 + bw * 0.5), 0, fd / 2 + 0.01]}>
          <boxGeometry args={[0.04, fh + bw * 2, 0.02]} />
          <meshBasicMaterial color={ec} transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh position={[0, fh / 2 + bw, fd / 2 + 0.01]}>
        <planeGeometry args={[fw + bw * 2, 0.06]} />
        <meshBasicMaterial color={ec} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -fh / 2 - bw, fd / 2 + 0.01]}>
        <planeGeometry args={[fw + bw * 2, 0.06]} />
        <meshBasicMaterial color={ec} transparent opacity={0.85} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, fd / 2 + 0.01]}>
        <planeGeometry args={[fw, fh]} />
        <meshStandardMaterial color={0x050816} roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Hologram */}
      <mesh ref={holoRef} position={[0, 0, fd / 2 + 0.025]}>
        <planeGeometry args={[fw * 0.82, fh * 0.78]} />
        <meshBasicMaterial color={ec} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Scan lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, -fh * 0.35 + i * (fh * 0.14), fd / 2 + 0.03]}>
          <planeGeometry args={[fw * 0.75, 0.008]} />
          <meshBasicMaterial color={ec} transparent opacity={0.08} />
        </mesh>
      ))}

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.08}>
        <Text
          position={[0, -fh / 2 - 0.55, fd / 2 + 0.05]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
        >
          {project.title.toUpperCase()}
        </Text>
      </Float>
    </group>
  )
}

function CorridorLights() {
  const strips = useMemo(() => {
    const items: { z: number; color: number }[] = []
    for (let z = -CONFIG.galleryLength / 2 + 2; z <= CONFIG.galleryLength / 2 - 2; z += 4) {
      items.push({ z, color: z % 8 === 0 ? 0xff6600 : 0x06b6d4 })
    }
    return items
  }, [])

  return (
    <>
      {strips.map(({ z, color }, i) => (
        <group key={i} position={[0, CONFIG.galleryHeight - 0.15, z]}>
          <mesh>
            <boxGeometry args={[CONFIG.galleryWidth - 1, 0.08, 0.12]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
          <pointLight position={[0, -1, 0]} color={color} intensity={0.45} distance={12} />
        </group>
      ))}
    </>
  )
}

function GalleryRoom() {
  const halfL = CONFIG.galleryLength / 2
  const halfW = CONFIG.galleryWidth / 2
  const h = CONFIG.galleryHeight

  return (
    <group>
      {/* Floor — reflective metal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[CONFIG.galleryWidth, CONFIG.galleryLength]} />
        <meshStandardMaterial color={0x0b1220} roughness={0.12} metalness={0.92} envMapIntensity={0.8} />
      </mesh>

      {/* Floor center runway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.2, CONFIG.galleryLength - 2]} />
        <meshStandardMaterial color={0x111827} roughness={0.08} metalness={0.95} emissive={0x0a1628} emissiveIntensity={0.15} />
      </mesh>

      {/* Floor glow strips */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.04, CONFIG.galleryLength - 4]} />
          <meshBasicMaterial color={0x6366f1} transparent opacity={0.35} />
        </mesh>
      ))}

      <gridHelper args={[CONFIG.galleryLength, 28, 0x1e3a5f, 0x0f172a]} position={[0, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} />

      {/* Ceiling */}
      <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CONFIG.galleryWidth, CONFIG.galleryLength]} />
        <meshStandardMaterial color={0x030712} roughness={0.95} metalness={0.05} />
      </mesh>

      <CorridorLights />

      {/* Walls with paneling */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * halfW, h / 2, 0]} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh receiveShadow>
            <planeGeometry args={[CONFIG.galleryLength, h]} />
            <meshStandardMaterial color={0x111827} roughness={0.65} metalness={0.35} />
          </mesh>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0, (i - 3) * 1.35, 0.02]}>
              <planeGeometry args={[CONFIG.galleryLength - 1, 1.1]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? 0x1e293b : 0x172033}
                roughness={0.5}
                metalness={0.4}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
          {/* Vertical trim */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.06, h]} />
            <meshBasicMaterial color={0x06b6d4} transparent opacity={0.25} />
          </mesh>
        </group>
      ))}

      {/* Structural beams */}
      {[-halfW + 0.3, halfW - 0.3].map((x) => (
        <mesh key={x} position={[x, h / 2, 0]} castShadow>
          <boxGeometry args={[0.2, h, CONFIG.galleryLength]} />
          <meshStandardMaterial color={0x334155} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* End viewport — stars visible through glass */}
      <group position={[0, h / 2, -halfL]}>
        <mesh>
          <boxGeometry args={[CONFIG.galleryWidth - 2, h - 1, 0.3]} />
          <meshStandardMaterial color={0x1e293b} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[CONFIG.galleryWidth - 3.5, h - 2.5]} />
          <meshPhysicalMaterial
            color={0x0a1628}
            metalness={0.1}
            roughness={0.05}
            transmission={0.6}
            thickness={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, 0, 0.17]}>
          <planeGeometry args={[CONFIG.galleryWidth - 3.8, h - 2.8]} />
          <meshBasicMaterial color={0x06b6d4} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Entry arch glow */}
      <mesh position={[0, h * 0.55, halfL - 0.2]}>
        <torusGeometry args={[3.2, 0.06, 8, 32, Math.PI]} />
        <meshBasicMaterial color={0xff6600} transparent opacity={0.5} />
      </mesh>
      <pointLight position={[0, h * 0.6, halfL - 1]} color={0xff6600} intensity={0.8} distance={10} />
    </group>
  )
}

function AmbientDust() {
  const ref = useRef<THREE.Points>(null)
  const count = 300

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * CONFIG.galleryWidth
      arr[i * 3 + 1] = Math.random() * CONFIG.galleryHeight
      arr[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.galleryLength
    }
    return arr
  }, [])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={0x88ccff} transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

function PlayerCharacter() {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [, getKeys] = useKeyboardControls()

  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])
  const walkPhase = useRef(0)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, CONFIG.galleryLength / 2 - 3)
      groupRef.current.rotation.y = Math.PI
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const keys = getKeys()
    let moving = false

    if (keys.left) {
      groupRef.current.rotation.y += CONFIG.turnSpeed * delta * 60
      moving = true
    }
    if (keys.right) {
      groupRef.current.rotation.y -= CONFIG.turnSpeed * delta * 60
      moving = true
    }

    groupRef.current.quaternion.setFromAxisAngle(yAxis, groupRef.current.rotation.y)

    if (keys.forward) {
      moveDir.set(0, 0, -(CONFIG.moveSpeed * delta * 60))
      moveDir.applyQuaternion(groupRef.current.quaternion)
      groupRef.current.position.add(moveDir)
      moving = true
    }
    if (keys.backward) {
      moveDir.set(0, 0, CONFIG.moveSpeed * delta * 60)
      moveDir.applyQuaternion(groupRef.current.quaternion)
      groupRef.current.position.add(moveDir)
      moving = true
    }

    const margin = 1.5
    groupRef.current.position.x = Math.max(-CONFIG.galleryWidth / 2 + margin, Math.min(CONFIG.galleryWidth / 2 - margin, groupRef.current.position.x))
    groupRef.current.position.z = Math.max(-CONFIG.galleryLength / 2 + margin, Math.min(CONFIG.galleryLength / 2 - margin, groupRef.current.position.z))

    const offset = new THREE.Vector3(0, 3.8, 5.5)
    offset.applyQuaternion(groupRef.current.quaternion)
    camera.position.lerp(groupRef.current.position.clone().add(offset), 0.08)
    camera.lookAt(groupRef.current.position.x, groupRef.current.position.y + 1.6, groupRef.current.position.z)

    if (moving) {
      walkPhase.current += 0.18 * delta * 60
      const bob = Math.abs(Math.sin(walkPhase.current)) * 0.12
      groupRef.current.position.y = bob
      const swing = Math.sin(walkPhase.current) * 0.55
      const legSwing = Math.sin(walkPhase.current) * 0.35
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing
      if (leftLegRef.current) leftLegRef.current.rotation.x = -legSwing
      if (rightLegRef.current) rightLegRef.current.rotation.x = legSwing
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.12)
      ;[leftArmRef, rightArmRef, leftLegRef, rightLegRef].forEach((ref) => {
        if (ref.current) ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, 0.12)
      })
    }
  })

  const suitMat = useMemo(() => new THREE.MeshStandardMaterial({ color: SUIT, roughness: 0.35, metalness: 0.15 }), [])
  const suitDark = useMemo(() => new THREE.MeshStandardMaterial({ color: SUIT_SHADOW, roughness: 0.4, metalness: 0.1 }), [])
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.3, metalness: 0.2, emissive: ACCENT, emissiveIntensity: 0.15 }), [])
  const gloveMat = useMemo(() => new THREE.MeshStandardMaterial({ color: GLOVE, roughness: 0.45, metalness: 0.05 }), [])

  return (
    <group ref={groupRef}>
      {/* Shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color={0x000000} transparent opacity={0.35} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.05, 0]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.38, 0.75, 8, 16]} />
      </mesh>

      {/* Chest accent */}
      <mesh position={[0, 1.15, -0.32]} castShadow material={accentMat}>
        <boxGeometry args={[0.35, 0.5, 0.06]} />
      </mesh>

      {/* Shoulders */}
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * 0.42, 1.35, 0]} castShadow material={suitDark}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>
      ))}

      {/* Helmet */}
      <mesh position={[0, 1.88, 0]} castShadow>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color={0xffffff} roughness={0.15} metalness={0.55} />
      </mesh>
      <mesh position={[0, 1.88, 0]}>
        <torusGeometry args={[0.36, 0.04, 12, 32]} />
        <meshStandardMaterial color={0xcbd5e1} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.88, -0.2]} castShadow>
        <sphereGeometry args={[0.27, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color={0x0ea5e9}
          roughness={0.05}
          metalness={0.9}
          transmission={0.4}
          thickness={0.3}
          emissive={0x0369a1}
          emissiveIntensity={0.25}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 1.05, 0.34]} castShadow>
        <boxGeometry args={[0.52, 0.75, 0.28]} />
        <meshStandardMaterial color={0xc4c9d4} roughness={0.35} metalness={0.35} />
      </mesh>
      <mesh position={[0, 1.05, 0.48]} material={accentMat}>
        <boxGeometry args={[0.2, 0.35, 0.06]} />
      </mesh>

      {/* Arms */}
      {(
        [
          { ref: leftArmRef, x: -0.48, zRot: 0.15 },
          { ref: rightArmRef, x: 0.48, zRot: -0.15 },
        ] as const
      ).map(({ ref, x, zRot }, i) => (
        <group key={i} ref={ref} position={[x, 1.2, 0]} rotation={[0, 0, zRot]}>
          <mesh position={[0, -0.22, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.48, 0]} castShadow material={gloveMat}>
            <sphereGeometry args={[0.11, 12, 12]} />
          </mesh>
        </group>
      ))}

      {/* Legs */}
      {(
        [
          { ref: leftLegRef, x: -0.17 },
          { ref: rightLegRef, x: 0.17 },
        ] as const
      ).map(({ ref, x }, i) => (
        <group key={i} ref={ref} position={[x, 0.55, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow material={suitMat}>
            <capsuleGeometry args={[0.11, 0.35, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.42, 0.04]} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.28]} />
            <meshStandardMaterial color={0x374151} roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.48, 0.1]}>
            <boxGeometry args={[0.18, 0.06, 0.12]} />
            <meshStandardMaterial color={ACCENT} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Helmet light */}
      <pointLight position={[0, 2.1, -0.3]} color={0x7dd3fc} intensity={0.35} distance={3} />
    </group>
  )
}

function Scene({
  projects,
  setNearestProject,
  activeIndex,
}: {
  projects: ShowcaseProject[]
  setNearestProject: (p: ShowcaseProject | null) => void
  activeIndex: number | null
}) {
  const distances = useRef<number[]>([])

  const handleProximity = (index: number, dist: number) => {
    distances.current[index] = dist

    let closestIdx = -1
    let minDist = Infinity
    distances.current.forEach((d, i) => {
      if (d < minDist) {
        minDist = d
        closestIdx = i
      }
    })

    if (minDist < 4.5 && closestIdx !== -1) {
      setNearestProject(projects[closestIdx])
    } else {
      setNearestProject(null)
    }
  }

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 14, 45]} />
      <hemisphereLight args={['#6366f1', '#0f172a', 0.35]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <GalleryRoom />
      <AmbientDust />
      <Stars radius={80} depth={60} count={4000} factor={5} saturation={0.35} fade speed={0.6} />
      {projects.map((p, i) => (
        <ProjectFrame
          key={i}
          project={p}
          index={i}
          isActive={activeIndex === i}
          onProximity={(d) => handleProximity(i, d)}
        />
      ))}
      <PlayerCharacter />
    </>
  )
}

export function SpaceGallery() {
  const t = useTranslations('showcase')
  const tNav = useTranslations('nav')

  const projects = useMemo<ShowcaseProject[]>(
    () =>
      PROJECT_META.map((meta, index) => ({
        ...meta,
        title: t(`project${index + 1}_title`),
        description: t(`project${index + 1}_desc`),
      })),
    [t],
  )

  const [isLoaded, setIsLoaded] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [nearestProject, setNearestProject] = useState<ShowcaseProject | null>(null)

  const activeIndex = nearestProject ? projects.findIndex((p) => p.title === nearestProject.title) : null

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'interact', keys: ['KeyE'] },
    { name: 'menu', keys: ['Escape'] },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setShowMenu((p) => !p)
      if (e.code === 'KeyE' && nearestProject) {
        window.open(nearestProject.link, '_blank', 'noopener,noreferrer')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [nearestProject])

  return (
    <KeyboardControls map={keyboardMap}>
      <div className="fixed inset-0 z-[1] bg-[#020617]">
        <Canvas
          shadows
          camera={{ position: [0, 4, 15], fov: 58 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        >
          {isLoaded && !showInstructions && (
            <Scene projects={projects} setNearestProject={setNearestProject} activeIndex={activeIndex} />
          )}
        </Canvas>
      </div>

      <div className="fixed top-1/2 left-1/2 z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2">
        <div className="absolute top-1/2 left-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        <div className="absolute top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
      </div>

      <div
        className={`fixed top-1/2 left-1/2 z-20 mt-32 max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-dark-card/90 p-6 text-center backdrop-blur-md transition-all duration-300 ${
          nearestProject ? 'scale-100 border-primary/50 opacity-100 shadow-[0_0_30px_rgba(255,102,0,0.15)]' : 'pointer-events-none scale-95 border-primary/20 opacity-0'
        }`}
      >
        <h3 className="mb-2 text-xl font-bold text-white">{nearestProject?.title}</h3>
        <p className="mb-4 text-sm text-light-muted">{nearestProject?.description}</p>
        <a
          href={nearestProject?.link || '#'}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {t('viewProject')}
        </a>
      </div>

      <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-8 rounded-full border border-white/10 bg-dark-card/80 px-8 py-4 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {['W', 'A', 'S', 'D'].map((key) => (
              <div key={key} className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-xs font-bold text-white">
                {key}
              </div>
            ))}
          </div>
          <span className="text-xs uppercase tracking-wider text-light-muted">{t('move')}</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <button
          type="button"
          className="flex flex-col items-center gap-2"
          onClick={() => nearestProject && window.open(nearestProject.link, '_blank', 'noopener,noreferrer')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded border border-primary/50 bg-primary/20 text-xs font-bold text-primary">
            E
          </div>
          <span className="text-xs uppercase tracking-wider text-light-muted">{t('details')}</span>
        </button>
        <div className="h-8 w-px bg-white/10" />
        <button type="button" className="flex flex-col items-center gap-2" onClick={() => setShowMenu((p) => !p)}>
          <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 text-xs font-bold text-white">ESC</div>
          <span className="text-xs uppercase tracking-wider text-light-muted">{t('menuLabel')}</span>
        </button>
      </div>

      {!isLoaded && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark">
          <div className="mb-4 text-3xl font-bold text-white">{t('loaderTitle')}</div>
          <div className="animate-pulse text-primary">{t('loaderSubtitle')}</div>
        </div>
      )}

      {isLoaded && showInstructions && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg rounded-3xl border border-primary/20 bg-dark-card p-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">{t('instructionsTitle')}</h1>
            <p className="mb-8 text-light-muted">{t('instructionsSubtitle')}</p>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="rounded-full bg-primary px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-primary/90"
            >
              {t('start')}
            </button>
          </div>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-bold">
            P
          </div>
          <span className="font-semibold">Protos Web</span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 text-2xl font-bold tracking-widest md:block">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('space')}</span>{' '}
          <span className="text-white">{t('station')}</span>
        </div>
        <Link
          href="/portfolio"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white transition-all hover:border-primary hover:bg-primary"
        >
          {t('back')}
        </Link>
      </header>

      {showMenu && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className="absolute right-8 top-8 text-white hover:text-primary"
            aria-label={t('menuLabel')}
          >
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="mb-12 text-4xl font-bold text-white">{t('menuLabel')}</h2>
          <nav className="flex flex-col gap-6 text-center text-2xl">
            <Link href="/" className="text-light-muted transition-colors hover:text-primary">
              {tNav('home')}
            </Link>
            <Link href="/usluge" className="text-light-muted transition-colors hover:text-primary">
              {tNav('services')}
            </Link>
            <Link href="/portfolio" className="text-light-muted transition-colors hover:text-primary">
              {tNav('portfolio')}
            </Link>
            <Link href="/kontakt" className="text-light-muted transition-colors hover:text-primary">
              {tNav('contact')}
            </Link>
          </nav>
        </div>
      )}
    </KeyboardControls>
  )
}
