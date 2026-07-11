'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminBrandMark from '@/components/features/admin/AdminBrandMark'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Neispravna lozinka ili pristup trenutno nije dostupan.')
        return
      }

      const from = searchParams.get('from') || '/admin'
      router.push(from)
      router.refresh()
    } catch {
      setError('Greška pri prijavi. Pokušaj ponovno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[var(--dark-card)]/75 backdrop-blur-md p-8 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-8">
          <AdminBrandMark className="h-10 w-10" />
          <div>
            <p className="text-sm text-[var(--light-muted)]">Protos Web</p>
            <h1 className="text-xl font-bold text-[var(--light)]">Admin prijava</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm text-[var(--light-muted)] mb-2">
              Lozinka
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)] focus:outline-none focus:border-[var(--primary)]/50"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white font-semibold uppercase tracking-wider text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {loading ? 'Prijava…' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  )
}
