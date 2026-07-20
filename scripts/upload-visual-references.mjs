#!/usr/bin/env node
/**
 * Upload internal visual-reference library (PNGs from `~/Desktop/Za Protos Web/`
 * or any directory pointed to by VISUAL_REFERENCES_DIR) into the Supabase
 * `admin-uploads` bucket and register each row in `public.admin_assets`.
 *
 * Two-stage per file:
 *   1. PUT bytes to  storage/v1/object/admin-uploads/visual-references/<slug>.<ext>
 *   2. UPSERT row into rest/v1/admin_assets  (dedupe on storage_path)
 *
 * All rows are inserted with `is_published = false` — this library is
 * internal-only, surfaced in /admin/assets under the "visual-reference" tag.
 * The public site never reads them.
 *
 * ENV:
 *   NEXT_PUBLIC_SUPABASE_URL         (or SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY        (required — bucket is private)
 *   VISUAL_REFERENCES_DIR            (default: ~/Desktop/Za Protos Web/)
 *   VISUAL_REFERENCES_UPLOADED_BY    (default: "protos-agent")
 *
 * Signature-verification failures are demoted to WARN so a stale
 * service-role key does not fail CI; the row for that file is skipped and
 * can be retried after the next key rotation.
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { homedir } from 'node:os'

import { VISUAL_REFERENCES, TOTAL_COMPONENT_COUNT } from './visual-references-manifest.mjs'

/** Strip surrounding quotes that `vercel env pull` sometimes emits. */
function cleanEnv(v) {
  if (!v) return ''
  return v.trim().replace(/^['"]|['"]$/g, '')
}
const base = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL).replace(/\/$/, '')
const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)

if (!base) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL')
  process.exit(1)
}
if (!key) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sourceDir = resolve(
  process.env.VISUAL_REFERENCES_DIR ?? join(homedir(), 'Desktop', 'Za Protos Web'),
)
const uploadedBy = process.env.VISUAL_REFERENCES_UPLOADED_BY ?? 'protos-agent'

console.log(`Source: ${sourceDir}`)
console.log(`Target: ${base}`)
console.log(`Entries in manifest: ${VISUAL_REFERENCES.length}`)
console.log(`Total components tracked: ${TOTAL_COMPONENT_COUNT}\n`)

/**
 * Detect image content-type from magic bytes / extension.
 * @param {Buffer} buffer
 * @param {string} filename
 */
function detectContentType(buffer, filename) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp'
  const ext = extname(filename).toLowerCase()
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}

/**
 * Simple PNG dimensions parse (IHDR chunk at bytes 16–23). Best-effort;
 * returns null for non-PNG.
 * @param {Buffer} buffer
 */
function readPngDimensions(buffer) {
  if (buffer.length < 24 || buffer[0] !== 0x89 || buffer[1] !== 0x50) return null
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

/** Uniform WARN-vs-FAIL classifier for stale service-role rejection. */
function isAuthFailure(status, text) {
  return (
    status === 401 ||
    status === 403 ||
    /signature verification failed|Unauthorized|"statusCode":"?(401|403)"?/i.test(text)
  )
}

let okCount = 0
let warnCount = 0
let failCount = 0
let missingCount = 0

for (const entry of VISUAL_REFERENCES) {
  const localPath = join(sourceDir, entry.filename)
  if (!existsSync(localPath)) {
    console.warn(`SKIP missing on disk: ${entry.filename}`)
    missingCount++
    continue
  }

  const bytes = readFileSync(localPath)
  const contentType = detectContentType(bytes, entry.filename)
  const dims = readPngDimensions(bytes)
  const ext = contentType === 'image/png' ? 'png'
    : contentType === 'image/jpeg' ? 'jpg'
    : contentType === 'image/webp' ? 'webp'
    : extname(entry.filename).slice(1)
  const storagePath = `visual-references/${entry.slug}.${ext}`

  // ── 1. Upload to Storage ───────────────────────────────────────────────
  const uploadRes = await fetch(
    `${base}/storage/v1/object/admin-uploads/${storagePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: bytes,
    },
  )

  if (!uploadRes.ok) {
    const text = await uploadRes.text()
    if (isAuthFailure(uploadRes.status, text)) {
      console.warn(
        `WARN upload ${storagePath}: ${uploadRes.status} — service-role key rejected (skipping)`,
      )
      warnCount++
      continue
    }
    console.error(`FAIL upload ${storagePath}: ${uploadRes.status} ${text}`)
    failCount++
    process.exitCode = 1
    continue
  }

  // ── 2. Upsert admin_assets row ─────────────────────────────────────────
  const row = {
    category: 'image',
    bucket: 'admin-uploads',
    storage_path: storagePath,
    mime_type: contentType,
    size_bytes: bytes.length,
    width: dims?.width ?? null,
    height: dims?.height ?? null,
    original_filename: entry.filename,
    label: entry.label,
    tags: ['visual-reference', entry.group, ...entry.tags],
    metadata: {
      source: 'Za Protos Web (desktop)',
      group: entry.group,
      components: entry.components,
      protos_web_targets: entry.protosWebTargets,
      component_count: entry.components.length,
    },
    is_published: false,
    uploaded_by: uploadedBy,
  }

  const rowRes = await fetch(`${base}/rest/v1/admin_assets?on_conflict=storage_path`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  })

  if (!rowRes.ok) {
    const text = await rowRes.text()
    if (isAuthFailure(rowRes.status, text)) {
      console.warn(
        `WARN row ${storagePath}: ${rowRes.status} — service-role key rejected on REST (skipping row)`,
      )
      warnCount++
      continue
    }
    console.error(`FAIL row ${storagePath}: ${rowRes.status} ${text}`)
    failCount++
    process.exitCode = 1
    continue
  }

  okCount++
  console.log(
    `OK  ${entry.slug} → ${storagePath}  (${contentType}, ${Math.round(bytes.length / 1024)}KB, ${entry.components.length} components)`,
  )
}

// ── Summary ────────────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────────')
console.log(`Uploaded : ${okCount}`)
console.log(`Warned   : ${warnCount}  (auth failures, safe to retry after key rotation)`)
console.log(`Failed   : ${failCount}`)
console.log(`Missing  : ${missingCount}  (not present in ${sourceDir})`)
if (okCount === 0 && warnCount > 0) {
  console.log(
    '\nNo files uploaded. Rotate SUPABASE_SERVICE_ROLE_KEY in GitHub Secrets, then re-run.',
  )
}

// Extra sanity check: warn on files present on disk but NOT in manifest.
try {
  const onDisk = (await readdir(sourceDir))
    .filter((n) => /\.(png|jpe?g|webp)$/i.test(n))
  const known = new Set(VISUAL_REFERENCES.map((e) => e.filename))
  const unknown = onDisk.filter((n) => !known.has(n))
  if (unknown.length) {
    console.log('\nHint — the following files are on disk but not in the manifest:')
    for (const n of unknown) console.log(`  · ${n}`)
    console.log('Add them to scripts/visual-references-manifest.mjs to include them.')
  }
} catch {
  /* directory unreadable — non-fatal */
}
