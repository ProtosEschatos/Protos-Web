const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    return { ok: true }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { ok: true }
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = store.get(ip)
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  entry.count += 1
}
