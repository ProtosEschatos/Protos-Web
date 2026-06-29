'use client'

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Text, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'

/* ======================================================
   PROTOS WEB — Portfolio Showcase
   3D Space Station Gallery (React Three Fiber)
   WASD/Arrow movement, E to interact, ESC for menu
   ====================================================== */

// --- Types ---
interface ArtworkData {
  id: number
  title: string
  category: string
  description: string
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
}

// --- Data ---
const artworks: ArtworkData[] = [
  { id: 1, title: 'Coating Tools', category: 'Industrial Design', description: '30+ years of experience in industrial solutions', color: '#ff6600', position: [-8, 2, -10], rotation: [0, 0.3, 0] },
  { id: 2, title: 'Mood Water', category: 'E-Commerce Creative', description: 'Take a sip, enjoy the trip - Vibrant brand', color: '#8b5cf6', position: [8, 2, -10], rotation: [0, -0.3, 0] },
  { id: 3, title: 'Estrela Studio', category: 'Digital Studio', description: 'A people first digital studio', color: '#06b6d4', position: [0, 2, -18], rotation: [0, 0, 0] },
  { id: 4, title: 'Project Alpha', category: 'Web Application', description: 'Next-gen SaaS platform for startups', color: '#f59e0b', position: [-12, 3, -25], rotation: [0, 0.5, 0] },
  { id: 5, title: 'Nova Finance', category: 'Fintech', description: 'Modern banking experience reimagined', color: '#22c55e', position: [12, 3, -25], rotation: [0, -0.5, 0] },
  { id: 6, title: 'Zenith Health', category: 'Healthcare', description: 'Patient-first digital health platform', color: '#ef4444', position: [0, 3, -35], rotation: [0, 0, 0] },
]

// --- Space Station Structure ---
function SpaceStation() {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      {/* Floor grid */}
      <gridHelper args={[100, 100, '#1a1a3a', '#0d0d2a']} position={[0, -1, 0]} />

      {/* Corridor walls — left */}
      <mesh position={[-15, 4, -20]}>
        <boxGeometry args={[0.3, 10, 60]} />
        <meshStandardMaterial color="#0a0a2a" transparent opacity={0.4} />
      </mesh>
      {/* Corridor walls — right */}
      <mesh position={[15, 4, -20]}>
        <boxGeometry args={[0.3, 10, 60]} />
        <meshStandardMaterial color="#0a0a2a" transparent opacity={0.4} />
      </mesh>

      {/* Glowing floor strips */}
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <mesh key={i} position={[x, -0.95, -20]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 60]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Ceiling light strips */}
      {[-8, 0, 8].map((x, i) => (
        <group key={`light-${i}`}>
          <mesh position={[x, 8.5, -20]}>
            <boxGeometry args={[0.1, 0.1, 50]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
          </mesh>
          <pointLight position={[x, 8, -20]} color="#06b6d4" intensity={0.3} distance={30} />
        </group>
      ))}
    </group>
  )
}

// --- Single Artwork Frame ---
function ArtworkFrame({ data, onInteract, isNear }: { data: ArtworkData; onInteract: (d: ArtworkData) => void; isNear: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + data.id) * 0.1
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isNear
        ? 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        : 0.05
    }
  })

  return (
    <group position={data.position} rotation={data.rotation}>
      {/* Glow background */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[5, 3.5]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.05} />
      </mesh>

      {/* Frame */}
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 2.8, 0.1]} />
        <meshStandardMaterial color="#111133" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Inner "screen" */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3.6, 2.4]} />
        <meshStandardMaterial color={data.color} transparent opacity={0.2} emissive={data.color} emissiveIntensity={0.3} />
      </mesh>

      {/* Category label */}
      <Text
        position={[0, -1.8, 0.1]}
        fontSize={0.15}
        color={data.color}
        anchorX="center"
        anchorY="top"
        font="/fonts/Inter-Bold.woff"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+&. "
      >
        {data.category.toUpperCase()}
      </Text>

      {/* Title */}
      <Text
        position={[0, -2.1, 0.1]}
        fontSize={0.25}
        color="#e8e8f0"
        anchorX="center"
        anchorY="top"
        font="/fonts/Inter-Bold.woff"
        characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+&. "
      >
        {data.title}
      </Text>

      {/* Interaction hint */}
      {isNear && (
        <Html position={[0, 2.2, 0]} center>
          <div className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/20 text-white text-xs whitespace-nowrap backdrop-blur-sm">
            Press <span className="text-[#6366f1] font-bold">E</span> to view details
          </div>
        </Html>
      )}

      {/* Spot light on artwork */}
      <spotLight position={[0, 4, 3]} angle={0.4} penumbra={0.5} intensity={0.8} color={data.color} target-position={data.position} />
    </group>
  )
}

// --- Floating Particles ---
function Particles() {
  const count = 500
  const meshRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = Math.random() * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10
      const c = new THREE.Color().setHSL(Math.random() * 0.2 + 0.6, 0.8, 0.6)
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// --- First-Person Camera Controller ---
function CameraController({ keys }: { keys: React.MutableRefObject<Record<string, boolean>> }) {
  const { camera } = useThree()
  const velocity = useRef(new THREE.Vector3())
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const isPointerLocked = useRef(false)

  useEffect(() => {
    camera.position.set(0, 2, 5)

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement !== null
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return
      euler.current.y -= e.movementX * 0.002
      euler.current.x -= e.movementY * 0.002
      euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [camera])

  useFrame((_, delta) => {
    const speed = 8
    const direction = new THREE.Vector3()

    if (keys.current['w'] || keys.current['arrowup']) direction.z -= 1
    if (keys.current['s'] || keys.current['arrowdown']) direction.z += 1
    if (keys.current['a'] || keys.current['arrowleft']) direction.x -= 1
    if (keys.current['d'] || keys.current['arrowright']) direction.x += 1

    direction.normalize()
    direction.applyQuaternion(camera.quaternion)
    direction.y = 0 // stay on ground

    velocity.current.lerp(direction.multiplyScalar(speed), 0.1)
    camera.position.add(velocity.current.clone().multiplyScalar(delta))

    // Clamp position
    camera.position.x = Math.max(-14, Math.min(14, camera.position.x))
    camera.position.z = Math.max(-45, Math.min(10, camera.position.z))
    camera.position.y = 2
  })

  return null
}

// --- Main Component ---
export default function PortfolioShowcase() {
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkData | null>(null)
  const [nearArtwork, setNearArtwork] = useState<number | null>(null)
  const keys = useRef<Record<string, boolean>>({})
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  // Loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setLoaded(true), 500); return 100 }
        return p + Math.random() * 12 + 4
      })
    }, 150)
    return () => clearInterval(interval)
  }, [])

  // Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.key === 'Escape') { setMenuOpen((m) => !m); setSelectedArtwork(null) }
      if (e.key.toLowerCase() === 'e' && nearArtwork !== null) {
        const art = artworks.find((a) => a.id === nearArtwork)
        if (art) setSelectedArtwork(art)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) }
  }, [nearArtwork])

  // Pointer lock
  const requestPointerLock = useCallback(() => {
    canvasContainerRef.current?.requestPointerLock()
  }, [])

  // Check proximity to artworks
  const checkProximity = useCallback((cameraPos: THREE.Vector3) => {
    let closest: number | null = null
    let closestDist = 8
    for (const a of artworks) {
      const dist = cameraPos.distanceTo(new THREE.Vector3(...a.position))
      if (dist < closestDist) { closestDist = dist; closest = a.id }
    }
    setNearArtwork(closest)
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Loader */}
      {!loaded && (
        <div className="absolute inset-0 z-[1000] bg-[#0a0a1a] flex flex-col items-center justify-center transition-opacity duration-800"
          style={{ opacity: progress >= 100 ? 0 : 1 }}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent mb-4">Space Gallery</h1>
          <p className="text-[#94a3b8] text-sm tracking-[0.3em] uppercase mb-8">INITIALIZING EXPERIENCE</p>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#f59e0b] transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="mt-8 text-[#94a3b8] text-sm">
            Tip: Use <span className="text-[#6366f1] font-semibold">WASD</span> or arrow keys to explore
          </p>
        </div>
      )}

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="flex items-center gap-3 text-white no-underline">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#06b6d4] rounded-xl flex items-center justify-center font-bold text-xl">P</div>
          <span className="font-semibold text-lg">Protos Web</span>
        </Link>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-[0.1em] hidden md:block">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">SPACE GALLERY</span>
        </h2>
        <Link href="/portfolio" className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white text-sm hover:bg-[#6366f1] hover:border-[#6366f1] transition-all duration-300">
          <i className="fas fa-arrow-left" /> Back to Portfolio
        </Link>
      </div>

      {/* Controls UI */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 px-6 py-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <span className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-xs font-semibold">W</span>
          </div>
          <div className="flex gap-1">
            <span className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-xs font-semibold">A</span>
            <span className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-xs font-semibold">S</span>
            <span className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-xs font-semibold">D</span>
          </div>
          <span className="text-[0.65rem] text-[#94a3b8] uppercase tracking-wider mt-1">Move</span>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold">E</span>
          <span className="text-[0.65rem] text-[#94a3b8] uppercase tracking-wider mt-1">Interact</span>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold">ESC</span>
          <span className="text-[0.65rem] text-[#94a3b8] uppercase tracking-wider mt-1">Menu</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-[1]" onClick={requestPointerLock}>
        {loaded && (
          <Canvas camera={{ fov: 70, near: 0.1, far: 200 }} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => { gl.setClearColor('#000000') }}>
            <fog attach="fog" args={['#000011', 10, 60]} />
            <ambientLight intensity={0.15} />
            <directionalLight position={[10, 15, 5]} intensity={0.3} color="#6366f1" />

            <Suspense fallback={null}>
              <Stars radius={80} depth={100} count={5000} factor={4} saturation={0.5} fade speed={0.5} />
              <SpaceStation />
              <Particles />
              {artworks.map((a) => (
                <ArtworkFrame
                  key={a.id}
                  data={a}
                  onInteract={setSelectedArtwork}
                  isNear={nearArtwork === a.id}
                />
              ))}
              <ProximityChecker checkProximity={checkProximity} />
              <CameraController keys={keys} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center transition-all duration-500">
          <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-3xl text-white hover:text-[#6366f1] transition-colors cursor-pointer">
            <i className="fas fa-times" />
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent mb-8">Menu</h2>
          <nav className="flex flex-col gap-4 text-center">
            <button onClick={() => setMenuOpen(false)} className="text-2xl text-white hover:bg-[#6366f1] px-8 py-4 rounded-xl transition-all">Resume Exploring</button>
            <Link href="/portfolio" className="text-2xl text-white hover:bg-[#6366f1] px-8 py-4 rounded-xl transition-all">Back to Portfolio</Link>
            <Link href="/" className="text-2xl text-white hover:bg-[#6366f1] px-8 py-4 rounded-xl transition-all">Home</Link>
          </nav>
        </div>
      )}

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setSelectedArtwork(null)}>
          <div className="bg-[#0f0f2a] border border-white/10 rounded-3xl p-10 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold tracking-[0.15em] uppercase mb-2 block" style={{ color: selectedArtwork.color }}>
                  {selectedArtwork.category}
                </span>
                <h3 className="text-2xl font-bold text-white">{selectedArtwork.title}</h3>
              </div>
              <button onClick={() => setSelectedArtwork(null)} className="text-xl text-white/50 hover:text-white transition-colors">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="w-full aspect-video rounded-xl mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${selectedArtwork.color}33, ${selectedArtwork.color}11)` }}>
              <i className="fas fa-image text-4xl" style={{ color: selectedArtwork.color, opacity: 0.4 }} />
            </div>
            <p className="text-[#94a3b8] leading-relaxed mb-6">{selectedArtwork.description}</p>
            <div className="flex gap-3">
              <a href="#" className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-80" style={{ background: `linear-gradient(135deg, ${selectedArtwork.color}, ${selectedArtwork.color}cc)` }}>
                View Project <i className="fas fa-external-link-alt ml-2" />
              </a>
              <button onClick={() => setSelectedArtwork(null)} className="px-6 py-3 rounded-full border border-white/20 text-sm font-semibold text-white hover:border-white/40 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Helper: Proximity checker runs inside Canvas ---
function ProximityChecker({ checkProximity }: { checkProximity: (pos: THREE.Vector3) => void }) {
  const { camera } = useThree()
  useFrame(() => { checkProximity(camera.position) })
  return null
}
