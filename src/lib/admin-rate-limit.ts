const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function checkRateLimit(ip: string): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    const bucket = `admin-login:${ip}`
    const ttlSec = Math.ceil(WINDOW_MS / 1000)
    try {
      const incrRes = await fetch(`${url}/incr/${encodeURIComponent(bucket)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (incrRes.ok) {
        const count = Number(await incrRes.text())
        if (count === 1) {
          await fetch(`${url}/expire/${encodeURIComponent(bucket)}/${ttlSec}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        if (count > MAX_ATTEMPTS) {
          const ttlRes = await fetch(`${url}/ttl/${encodeURIComponent(bucket)}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const ttl = Number(await ttlRes.text())
          return { ok: false, retryAfterSec: ttl > 0 ? ttl : ttlSec }
        }
        return { ok: true }
      }
    } catch {
      // fall through to memory
    }
  }

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
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
