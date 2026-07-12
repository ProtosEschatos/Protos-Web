'use client'

import { useEffect, useState } from 'react'

function formatClock(): string {
  return new Date().toLocaleString('hr-HR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}

/**
 * Isolated clock so the ticking second value only re-renders this tiny span,
 * not the whole (backdrop-blurred) admin header — avoids constant repaint jank.
 */
export default function AdminClock() {
  const [clock, setClock] = useState('')

  useEffect(() => {
    setClock(formatClock())
    const timer = window.setInterval(() => setClock(formatClock()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="hidden flex-col items-end border-r border-slate-800 pr-4 xl:flex">
      <span className="text-[10px] uppercase text-slate-500">Aktivno vrijeme</span>
      <span className="font-medium text-slate-300">{clock || '…'}</span>
    </div>
  )
}
