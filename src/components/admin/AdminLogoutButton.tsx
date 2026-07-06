'use client'

import { useRouter } from '@/routing'
import { useState } from 'react'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 rounded-xl border border-white/10 text-sm text-[var(--light-muted)] hover:text-[var(--light)] hover:border-white/20 transition-colors disabled:opacity-50"
    >
      {loading ? 'Odjava…' : 'Odjava'}
    </button>
  )
}
