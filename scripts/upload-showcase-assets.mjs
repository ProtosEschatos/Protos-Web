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
        if (/^(desktop|mobile)-/i.test(name)) storagePath = `projects/${name}`
        else if (/^synthwave-/i.test(name)) storagePath = `environment/${name}`
        else storagePath = `projects/${name}`
      }
      entries.push({ full, storagePath })
    }
  }
  return entries
}

const files = collectFiles(showcaseDir).filter(
  (f) => f.storagePath !== 'environment/synthwave-360-sheet.jpg' && f.storagePath !== 'synthwave-360-sheet.jpg',
)

for (const { full, storagePath } of files) {
  const body = readFileSync(full)
  const contentType = full.endsWith('.png') ? 'image/png' : 'image/jpeg'

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
    console.log(`OK ${storagePath}`)
  }
}

console.log('Done.')
