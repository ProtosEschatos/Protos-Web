#!/usr/bin/env node
/**
 * Copy design/references/boards → public/design/boards for static hosting.
 * Vercel does not follow symlinks outside public/, so we mirror at build time.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'design/references/boards')
const DEST = join(ROOT, 'public/design/boards')

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const from = join(src, entry)
    const to = join(dest, entry)
    if (statSync(from).isDirectory()) {
      copyDir(from, to)
    } else if (entry.endsWith('.png')) {
      copyFileSync(from, to)
    }
  }
}

if (!existsSync(SRC)) {
  console.warn('[copy-design-boards-public] source missing:', SRC)
  process.exit(0)
}

copyDir(SRC, DEST)
console.log('[copy-design-boards-public] mirrored boards → public/design/boards')
