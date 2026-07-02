import * as THREE from 'three'

export function createSunTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, size, size)

  const cx = size * 0.5
  const cy = size * 0.58
  const radius = size * 0.42

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.15)
  glow.addColorStop(0, 'rgba(255, 200, 80, 0.55)')
  glow.addColorStop(0.55, 'rgba(255, 80, 160, 0.25)')
  glow.addColorStop(1, 'rgba(255, 0, 120, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  const body = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius)
  body.addColorStop(0, '#ffe566')
  body.addColorStop(0.35, '#ff9a3c')
  body.addColorStop(0.65, '#ff4d9d')
  body.addColorStop(1, '#ff6a00')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillStyle = '#0b0018'
  const slatStart = cy + radius * 0.08
  for (let y = slatStart; y < cy + radius; y += 14) {
    ctx.fillRect(cx - radius, y, radius * 2, 7)
  }
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createPalmTexture() {
  const w = 256
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#000000'

  ctx.beginPath()
  ctx.moveTo(w * 0.47, h)
  ctx.bezierCurveTo(w * 0.44, h * 0.72, w * 0.46, h * 0.48, w * 0.5, h * 0.38)
  ctx.bezierCurveTo(w * 0.54, h * 0.48, w * 0.56, h * 0.72, w * 0.53, h)
  ctx.closePath()
  ctx.fill()

  const fronds: Array<{ x: number; y: number; rot: number; len: number }> = [
    { x: 0.5, y: 0.36, rot: -1.35, len: 0.42 },
    { x: 0.5, y: 0.34, rot: -0.55, len: 0.46 },
    { x: 0.5, y: 0.35, rot: 0.15, len: 0.44 },
    { x: 0.5, y: 0.36, rot: 0.85, len: 0.43 },
    { x: 0.5, y: 0.37, rot: 1.55, len: 0.4 },
    { x: 0.5, y: 0.38, rot: 2.25, len: 0.38 },
    { x: 0.5, y: 0.37, rot: -2.05, len: 0.39 },
  ]

  fronds.forEach((f) => {
    ctx.save()
    ctx.translate(f.x * w, f.y * h)
    ctx.rotate(f.rot)
    ctx.beginPath()
    ctx.ellipse(0, -f.len * h * 0.35, w * 0.045, f.len * h * 0.38, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createStarField(count = 420) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 0.85 + 0.05)
    const r = 380 + Math.random() * 40
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi)
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return positions
}
