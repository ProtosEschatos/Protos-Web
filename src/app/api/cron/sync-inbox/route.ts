import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { syncAllMailboxes } from '@/lib/mail/inbox-sync'

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false

  const auth = request.headers.get('authorization')
  if (!auth) return false

  const expected = `Bearer ${secret}`
  // Constant-time compare to avoid timing side-channels on secret length/prefix.
  // Length check first so timingSafeEqual doesn't throw (it requires equal lengths).
  const authBuf = Buffer.from(auth)
  const expectedBuf = Buffer.from(expected)
  if (authBuf.length !== expectedBuf.length) return false
  return timingSafeEqual(authBuf, expectedBuf)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await syncAllMailboxes()
    const failed = Object.entries(results).filter(([, r]) => !r.ok)

    return NextResponse.json({
      ok: failed.length === 0,
      syncedAt: new Date().toISOString(),
      results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    console.error('[cron/sync-inbox]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
