'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { giftWallInscriptionUrl } from '@/lib/assets/storage-cdn'

type Props = {
  viewport: ShowcaseViewport
}

/** Large cyan neon inscription on the back wall — texture from Supabase CDN. */
export function GiftWallInscription({ viewport }: Props) {
  const { galleryLength, galleryHeight, galleryWidth } = SHOWCASE_CONFIG
  const compact = viewport === 'mobile'
  const z = -galleryLength / 2 + 0.18
  const planeW = compact ? galleryWidth * 0.95 : galleryWidth * 0.98
  const planeH = compact ? 3.2 : 4.2
  const y = galleryHeight * 0.82

  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      giftWallInscriptionUrl,
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
      },
      undefined,
      () => {
        if (!cancelled) setTexture(null)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => texture?.dispose()
  }, [texture])

  if (!texture) return null

  return (
    <group position={[0, y, z]}>
      <mesh renderOrder={50}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
      <pointLight position={[0, 0.5, 1.5]} color="#22d3ee" intensity={compact ? 6 : 10} distance={22} decay={1.2} />
      <pointLight position={[0, -0.2, 1]} color="#06b6d4" intensity={compact ? 3 : 5} distance={18} decay={1.5} />
    </group>
  )
}
