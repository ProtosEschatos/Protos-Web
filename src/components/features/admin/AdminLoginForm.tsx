'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Monitor, ShieldCheck } from 'lucide-react'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [totp, setTotp] = useState('')
  const [needsTotp, setNeedsTotp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, totp: totp || undefined }),
      })
      const data = await res.json()

      if (!res.ok) {
        // Backend signals that a valid password was accepted but a TOTP
        // code is still required. Reveal the 2FA input and let the user
        // paste/type without re-entering the password.
        if (data?.needsTotp) {
          setNeedsTotp(true)
          setError(data.message || 'Unesi 6-cifreni 2FA kod.')
        } else {
          setError(data.message || 'Neispravna lozinka ili pristup trenutno nije dostupan.')
        }
        return
      }

      // Sanitize `from` param — only allow internal absolute paths.
      // Blocks open-redirect vectors like ?from=https://evil.com
      // and protocol-relative ?from=//evil.com/steal
      const rawFrom = searchParams.get('from') || '/admin'
      const safeFrom =
        rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/admin'
      router.push(safeFrom)
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
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-11 text-slate-100 outline-none focus:border-indigo-500/50"
                required
              />
              <button
                type="button"
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku (drži miš preko oka)'}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition-colors hover:text-indigo-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {needsTotp ? (
            <div>
              <label htmlFor="admin-totp" className="admin-mono mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                2FA kod (Authenticator)
              </label>
              <input
                id="admin-totp"
                type="text"
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\s+/g, '').slice(0, 6))}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="000000"
                className="admin-mono w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center text-lg tracking-[0.5em] text-slate-100 outline-none focus:border-indigo-500/50"
                required
                autoFocus
              />
            </div>
          ) : null}

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
