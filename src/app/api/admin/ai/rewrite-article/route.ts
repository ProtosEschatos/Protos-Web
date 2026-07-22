import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/auth/admin-auth'
import { rewriteArticle } from '@/lib/ai/seo-content-generator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string): { allowed: boolean; retryIn?: number } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true }
  }
  if (bucket.count >= RATE_LIMIT) {
    return { allowed: false, retryIn: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count += 1
  return { allowed: true }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const headerStore = await headers()
  const rateKey = token ?? headerStore.get('x-forwarded-for') ?? 'anon'
  const { allowed, retryIn } = rateLimit(`rewrite:${rateKey}`)
  if (!allowed) {
    return NextResponse.json(
      { error: `Previše upita. Pokušaj za ${retryIn ?? 60}s.` },
      { status: 429, headers: { 'Retry-After': String(retryIn ?? 60) } },
    )
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = await rewriteArticle(raw)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  return NextResponse.json({
    response: result.response,
    provider: result.provider,
  })
}
