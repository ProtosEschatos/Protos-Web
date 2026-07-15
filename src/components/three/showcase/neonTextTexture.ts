import * as THREE from 'three'

const CANVAS_WIDTH = 512
const CANVAS_HEIGHT = 384

export function buildTwoLineNeonTexture(line1: string, line2: string, fontSize: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas)
    fallback.colorSpace = THREE.SRGBColorSpace
    return fallback
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const drawLine = (text: string, y: number) => {
    ctx.font = `300 ${fontSize}px Georgia, "Times New Roman", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur = 24
    ctx.fillStyle = 'rgba(34, 211, 238, 0.55)'
    ctx.fillText(text, CANVAS_WIDTH / 2, y)

    ctx.shadowBlur = 0
    ctx.fillStyle = '#f8fdff'
    ctx.fillText(text, CANVAS_WIDTH / 2, y)
  }

  drawLine(line1, CANVAS_HEIGHT * 0.38)
  drawLine(line2, CANVAS_HEIGHT * 0.64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
