'use client'

import { Suspense } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

function HoloFallback({ width, height, z, color }: { width: number; height: number; z: number; color: number }) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  )
}

function ScreenshotPlane({
  imageUrl,
  width,
  height,
  z,
}: {
  imageUrl: string
  width: number
  height: number
  z: number
}) {
  const texture = useTexture(imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

export function FrameScreenshot({
  imageUrl,
  width,
  height,
  z,
  fallbackColor,
}: {
  imageUrl: string | null
  width: number
  height: number
  z: number
  fallbackColor: number
}) {
  if (!imageUrl) {
    return <HoloFallback width={width} height={height} z={z} color={fallbackColor} />
  }

  return (
    <Suspense fallback={<HoloFallback width={width} height={height} z={z} color={fallbackColor} />}>
      <ScreenshotPlane imageUrl={imageUrl} width={width} height={height} z={z} />
    </Suspense>
  )
}
