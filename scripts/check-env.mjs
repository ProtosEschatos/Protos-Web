#!/usr/bin/env node
/**
 * Validates required env vars for local dev / CI.
 * Exits 0 with warnings only — does not print secret values.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const envLocal = resolve(root, '.env.local')
const envExample = resolve(root, '.env.example')

function loadEnvFile(path) {
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (value) out[key] = value
  }
  return out
}

const fileEnv = { ...loadEnvFile(envExample), ...loadEnvFile(envLocal) }
const env = { ...fileEnv, ...process.env }

const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL
const anon =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.SUPABASE_ANON_KEY

const required = [
  { ok: Boolean(url), label: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL' },
  { ok: Boolean(anon), label: 'Supabase anon/publishable key' },
]

const recommended = [
  { ok: Boolean(env.SUPABASE_SERVICE_ROLE_KEY), label: 'SUPABASE_SERVICE_ROLE_KEY (admin writes)' },
  { ok: Boolean(env.ADMIN_SECRET), label: 'ADMIN_SECRET (/admin login)' },
]

let failed = false
for (const { ok, label } of required) {
  if (!ok) {
    console.error(`MISSING (required): ${label}`)
    failed = true
  }
}

for (const { ok, label } of recommended) {
  if (!ok) console.warn(`WARN (recommended): ${label}`)
}

if (failed) {
  console.error('\nFix .env.local — see .env.example')
  process.exit(1)
}

console.log('Env check OK (required Supabase vars present).')
