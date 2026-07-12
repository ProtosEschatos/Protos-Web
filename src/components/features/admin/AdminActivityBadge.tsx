'use client'

import { useEffect, useState } from 'react'

export default function AdminActivityBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetch('/api/admin/notifications/badge')
        .then((res) => (res.ok ? res.json() : { count: 0 }))
        .then((data: { count?: number }) => {
          if (!cancelled) setCount(data.count ?? 0)
        })
        .catch(() => {
          if (!cancelled) setCount(0)
        })
    }

    load()
    const timer = window.setInterval(load, 60_000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
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
