import { getClientIp } from '@/lib/admin-rate-limit'

type Entry = { count: number; resetAt: number }

const memoryStores = new Map<string, Map<string, Entry>>()

type RateLimitOptions = {
  keyPrefix: string
  maxAttempts: number
  windowMs: number
}

type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number }

function memoryCheck(storeKey: string, id: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  let store = memoryStores.get(storeKey)
  if (!store) {
    store = new Map()
    memoryStores.set(storeKey, store)
  }

  const entry = store.get(id)
  if (!entry || now > entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true }
  }

  if (entry.count >= opts.maxAttempts) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { ok: true }
}

async function upstashCheck(id: string, opts: RateLimitOptions): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const bucket = `${opts.keyPrefix}:${id}`
  const ttlSec = Math.ceil(opts.windowMs / 1000)

  try {
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(bucket)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!incrRes.ok) return null
    const count = Number(await incrRes.text())
    if (count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(bucket)}/${ttlSec}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    if (count > opts.maxAttempts) {
      const ttlRes = await fetch(`${url}/ttl/${encodeURIComponent(bucket)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const ttl = Number(await ttlRes.text())
      return { ok: false, retryAfterSec: ttl > 0 ? ttl : ttlSec }
    }
    return { ok: true }
  } catch {
    return null
  }
}

export async function checkRequestRateLimit(
  request: Request,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const ip = getClientIp(request)
  const upstash = await upstashCheck(ip, opts)
  if (upstash) return upstash
  return memoryCheck(opts.keyPrefix, ip, opts)
}

export const PUBLIC_FORM_RATE_LIMIT = {
  keyPrefix: 'public-form',
  maxAttempts: 8,
  windowMs: 15 * 60 * 1000,
} as const

export const ADMIN_LOGIN_RATE_LIMIT = {
  keyPrefix: 'admin-login',
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
} as const
