#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const showcaseDir = join(root, 'public/showcase')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://laqnnzavwbojntfiqmxj.supabase.co'
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY

if (!key) {
  console.error('Missing Supabase key (SERVICE_ROLE or ANON)')
  process.exit(1)
}

const supabase = createClient(url, key)
const files = readdirSync(showcaseDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

for (const file of files) {
  const storagePath = file === 'synthwave-room.jpg' ? 'environment/synthwave-room.jpg' : `projects/${file}`
  const body = readFileSync(join(showcaseDir, file))
  const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg'

  const { error } = await supabase.storage.from('showcase').upload(storagePath, body, {
    contentType,
    upsert: true,
  })

  if (error) {
    console.error(`FAIL ${storagePath}:`, error.message)
    process.exitCode = 1
  } else {
    console.log(`OK ${storagePath}`)
  }
}

console.log('Done.')
