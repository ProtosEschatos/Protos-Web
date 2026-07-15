import * as THREE from 'three'

export function normalizeProjectUrl(url: string): string {
  return url.replace(/\/$/, '').toLowerCase()
}

const TEXTURE_MAX_DIMENSION = 768
const TEXTURE_QUEUE_GAP_MS = 50

type QueueTask = () => Promise<void>

const textureQueue: QueueTask[] = []
let textureQueueRunning = false

async function drainTextureQueue() {
  if (textureQueueRunning) return
  textureQueueRunning = true
  while (textureQueue.length > 0) {
    const task = textureQueue.shift()
    if (task) await task()
    await new Promise((resolve) => setTimeout(resolve, TEXTURE_QUEUE_GAP_MS))
  }
  textureQueueRunning = false
}

/** Serialize texture loads so image decode does not spike the main thread. */
export function enqueueShowcaseTextureLoad<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    textureQueue.push(async () => {
      try {
        resolve(await task())
      } catch (error) {
        reject(error)
      }
    })
    void drainTextureQueue()
  })
}

/** Downscale large images before GPU upload — less CPU/memory on weak devices. */
export function textureFromImage(image: HTMLImageElement, maxDimension = TEXTURE_MAX_DIMENSION): THREE.Texture {
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
  if (scale >= 1) {
    const texture = new THREE.Texture(image)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    return texture
  }

  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const texture = new THREE.Texture(image)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }
  ctx.drawImage(image, 0, 0, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
