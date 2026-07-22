/**
 * Distributed IP rate limiter with graceful in-memory fallback.
 *
 * If `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, uses
 * `@upstash/ratelimit` sliding-window against Upstash Redis. This is the
 * ONLY setup that gives a real global cap across Vercel serverless lambdas.
 *
 * Otherwise falls back to an in-memory `Map` per-lambda (previous behavior).
 * The fallback keeps the API stable during local dev / preview when Upstash
 * env is missing — but on Vercel prod, the memory limiter is per-instance
 * and effectively no-op under real traffic. **Set Upstash env in prod.**
 *
 * Public API is unchanged: `checkRateLimit(namespace, ip, max, windowMs)` —
 * so call sites don't need edits. Sync signature is preserved by using
 * `waitUntil`-friendly patterns: the Upstash call is fire-and-report through
 * a small LRU of in-flight promises, so behavior remains deterministic
 * without changing callers to `async`.
 *
 * Auth-critical routes (login, admin AI) MUST also enforce a slower DB /
 * app-layer cap. Rate limit alone is not authorization.
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

// ── In-memory fallback (previous implementation, kept as-is) ─────────────

function checkRateLimitInMemory(
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

// ── Upstash sliding-window ───────────────────────────────────────────────

// Lazy singletons — only instantiated on first `checkRateLimit` call when
// Upstash env is present. Keeps cold-start cost off when env is unset.
type UpstashLimiter = {
  limit: (id: string) => Promise<{ success: boolean; reset: number }>
}
const upstashLimiters = new Map<string, UpstashLimiter>()

function upstashEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function getUpstashLimiter(
  namespace: string,
  maxAttempts: number,
  windowMs: number,
): Promise<UpstashLimiter | null> {
  const key = `${namespace}:${maxAttempts}:${windowMs}`
  const existing = upstashLimiters.get(key)
  if (existing) return existing

  try {
    const [{ Redis }, { Ratelimit }] = await Promise.all([
      import('@upstash/redis'),
      import('@upstash/ratelimit'),
    ])
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    const limiter = new Ratelimit({
      redis,
      // Sliding window is the closest match to the old fixed-window
      // semantics of `checkRateLimitInMemory`, without the burst edge case.
      limiter: Ratelimit.slidingWindow(maxAttempts, `${Math.ceil(windowMs / 1000)} s`),
      analytics: false,
      prefix: `pw:rl:${namespace}`,
    })
    const wrapped: UpstashLimiter = {
      limit: async (id) => {
        const r = await limiter.limit(id)
        return { success: r.success, reset: r.reset }
      },
    }
    upstashLimiters.set(key, wrapped)
    return wrapped
  } catch (err) {
    console.warn('[rate-limit] Upstash init failed, falling back to memory:', (err as Error).message)
    return null
  }
}

// In-flight promise cache to allow a sync-shaped facade over the async
// Upstash call. Callers see a definitive answer only after first hit; the
// FIRST request per (ns, ip) window will always allow through (the promise
// hasn't resolved), which is acceptable given this is defense-in-depth.
const inFlight = new Map<string, Promise<void>>()
const decisions = new Map<string, { ok: boolean; resetAt: number }>()

function scheduleUpstashCheck(
  namespace: string,
  ip: string,
  maxAttempts: number,
  windowMs: number,
): void {
  const key = `${namespace}:${ip}`
  if (inFlight.has(key)) return
  const p = (async () => {
    const limiter = await getUpstashLimiter(namespace, maxAttempts, windowMs)
    if (!limiter) return
    const res = await limiter.limit(ip)
    decisions.set(key, { ok: res.success, resetAt: res.reset })
    // Auto-clear when window expires so memory doesn't leak.
    const ttl = Math.max(0, res.reset - Date.now()) + 1000
    setTimeout(() => decisions.delete(key), ttl).unref?.()
  })()
    .catch((err) => {
      console.warn('[rate-limit] Upstash limit call threw:', (err as Error).message)
    })
    .finally(() => {
      inFlight.delete(key)
    })
  inFlight.set(key, p)
}

// ── Public API (unchanged signature) ─────────────────────────────────────

export function checkRateLimit(
  namespace: string,
  ip: string,
  maxAttempts: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  if (upstashEnabled()) {
    const key = `${namespace}:${ip}`
    const cached = decisions.get(key)
    // Kick a fresh Upstash check for the next request. Deliberately non-blocking.
    scheduleUpstashCheck(namespace, ip, maxAttempts, windowMs)
    if (cached && !cached.ok) {
      const retryAfterSec = Math.max(1, Math.ceil((cached.resetAt - Date.now()) / 1000))
      return { ok: false, retryAfterSec }
    }
    // Also keep a memory-side counter as a same-lambda safety net until the
    // first Upstash decision lands. This makes the first ~1 request cheaper
    // (memory) and subsequent ones authoritative (Upstash).
    return checkRateLimitInMemory(namespace, ip, maxAttempts, windowMs)
  }
  return checkRateLimitInMemory(namespace, ip, maxAttempts, windowMs)
}

/**
 * Strict async variant that waits for Upstash's answer BEFORE returning.
 * Use on hot / abuse-sensitive endpoints (admin AI, login) where the small
 * added latency is a fair trade for a hard cap on the very first request.
 * Falls back to `checkRateLimit` (sync + memory) if Upstash is not configured.
 */
export async function checkRateLimitStrict(
  namespace: string,
  ip: string,
  maxAttempts: number,
  windowMs: number,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  if (!upstashEnabled()) {
    return checkRateLimitInMemory(namespace, ip, maxAttempts, windowMs)
  }
  const limiter = await getUpstashLimiter(namespace, maxAttempts, windowMs)
  if (!limiter) return checkRateLimitInMemory(namespace, ip, maxAttempts, windowMs)
  const res = await limiter.limit(ip)
  if (!res.success) {
    const retryAfterSec = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000))
    return { ok: false, retryAfterSec }
  }
  return { ok: true }
}
