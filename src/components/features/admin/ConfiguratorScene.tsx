'use client'

import { Component, ReactNode, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { useSceneStore } from '@/lib/stores/scene-store'

function Primitive() {
  const {
    primitive,
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
    wireframe,
    gltfUrl,
  } = useSceneStore()

  if ((primitive === 'gltf-url' || primitive === 'sketchfab' || primitive === 'poly-pizza') && gltfUrl) {
    return (
      <SceneErrorBoundary fallback={<FallbackPrimitive color={color} />}>
        <Suspense fallback={<FallbackPrimitive color={color} />}>
          <LoadedGltf url={gltfUrl} />
        </Suspense>
      </SceneErrorBoundary>
    )
  }

  const material = (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      wireframe={wireframe}
    />
  )

  if (primitive === 'box') {
    return (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        {material}
      </mesh>
    )
  }
  if (primitive === 'torus') {
    return (
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.9, 0.35, 32, 128]} />
        {material}
      </mesh>
    )
  }
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      {material}
    </mesh>
  )
}

function FallbackPrimitive({ color }: { color: string }) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  )
}

function LoadedGltf({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} dispose={null} />
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: unknown) {
    if (typeof console !== 'undefined') {
      console.warn('[ConfiguratorScene] GLTF/model load failed', error)
    }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function ConfiguratorScene() {
  const {
    environment,
    environmentIntensity,
    ambientIntensity,
    directionalIntensity,
    autoRotate,
    background,
  } = useSceneStore()

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3, 2, 4], fov: 45 }}
      gl={{ antialias: true }}
      style={{ background, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        castShadow
        position={[3, 5, 2]}
        intensity={directionalIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Primitive renders unconditionally — never blocked by HDRI load */}
      <Suspense fallback={null}>
        <Primitive />
      </Suspense>

      {/* Environment in its own Suspense — if HDRI CDN fails, scene stays visible */}
      <SceneErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Environment preset={environment} environmentIntensity={environmentIntensity} />
        </Suspense>
      </SceneErrorBoundary>

      <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={8} blur={2} />
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        maxDistance={12}
        minDistance={2}
      />
    </Canvas>
  )
}
