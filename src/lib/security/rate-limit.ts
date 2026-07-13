/**
 * Lightweight in-memory IP rate limiter for public API routes.
 *
 * Best-effort defense-in-depth: on Vercel serverless this state only
 * persists within a warm lambda instance, so it does not guarantee a hard
 * cap across all traffic. Routes with sensitive writes (e.g. contact form)
 * should also enforce limits at the database layer — see
 * `public.submit_contact` (3/hour per IP), which is the authoritative check.
 */

type Entry = { count: number; resetAt: number }

const stores = new Map<string, Map<string, Entry>>()

function getStore(namespace: string): Map<string, Entry> {
  let store = stores.get(namespace)
  if (!store) {
    store = new Map()
    stores.set(namespace, store)
  }
  return store
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

/** IP to persist for DB rate limits; null when the request has no usable client IP. */
export function clientIpForStorage(ip: string): string | null {
  if (!ip || ip === 'unknown') return null
  return ip.slice(0, 45)
}

export function checkRateLimit(
  namespace: string,
  ip: string,
  maxAttempts: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const store = getStore(namespace)
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= maxAttempts) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { ok: true }
}
