import * as THREE from 'three'

export function createSunTexture() {
  const w = 1024
  const h = 1024
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const cx = w / 2
  const cy = h * 0.55
  const r = w * 0.42

  const glow = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r * 1.2)
  glow.addColorStop(0, 'rgba(255, 180, 60, 0.7)')
  glow.addColorStop(0.5, 'rgba(255, 60, 140, 0.35)')
  glow.addColorStop(1, 'rgba(255, 0, 120, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  const body = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
  body.addColorStop(0, '#ffe066')
  body.addColorStop(0.4, '#ff9933')
  body.addColorStop(0.7, '#ff4499')
  body.addColorStop(1, '#ff6600')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = '#0a0018'
  for (let y = cy + r * 0.05; y < cy + r; y += 12) {
    ctx.fillRect(cx - r, y, r * 2, 6)
  }
  ctx.restore()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createPalmSilhouetteTexture() {
  const w = 128
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.moveTo(w * 0.48, h)
  ctx.bezierCurveTo(w * 0.44, h * 0.7, w * 0.46, h * 0.45, w * 0.5, h * 0.36)
  ctx.bezierCurveTo(w * 0.54, h * 0.45, w * 0.56, h * 0.7, w * 0.52, h)
  ctx.fill()

  const fronds = [-150, -115, -75, -35, 5, 45, 85, 125, 165]
  fronds.forEach((deg) => {
    const rad = (deg * Math.PI) / 180
    const lx = w * 0.5 + Math.cos(rad) * w * 0.55
    const ly = h * 0.36 + Math.sin(rad) * h * 0.28
    ctx.beginPath()
    ctx.moveTo(w * 0.5, h * 0.36)
    ctx.lineTo(lx, ly)
    ctx.lineWidth = 10
    ctx.strokeStyle = '#000'
    ctx.stroke()
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function createStarPositions(count = 500) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 0.82 + 0.08)
    const r = 350 + Math.random() * 50
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.cos(phi)
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return arr
}
