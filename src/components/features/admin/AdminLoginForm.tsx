'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Monitor } from 'lucide-react'

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
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="admin-card w-full max-w-md p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-2.5 text-indigo-400">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <p className="admin-mono text-[10px] uppercase tracking-wider text-slate-500">Privatno</p>
            <h1 className="text-xl font-bold text-slate-100">Console v3.0</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="admin-mono mb-2 block text-xs text-slate-400">
              Admin lozinka
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500/50"
              required
            />
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Prijava…' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  )
}
