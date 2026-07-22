'use client'

import { useEffect, useState } from 'react'

/**
 * Client badge — must NOT be an async Server Component.
 *
 * It is rendered from `AdminHeader` (`'use client'`). Calling a `'use server'`
 * action during that tree's initial render throws:
 *   "Server Functions cannot be called during initial render"
 * which 500'd every authenticated admin page after the Edge session gate
 * started passing (PR #48). Fetch the existing JSON route instead.
 */
export default function AdminActivityBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/notifications/badge', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { count?: number } | null) => {
        if (!cancelled && typeof body?.count === 'number' && body.count > 0) {
          setCount(body.count)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  if (count <= 0) return null

  return (
    <span
      className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 admin-mono"
      title={`${count} nova aktivnost u zadnjih 24h`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
