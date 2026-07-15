#!/usr/bin/env node
/**
 * Capture live project screenshots into public/showcase/, then normalize to real JPEG.
 * Requires: firefox, python3 + Pillow.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const showcaseDir = join(root, 'public/showcase')

const TARGETS = [
  { name: 'desktop-bodulica.jpg', size: '1920,1080', url: 'https://bodulica.shop' },
  { name: 'mobile-bodulica.jpg', size: '390,844', url: 'https://bodulica.shop' },
  { name: 'desktop-auto-moto.jpg', size: '1920,1080', url: 'https://auto-moto.vercel.app' },
  { name: 'mobile-auto-moto.jpg', size: '390,844', url: 'https://auto-moto.vercel.app' },
  { name: 'desktop-golden-pawn.jpg', size: '1920,1080', url: 'https://golden-pawn.vercel.app' },
  { name: 'mobile-golden-pawn.jpg', size: '390,844', url: 'https://golden-pawn.vercel.app' },
  { name: 'desktop-dentalna-ordinacija.jpg', size: '1920,1080', url: 'https://lumina-dent.vercel.app' },
  { name: 'mobile-dentalna-ordinacija.jpg', size: '390,844', url: 'https://lumina-dent.vercel.app' },
]

mkdirSync(showcaseDir, { recursive: true })

function capture({ name, size, url }) {
  const out = join(showcaseDir, name)
  const profile = join('/tmp', `ff-showcase-${process.pid}-${name}`)
  rmSync(profile, { recursive: true, force: true })
  mkdirSync(profile, { recursive: true })

  console.log(`Capturing ${name} (${size}) <- ${url}`)
  const result = spawnSync(
    'firefox',
    ['--headless', '--profile', profile, '--screenshot', out, '--window-size', size, url],
    { encoding: 'utf8', timeout: 120_000 },
  )

  rmSync(profile, { recursive: true, force: true })

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || `firefox failed for ${name}`)
    process.exit(1)
  }
}

for (const target of TARGETS) {
  capture(target)
}

console.log('Normalizing captured files...')
const normalize = spawnSync('node', [join(root, 'scripts/normalize-showcase-screenshots.mjs')], {
  stdio: 'inherit',
  cwd: root,
})

if (normalize.status !== 0) process.exit(normalize.status ?? 1)
console.log('Capture complete. Run npm run upload:showcase-assets to sync Supabase Storage.')
