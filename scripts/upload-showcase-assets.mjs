#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const showcaseDir = join(root, 'public/showcase')

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
  if (/\.png$/i.test(filename)) return 'image/png'
  if (/\.webp$/i.test(filename)) return 'image/webp'
  return 'image/jpeg'
}

function collectFiles(dir, prefix = '') {
  const entries = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const rel = prefix ? `${prefix}/${name}` : name
    if (statSync(full).isDirectory()) {
      entries.push(...collectFiles(full, rel))
    } else if (/\.(jpe?g|png|webp)$/i.test(name)) {
      let storagePath = rel
      if (!rel.includes('/')) {
        storagePath = `projects/${name}`
      }
      entries.push({ full, storagePath })
    }
  }
  return entries
}

const files = collectFiles(showcaseDir)

for (const { full, storagePath } of files) {
  const body = readFileSync(full)
  const contentType = detectContentType(body, full)

  const res = await fetch(`${base}/storage/v1/object/showcase/${storagePath}`, {
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
    console.error(`FAIL ${storagePath}: ${res.status} ${text}`)
    process.exitCode = 1
  } else {
    console.log(`OK ${storagePath} (${contentType}, ${Math.round(body.length / 1024)}KB)`)
  }
}

console.log('Done.')
