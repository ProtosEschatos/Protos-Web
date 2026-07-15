import * as THREE from 'three'

export function buildTwoLineNeonTexture(line1: string, line2: string, fontSize: number): THREE.CanvasTexture {
  const width = 1024
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

  const drawLine = (text: string, y: number) => {
    ctx.font = `300 ${fontSize}px Georgia, "Times New Roman", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur = 52
    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 28
    ctx.fillStyle = '#67e8f9'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 10
    ctx.fillStyle = '#ecfeff'
    ctx.fillText(text, width / 2, y)

    ctx.shadowBlur = 0
    ctx.fillStyle = '#f8fdff'
    ctx.fillText(text, width / 2, y)
  }

  drawLine(line1, height * 0.38)
  drawLine(line2, height * 0.64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
