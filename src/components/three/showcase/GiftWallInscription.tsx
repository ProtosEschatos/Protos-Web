'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { SHOWCASE_CONFIG } from './constants'
import type { ShowcaseViewport } from '@/hooks/use-showcase-viewport'
import { GIFT_PORTAL_INSCRIPTION } from '@/lib/showcase/featured-demo'

function buildInscriptionTexture(line1: string, line2: string): THREE.CanvasTexture {
  const width = 2048
  const height = 768
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas)
    fallback.colorSpace = THREE.SRGBColorSpace
    return fallback
  }

  ctx.clearRect(0, 0, width, height)

  const drawNeonLine = (text: string, y: number, fontSize: number) => {
    ctx.font = `300 ${fontSize}px Georgia, "Times New Roman", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur = 64
    ctx.fillStyle = 'rgba(34, 211, 238, 0.55)'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 36
    ctx.fillStyle = '#67e8f9'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 14
    ctx.fillStyle = '#ecfeff'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 0
    ctx.fillStyle = '#f0fdff'
    ctx.fillText(text, width / 2, y)
  }

  drawNeonLine(line1, height * 0.36, 132)
  drawNeonLine(line2, height * 0.68, 112)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

type Props = {
  viewport: ShowcaseViewport
}

/** Large cyan neon inscription on the back wall above the System Boost poklon frame. */
export function GiftWallInscription({ viewport }: Props) {
  const { galleryLength, galleryHeight, galleryWidth } = SHOWCASE_CONFIG
  const compact = viewport === 'mobile'
  const z = -galleryLength / 2 + 0.14
  const planeW = compact ? galleryWidth * 0.88 : galleryWidth * 0.92
  const planeH = compact ? 2.4 : 3.2
  const y = galleryHeight * 0.78

  const texture = useMemo(
    () => buildInscriptionTexture(GIFT_PORTAL_INSCRIPTION.line1, GIFT_PORTAL_INSCRIPTION.line2),
    [],
  )

  return (
    <group position={[0, y, z]}>
      <mesh renderOrder={30}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
      <pointLight position={[0, 0.4, 1.2]} color="#22d3ee" intensity={compact ? 4 : 6} distance={18} decay={1.5} />
      <pointLight position={[0, -0.3, 0.8]} color="#06b6d4" intensity={compact ? 2 : 3} distance={14} decay={2} />
    </group>
  )
}
