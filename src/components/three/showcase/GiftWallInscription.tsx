'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import { getFrameDimensions } from './frameDimensions'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { giftWallInscriptionUrl } from '@/lib/assets/storage-cdn'

type Props = {
  viewport: ShowcaseViewport
}

/** Cyan neon inscription just above the System Boost poklon frame on the back wall. */
export function GiftWallInscription({ viewport }: Props) {
  const { galleryLength } = SHOWCASE_CONFIG
  const { viewW, viewH, frameW, centerY } = getFrameDimensions(viewport)
  const outerW = viewW + frameW * 2
  const outerH = viewH + frameW * 2

  const portalZ = -galleryLength / 2 + 0.35
  const z = portalZ + 0.05
  const planeW = outerW * 1.08
  const planeH = viewport === 'mobile' ? 1.55 : 1.85
  const portalTop = centerY + outerH / 2
  const y = portalTop + 0.12 + planeH / 2

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
      <pointLight position={[0, 0.2, 0.6]} color="#22d3ee" intensity={8} distance={12} decay={1.2} />
    </group>
  )
}
