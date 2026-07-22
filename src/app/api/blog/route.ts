import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getBlogPosts } from '@/lib/queries/blog'
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit'

// Public JSON endpoint — every hit is a Postgres round-trip. Cap at 100/min
// per IP to blunt scraping / accidental client loops, plus a s-maxage cache
// header so Vercel/CDN serves repeat hits from the edge.
const RATE_LIMIT_MAX = 100
const RATE_LIMIT_WINDOW_MS = 60_000

const langSchema = z
  .string()
  .regex(/^[a-z]{2}$/i)
  .default('hr')

export async function GET(request: Request) {
  const ip = getClientIp(request)
  const rl = checkRateLimit('public-blog', ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Previše zahtjeva. Pokušaj ponovno za ${rl.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  const { searchParams } = new URL(request.url)
  const parsed = langSchema.safeParse(searchParams.get('lang'))
  const lang = parsed.success ? parsed.data.toLowerCase() : 'hr'

  const posts = await getBlogPosts(20, lang)
  return NextResponse.json(posts, {
    headers: {
      // Cache 5 min at edge, allow serving stale for 1h while revalidating.
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
