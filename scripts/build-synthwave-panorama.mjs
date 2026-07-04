#!/usr/bin/env node
/**
 * Builds 360° cylinder panorama + reference panels from synthwave-360-sheet.jpg
 *
 * Sheet layout (1536×1024):
 *   Top half:    LEFT (0–512) | CENTER FRONT (512–1024) | RIGHT (1024–1536)
 *   Bottom half: BACK gateway centered (512–1024)
 *
 * Cylinder UV order for Three.js (heading 0 = -Z forward):
 *   [right, back, left, front]
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const envDir = join(root, '..', 'public', 'showcase', 'environment')
const sheetPath = join(envDir, 'synthwave-360-sheet.jpg')
const refsDir = join(envDir, 'refs')

const meta = await sharp(sheetPath).metadata()
const w = meta.width ?? 1536
const h = meta.height ?? 1024
const half = Math.floor(h / 2)
const third = Math.floor(w / 3)

const panels = {
  left: { left: 0, top: 0, width: third, height: half },
  front: { left: third, top: 0, width: third, height: half },
  right: { left: third * 2, top: 0, width: w - third * 2, height: half },
  back: { left: third, top: half, width: third, height: half },
}

await mkdir(refsDir, { recursive: true })

for (const [name, region] of Object.entries(panels)) {
  await sharp(sheetPath).extract(region).jpeg({ quality: 92 }).toFile(join(refsDir, `${name}.jpg`))
  console.log(`ref ${name}: ${region.width}x${region.height}`)
}

// Stitch panorama: right | back | left | front
const order = ['right', 'back', 'left', 'front']
const panelBuffers = await Promise.all(
  order.map((name) => sharp(sheetPath).extract(panels[name]).toBuffer()),
)

const panelW = third
const panoramaH = half
let composite = sharp({
  create: {
    width: panelW * 4,
    height: panoramaH,
    channels: 3,
    background: { r: 10, g: 0, b: 30 },
  },
})

composite = composite.composite(
  panelBuffers.map((input, i) => ({
    input,
    left: i * panelW,
    top: 0,
  })),
)

const panoramaPath = join(envDir, 'synthwave-360-panorama.jpg')
await composite.jpeg({ quality: 92 }).toFile(panoramaPath)
console.log(`panorama: ${panelW * 4}x${panoramaH} -> ${panoramaPath}`)
console.log('Done.')
