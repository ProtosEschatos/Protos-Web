#!/usr/bin/env node
/**
 * Upload ALL production assets from public/ to Supabase Storage CDN.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const publicDir = join(root, 'public')

const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!base || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

function detectContentType(buffer, filename) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp'
  if (filename.endsWith('.svg')) return 'image/svg+xml'
  if (filename.endsWith('.mp4')) return 'video/mp4'
  if (filename.endsWith('.webp')) return 'image/webp'
  if (filename.endsWith('.png')) return 'image/png'
  return 'application/octet-stream'
}

/** @type {{ local: string, bucket: string, storagePath: string }[]} */
const MANIFEST = []

function addFile(localPath, bucket, storagePath) {
  if (!existsSync(localPath)) {
    console.warn(`SKIP missing: ${localPath}`)
    return
  }
  MANIFEST.push({ local: localPath, bucket, storagePath })
}

function walkShowcase(dir, prefix = '') {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const rel = prefix ? `${prefix}/${name}` : name
    if (statSync(full).isDirectory()) {
      walkShowcase(full, rel)
    } else if (/\.(jpe?g|png|webp)$/i.test(name)) {
      let storagePath = rel
      if (!rel.includes('/')) {
        storagePath = `projects/${name}`
      }
      addFile(full, 'showcase', storagePath)
    }
  }
}

walkShowcase(join(publicDir, 'showcase'))

const portfolioDir = join(publicDir, 'images/portfolio')
if (existsSync(portfolioDir)) {
  for (const name of readdirSync(portfolioDir).filter((f) => f.endsWith('.svg'))) {
    addFile(join(portfolioDir, name), 'site-assets', `portfolio/${name}`)
  }
}

addFile(join(publicDir, 'loader/boot-bg.mp4'), 'site-assets', 'loader/boot-bg.mp4')
addFile(join(publicDir, 'favicon.svg'), 'site-assets', 'brand/favicon.svg')
addFile(join(publicDir, 'og-image.svg'), 'site-assets', 'brand/og-image.svg')

for (const { local, bucket, storagePath } of MANIFEST) {
  const body = readFileSync(local)
  const contentType = detectContentType(body, local)

  const res = await fetch(`${base}/storage/v1/object/${bucket}/${storagePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`FAIL ${bucket}/${storagePath}: ${res.status} ${text}`)
    process.exitCode = 1
  } else {
    const rel = relative(publicDir, local)
    console.log(`OK ${bucket}/${storagePath} ← ${rel} (${contentType}, ${Math.round(body.length / 1024)}KB)`)
  }
}

console.log(`Done. Uploaded ${MANIFEST.length} production asset(s) to Supabase Storage CDN.`)
