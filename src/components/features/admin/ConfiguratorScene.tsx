'use client'

import { Suspense } from 'react'
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

  if ((primitive === 'gltf-url' || primitive === 'sketchfab') && gltfUrl) {
    return <LoadedGltf url={gltfUrl} />
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

function LoadedGltf({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} dispose={null} />
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
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      style={{ background }}
    >
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        castShadow
        position={[3, 5, 2]}
        intensity={directionalIntensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <Primitive />
        <Environment preset={environment} environmentIntensity={environmentIntensity} />
      </Suspense>
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
