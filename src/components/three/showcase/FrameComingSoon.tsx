'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

function hexToCss(hex: number) {
  return `#${hex.toString(16).padStart(6, '0')}`
}

function createScreenTexture(label: string, accentHex: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const accent = hexToCss(accentHex)

  ctx.fillStyle = '#020617'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = `${accent}33`
  ctx.lineWidth = 1
  const grid = 48
  for (let x = 0; x < canvas.width; x += grid) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y < canvas.height; y += grid) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  ctx.strokeStyle = accent
  ctx.lineWidth = 4
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)

  const glow = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    40,
    canvas.width / 2,
    canvas.height / 2,
    320,
  )
  glow.addColorStop(0, `${accent}44`)
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '700 72px system-ui, -apple-system, Segoe UI, sans-serif'
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 - 8)

  ctx.fillStyle = accent
  ctx.font = '600 28px system-ui, -apple-system, Segoe UI, sans-serif'
  ctx.fillText('PROTOS WEB', canvas.width / 2, canvas.height / 2 + 56)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

export function FrameComingSoon({
  label,
  width,
  height,
  z,
  accentColor,
}: {
  label: string
  width: number
  height: number
  z: number
  accentColor: number
}) {
  const texture = useMemo(() => createScreenTexture(label, accentColor), [label, accentColor])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  if (!texture) return null

  return (
    <mesh position={[0, 0, z]} renderOrder={12}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
