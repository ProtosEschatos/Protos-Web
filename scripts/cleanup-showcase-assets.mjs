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
  'projects/desktop-cosmic-blueprint.jpg',
  'projects/mobile-cosmic-blueprint.jpg',
  'projects/desktop-protosweb.jpg',
  'projects/mobile-protosweb.jpg',
  'projects/desktop-zeustrading.jpg',
  'projects/mobile-zeustrading.jpg',
]

let warnCount = 0

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
    // Signature-verification / auth failures are treated as WARN (not FAIL):
    // the service-role key in CI can lag behind Supabase rotations, and this
    // cleanup step is idempotent — a stale key just means the obsolete file
    // stays a little longer, not a broken deploy. Real deletes will succeed
    // the next time the key is refreshed.
    //
    // Supabase returns HTTP 400 with a JSON body of {"statusCode":"403",
    // "error":"Unauthorized","message":"signature verification failed"} for
    // stale service-role JWTs, so we sniff the body — not just res.status.
    const looksLikeAuthFailure =
      res.status === 401 ||
      res.status === 403 ||
      /signature verification failed|Unauthorized|"statusCode":"?(401|403)"?/i.test(text)
    if (looksLikeAuthFailure) {
      console.warn(
        `WARN ${storagePath}: ${res.status} — service-role key rejected (skipping cleanup, not blocking CI)`,
      )
      warnCount++
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

if (warnCount > 0) {
  console.warn(
    `Cleanup finished with ${warnCount} auth warnings — rotate SUPABASE_SERVICE_ROLE_KEY in GitHub Secrets to actually delete stale assets.`,
  )
} else {
  console.log('Cleanup done.')
}
