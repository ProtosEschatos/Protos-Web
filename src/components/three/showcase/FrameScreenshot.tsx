'use client'

import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { enqueueShowcaseTextureLoad, textureFromImage } from '@/lib/showcase/showcase-utils'

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
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

function loadTextureFromUrl(imageUrl: string): Promise<THREE.Texture> {
  return enqueueShowcaseTextureLoad(
    () =>
      new Promise<THREE.Texture>((resolve, reject) => {
        const loader = new THREE.TextureLoader()
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          loader.setCrossOrigin('anonymous')
        }
        loader.load(
          imageUrl,
          (loaded) => {
            const image = loaded.image as HTMLImageElement
            loaded.dispose()
            resolve(textureFromImage(image))
          },
          undefined,
          reject,
        )
      }),
  )
}

function useSafeTexture(imageSources: string[]) {
  const sources = useMemo(
    () => [...new Set(imageSources.filter(Boolean))],
    [imageSources],
  )
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [failed, setFailed] = useState(sources.length === 0)
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    if (sources.length === 0) {
      setTexture(null)
      setFailed(true)
      setSourceIndex(0)
      return
    }

    let cancelled = false
    setFailed(false)
    setTexture(null)
    setSourceIndex(0)

    const tryLoad = async (index: number) => {
      if (cancelled || index >= sources.length) {
        if (!cancelled) setFailed(true)
        return
      }

      try {
        const loaded = await loadTextureFromUrl(sources[index]!)
        if (cancelled) {
          loaded.dispose()
          return
        }
        setTexture(loaded)
        setSourceIndex(index)
        setFailed(false)
      } catch {
        if (!cancelled) await tryLoad(index + 1)
      }
    }

    void tryLoad(0)

    return () => {
      cancelled = true
    }
  }, [sources])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  const loading = sources.length > 0 && !texture && !failed
  return { texture, failed, loading, sourceIndex }
}

export function FrameScreenshot({
  imageUrl,
  imageSources,
  width,
  height,
  z,
  fallbackColor,
}: {
  imageUrl: string | null
  imageSources?: string[]
  width: number
  height: number
  z: number
  fallbackColor: number
}) {
  const sources = imageSources?.length ? imageSources : imageUrl ? [imageUrl] : []
  const { texture, failed, loading } = useSafeTexture(sources)

  if (sources.length === 0 || failed) {
    return <HoloFallback width={width} height={height} z={z} color={fallbackColor} />
  }

  if (loading || !texture) {
    return <HoloFallback width={width} height={height} z={z} color={fallbackColor} />
  }

  return <ScreenshotPlane texture={texture} width={width} height={height} z={z} />
}
