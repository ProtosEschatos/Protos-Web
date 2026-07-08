#!/usr/bin/env node
/**
 * Sync Desktop "Za Protos Web" boards → repo + Supabase design-assets + design_elements URLs.
 *
 * Usage:
 *   node scripts/sync-design-boards.mjs
 *   # or if service role key unavailable locally (Vercel sensitive vars):
 *   supabase storage cp --experimental --linked -r design/references/boards ss:///design-assets/boards
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL
 *           in process.env or .env.local (Vercel `env pull` leaves sensitive keys empty).
 */
import { createClient } from '@supabase/supabase-js'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DESKTOP_SRC = '/home/protos/Desktop/Za Protos Web'
const BOARDS_DIR = join(ROOT, 'design/references/boards')
const EXTRAS_DIR = join(BOARDS_DIR, 'extras')

const BOARD_MAP = {
  'about-assets': 'about-us-page-elements.png',
  'animated-bg-patterns': 'animated-background-patterns.png',
  'blog-ui': 'blog-page-complete-kit.png',
  buttons: 'buttons-cta-set.png',
  'card-bg-textures': 'card-3d-effects-mega-pack.png',
  'card-hover': 'card-hover-effects-showcase.png',
  'card-hover-themes': 'hover-effects-showcase.png',
  'card-layouts': 'card-grid-layouts.png',
  dividers: 'dividers-abstract-futuristic.png',
  'hero-backgrounds': 'cosmic-hero-background.png',
  'icon-badges': 'icon-badge-backgrounds_ac3ae3a8.png',
  'lighting-backgrounds': 'light-effects-backgrounds.png',
  loaders: 'loading-animations-complete.png',
  modals: 'modal-popup-overlays.png',
  navigation: 'navigation-ui-set.png',
  'page-transitions': 'transition-effects-library.png',
  'parallax-layers': 'parallax-layer-elements.png',
  'scroll-animations': 'scroll-animations-pack.png',
  'service-icons': 'service-card-icons.png',
  'text-animations': 'text-animation-effects.png',
}

function loadEnv() {
  const fromProcess = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  if (fromProcess.NEXT_PUBLIC_SUPABASE_URL && fromProcess.SUPABASE_SERVICE_ROLE_KEY) {
    return fromProcess
  }

  const envPath = join(ROOT, '.env.local')
  if (!existsSync(envPath)) throw new Error('Missing Supabase env (process.env or .env.local)')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = { ...fromProcess }
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return env
}

async function main() {
  if (!existsSync(DESKTOP_SRC)) {
    console.error('Desktop folder not found:', DESKTOP_SRC)
    process.exit(1)
  }

  mkdirSync(BOARDS_DIR, { recursive: true })
  mkdirSync(EXTRAS_DIR, { recursive: true })

  const desktopFiles = new Set(readdirSync(DESKTOP_SRC))
  const mappedFiles = new Set(Object.values(BOARD_MAP))

  // 1. Copy primary boards (renamed to source_board.png)
  for (const [sourceBoard, filename] of Object.entries(BOARD_MAP)) {
    const src = join(DESKTOP_SRC, filename)
    if (!existsSync(src)) {
      console.warn('MISSING:', filename)
      continue
    }
    const dest = join(BOARDS_DIR, `${sourceBoard}.png`)
    copyFileSync(src, dest)
    console.log('copied →', `${sourceBoard}.png`)
  }

  // 2. Copy extras
  for (const filename of desktopFiles) {
    if (mappedFiles.has(filename)) continue
    const src = join(DESKTOP_SRC, filename)
    copyFileSync(src, join(EXTRAS_DIR, filename))
    console.log('extra →', filename)
  }

  let envVars = {}
  try {
    envVars = loadEnv()
  } catch {
    console.log('\nNo Supabase creds in process.env or .env.local — repo copy done, skipping upload.')
    console.log('Run: vercel env run -e production -- node scripts/sync-design-boards.mjs')
    return
  }
  const url = envVars.NEXT_PUBLIC_SUPABASE_URL
  const key = envVars.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.log('\nNo Supabase creds — repo copy done, skipping upload.')
    return
  }

  const supabase = createClient(url, key)

  // 3. Upload boards + update DB
  for (const [sourceBoard] of Object.entries(BOARD_MAP)) {
    const localPath = join(BOARDS_DIR, `${sourceBoard}.png`)
    if (!existsSync(localPath)) continue

    const storagePath = `boards/${sourceBoard}.png`
    const buffer = readFileSync(localPath)

    const { error: upErr } = await supabase.storage.from('design-assets').upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    })
    if (upErr) {
      console.error('upload failed', sourceBoard, upErr.message)
      continue
    }

    const { data: pub } = supabase.storage.from('design-assets').getPublicUrl(storagePath)
    const imageUrl = pub.publicUrl

    const { error: dbErr } = await supabase
      .from('design_elements')
      .update({ storage_path: storagePath, image_url: imageUrl })
      .eq('source_board', sourceBoard)

    if (dbErr) {
      console.error('db update failed', sourceBoard, dbErr.message)
    } else {
      console.log('uploaded + linked:', sourceBoard, imageUrl)
    }
  }

  // 4. Upload extras (storage only, no DB row per file)
  for (const filename of readdirSync(EXTRAS_DIR)) {
    const storagePath = `boards/extras/${filename}`
    const buffer = readFileSync(join(EXTRAS_DIR, filename))
    const { error } = await supabase.storage.from('design-assets').upload(storagePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    })
    if (error) console.error('extra upload', filename, error.message)
    else console.log('extra uploaded:', storagePath)
  }

  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
