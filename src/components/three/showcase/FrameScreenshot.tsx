'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'

function HoloFallback({ width, height, z, color }: { width: number; height: number; z: number; color: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh renderOrder={12}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0x0f172a} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, height * 0.38, 0.002]} renderOrder={13}>
        <planeGeometry args={[width * 0.22, width * 0.22]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, height * 0.18, 0.002]} renderOrder={13}>
        <planeGeometry args={[width * 0.88, height * 0.08]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -height * 0.08, 0.002]} renderOrder={13}>
        <planeGeometry args={[width * 0.82, height * 0.55]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function ScreenshotPlane({
  texture,
  width,
  height,
  z,
}: {
  texture: THREE.Texture
  width: number
  height: number
  z: number
}) {
  return (
    <mesh position={[0, 0, z]} renderOrder={12}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function useSafeTexture(imageUrl: string | null) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [failed, setFailed] = useState(!imageUrl)

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null)
      setFailed(true)
      return
    }

    let cancelled = false
    setFailed(false)
    setTexture(null)

    const loader = new THREE.TextureLoader()
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      loader.setCrossOrigin('anonymous')
    }

    loader.load(
      imageUrl,
      (loaded) => {
        if (cancelled) {
          loaded.dispose()
          return
        }
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.minFilter = THREE.LinearFilter
        loaded.magFilter = THREE.LinearFilter
        loaded.needsUpdate = true
        setTexture(loaded)
        setFailed(false)
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true)
      },
    )

    return () => {
      cancelled = true
    }
  }, [imageUrl])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  return { texture, failed, loading: !!imageUrl && !texture && !failed }
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
  const { texture, failed, loading } = useSafeTexture(imageUrl)

  if (!imageUrl || failed) {
    return <HoloFallback width={width} height={height} z={z} color={fallbackColor} />
  }

  if (loading || !texture) {
    return <HoloFallback width={width} height={height} z={z} color={fallbackColor} />
  }

  return <ScreenshotPlane texture={texture} width={width} height={height} z={z} />
}
