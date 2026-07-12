import { NextResponse } from 'next/server'
import { syncAllMailboxes } from '@/lib/mail/inbox-sync'

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false

  const auth = request.headers.get('authorization')
  return auth === `Bearer ${secret}`
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
