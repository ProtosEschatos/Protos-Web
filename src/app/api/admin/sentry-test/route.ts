import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { isAdminAuthenticated } from '@/lib/auth/require-admin'
import { checkRateLimitStrict, getClientIp } from '@/lib/security/rate-limit'

/**
 * Admin-guarded Sentry smoke test.
 *
 * Two supported modes via query string:
 *
 *   GET /api/admin/sentry-test           → captureException(new Error(...))
 *   GET /api/admin/sentry-test?mode=throw → throws, exercising the
 *                                            onRequestError → Sentry pipeline
 *
 * Used to verify DSN + source-map upload end-to-end after a deploy. Stays
 * behind admin auth so random visitors can't spam our Sentry quota.
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Cap Sentry-test spam: 5/min per IP. Even authenticated, we don't want a
  // leaked cookie chewing Sentry quota via loop.
  const ip = getClientIp(request)
  const rl = await checkRateLimitStrict('admin-sentry-test', ip, 5, 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Previše zahtjeva. Pokušaj ponovno za ${rl.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') ?? 'capture'
  const label = url.searchParams.get('label') ?? 'admin-smoke-test'
  const stamp = new Date().toISOString()

  if (mode === 'throw') {
    throw new Error(`[sentry-test] deliberate throw (${label} @ ${stamp})`)
  }

  const eventId = Sentry.captureException(
    new Error(`[sentry-test] captureException (${label} @ ${stamp})`),
    {
      tags: { boundary: 'sentry-test', label, mode },
      level: 'warning',
    },
  )

  // Flush so the event is definitely in-flight before we respond — otherwise
  // serverless can shut down before the SDK ships it.
  await Sentry.flush(2000)

  return NextResponse.json({
    ok: true,
    eventId,
    mode,
    label,
    stamp,
    hint: 'Check Sentry Issues → protoseschatos/protosweb; try ?mode=throw for the onRequestError path',
  })
}
