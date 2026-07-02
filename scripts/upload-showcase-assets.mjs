#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const showcaseDir = join(root, 'public/showcase')

const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!base || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const files = readdirSync(showcaseDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

for (const file of files) {
  const storagePath = file === 'synthwave-room.jpg' ? 'environment/synthwave-room.jpg' : `projects/${file}`
  const body = readFileSync(join(showcaseDir, file))
  const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg'

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
