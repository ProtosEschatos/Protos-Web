#!/usr/bin/env node
/**
 * Builds equirectangular panorama from synthwave-360-sheet.jpg
 *
 * Sheet layout (1536×1024):
 *   Top half:    full 360° equirectangular scene (N at center, E right, W left, S at edges)
 *   Bottom half: technical overlay (globe diagram) — NOT used as scene
 *
 * Output: top-half strip used directly as equirect texture on sphere
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
const sliceW = Math.floor(w * 0.22)

/** Longitude centers in equirect strip: N=0.5, E=0.75, S=1.0/0.0, W=0.25 */
const refCenters = {
  front: 0.5,
  right: 0.75,
  left: 0.25,
  back: 1.0,
}

await mkdir(refsDir, { recursive: true })

const equirectBuffer = await sharp(sheetPath)
  .extract({ left: 0, top: 0, width: w, height: half })
  .toBuffer()

const panoramaPath = join(envDir, 'synthwave-360-panorama.jpg')
await sharp(equirectBuffer).jpeg({ quality: 92 }).toFile(panoramaPath)
console.log(`equirect panorama: ${w}x${half} -> ${panoramaPath}`)

for (const [name, center] of Object.entries(refCenters)) {
  let left = Math.floor(center * w - sliceW / 2)
  if (name === 'back') left = w - sliceW
  left = Math.max(0, Math.min(w - sliceW, left))

  await sharp(equirectBuffer)
    .extract({ left, top: 0, width: sliceW, height: half })
    .jpeg({ quality: 92 })
    .toFile(join(refsDir, `${name}.jpg`))
  console.log(`ref ${name}: center=${center} left=${left} ${sliceW}x${half}`)
}

console.log('Done.')
