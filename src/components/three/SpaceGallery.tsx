'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, KeyboardControls, useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

const CONFIG = {
  moveSpeed: 0.35,
  turnSpeed: 0.05,
  galleryLength: 24,
  galleryWidth: 12,
  galleryHeight: 10,
  characterHeight: 2,
}

type ShowcaseProject = {
  title: string
  description: string
  color: number
  link: string
}

const PROJECT_META = [
  { color: 0x6366f1, link: 'https://bodulica.shop' },
  { color: 0x06b6d4, link: 'https://zeustrading.online' },
  { color: 0xf59e0b, link: 'https://cosmic-blueprint.net' },
  { color: 0x818cf8, link: 'https://protosweb.eu' },
] as const

function ProjectFrame({
  project,
  index,
  onProximity,
}: {
  project: ShowcaseProject
  index: number
  onProximity: (dist: number) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const fw = 2.5
  const fh = 3.2
  const fd = 0.15
  const bw = 0.12
  const ec = project.color

  const side = index % 2 === 0 ? 1 : -1
  const row = Math.floor(index / 2)
  const zPos = -CONFIG.galleryLength / 2 + 4 + row * CONFIG.galleryHeight
  const xPos = side * (CONFIG.galleryWidth / 2 - 0.5)

  useFrame(() => {
    if (groupRef.current) {
      onProximity(camera.position.distanceTo(groupRef.current.position))
    }
  })

  return (
    <group ref={groupRef} position={[xPos, 2, zPos]} rotation={[0, side === 1 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[fw + bw * 2, fh + bw * 2, fd]} />
        <meshStandardMaterial color={0x334155} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, fh / 2 + bw, fd / 2 + 0.01]}>
        <planeGeometry args={[fw + bw * 2, 0.05]} />
        <meshBasicMaterial color={ec} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -fh / 2 - bw, fd / 2 + 0.01]}>
        <planeGeometry args={[fw + bw * 2, 0.05]} />
        <meshBasicMaterial color={ec} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, fd / 2 + 0.01]}>
        <planeGeometry args={[fw, fh]} />
        <meshStandardMaterial color={0x0f172a} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, fd / 2 + 0.02]}>
        <planeGeometry args={[fw * 0.8, fh * 0.75]} />
        <meshBasicMaterial color={ec} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

function GalleryRoom() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[CONFIG.galleryWidth, CONFIG.galleryLength]} />
        <meshStandardMaterial color={0x0f172a} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, CONFIG.galleryHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CONFIG.galleryWidth, CONFIG.galleryLength]} />
        <meshStandardMaterial color={0x020617} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[-CONFIG.galleryWidth / 2, CONFIG.galleryHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CONFIG.galleryLength, CONFIG.galleryHeight]} />
        <meshStandardMaterial color={0x1e293b} roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[CONFIG.galleryWidth / 2, CONFIG.galleryHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CONFIG.galleryLength, CONFIG.galleryHeight]} />
        <meshStandardMaterial color={0x1e293b} roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}

function PlayerCharacter() {
  const groupRef = useRef<THREE.Group>(null)
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
    groupRef.current.position.x = Math.max(
      -CONFIG.galleryWidth / 2 + margin,
      Math.min(CONFIG.galleryWidth / 2 - margin, groupRef.current.position.x),
    )
    groupRef.current.position.z = Math.max(
      -CONFIG.galleryLength / 2 + margin,
      Math.min(CONFIG.galleryLength / 2 - margin, groupRef.current.position.z),
    )

    const offset = new THREE.Vector3(0, 4, 6)
    offset.applyQuaternion(groupRef.current.quaternion)
    camera.position.copy(groupRef.current.position).add(offset)
    camera.lookAt(
      groupRef.current.position.x,
      groupRef.current.position.y + 1.5,
      groupRef.current.position.z,
    )

    if (moving) {
      walkPhase.current += 0.15 * delta * 60
      groupRef.current.position.y = Math.abs(Math.sin(walkPhase.current)) * 0.2
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
        <meshStandardMaterial color={0xffffff} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={0xffffff} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.8, -0.25]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={0x111111} roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={0xdddddd} roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}

function Scene({
  projects,
  setNearestProject,
}: {
  projects: ShowcaseProject[]
  setNearestProject: (p: ShowcaseProject | null) => void
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

    if (minDist < 4 && closestIdx !== -1) {
      setNearestProject(projects[closestIdx])
    } else {
      setNearestProject(null)
    }
  }

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 10, 5]} intensity={0.9} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.5} distance={20} />
      <GalleryRoom />
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      {projects.map((p, i) => (
        <ProjectFrame key={i} project={p} index={i} onProximity={(d) => handleProximity(i, d)} />
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
      <div className="fixed inset-0 z-[1] bg-black">
        <Canvas shadows camera={{ position: [0, 4, 15], fov: 60 }}>
          {isLoaded && !showInstructions && (
            <Scene projects={projects} setNearestProject={setNearestProject} />
          )}
        </Canvas>
      </div>

      <div className="fixed top-1/2 left-1/2 z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2">
        <div className="absolute top-1/2 left-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/50" />
        <div className="absolute top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 bg-white/50" />
      </div>

      <div
        className={`fixed top-1/2 left-1/2 z-20 mt-32 max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/30 bg-dark-card/90 p-6 text-center backdrop-blur-md transition-all duration-300 ${
          nearestProject ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
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
