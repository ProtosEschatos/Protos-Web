#!/usr/bin/env node

const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!base || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

/** Obsolete assets removed from the repo — delete from Supabase too. */
const OBSOLETE_PATHS = [
  'environment/synthwave-room.jpg',
  'environment/synthwave-360-equirect.jpg',
  'environment/synthwave-360-sheet.jpg',
  'environment/synthwave-360-panorama.jpg',
  'synthwave-room.jpg',
  'synthwave-360-sheet.jpg',
]

async function deletePath(storagePath) {
  const res = await fetch(`${base}/storage/v1/object/showcase/${storagePath}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${key}` },
  })

  if (res.status === 404) {
    console.log(`SKIP ${storagePath} (not found)`)
    return
  }

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 400 && text.includes('not_found')) {
      console.log(`SKIP ${storagePath} (not found)`)
      return
    }
    console.error(`FAIL ${storagePath}: ${res.status} ${text}`)
    process.exitCode = 1
    return
  }

  console.log(`DELETED ${storagePath}`)
}

for (const path of OBSOLETE_PATHS) {
  await deletePath(path)
}

console.log('Cleanup done.')
