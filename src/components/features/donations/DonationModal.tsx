'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import {
  DONATION_MAX_EUR,
  DONATION_MIN_EUR,
  KO_FI_URL,
  type DonationCause,
} from '@/lib/donations'

type Props = {
  open: boolean
  onClose: () => void
  cause: DonationCause
  labels: {
    title: string
    amountLabel: string
    amountHint: string
    emailLabel: string
    nameLabel: string
    nameOptional: string
    submit: string
    cancel: string
    processing: string
    errorGeneric: string
    kofiAlt?: string
  }
}

export default function DonationModal({ open, onClose, cause, labels }: Props) {
  const locale = useLocale()
  const [amount, setAmount] = useState('25')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed < DONATION_MIN_EUR || parsed > DONATION_MAX_EUR) {
      setError(labels.amountHint)
      return
    }
    if (!email.includes('@')) {
      setError(labels.errorGeneric)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parsed),
          email: email.trim(),
          name: name.trim() || undefined,
          cause,
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? labels.errorGeneric)
        setLoading(false)
        return
      }
      window.location.href = data.url as string
    } catch {
      setError(labels.errorGeneric)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={labels.cancel}
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--dark-card)] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--light-muted)] hover:text-[var(--light)]"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-[var(--light)] pr-8">{labels.title}</h3>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--light)] mb-1.5">
              {labels.amountLabel}
            </label>
            <input
              type="number"
              min={DONATION_MIN_EUR}
              max={DONATION_MAX_EUR}
              step={1}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--light)] outline-none focus:border-[var(--primary)]/50"
            />
            <p className="mt-1 text-xs text-[var(--light-muted)]">{labels.amountHint}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--light)] mb-1.5">
              {labels.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--light)] outline-none focus:border-[var(--primary)]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--light)] mb-1.5">
              {labels.nameLabel}{' '}
              <span className="text-[var(--light-muted)] font-normal">({labels.nameOptional})</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--light)] outline-none focus:border-[var(--primary)]/50"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-[var(--light-muted)] hover:border-white/25"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {labels.processing}
                </>
              ) : (
                labels.submit
              )}
            </button>
          </div>
          {labels.kofiAlt ? (
            <p className="mt-4 text-center text-xs text-[var(--light-muted)]">
              <a
                href={KO_FI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[#ff5e5b]"
              >
                {labels.kofiAlt}
              </a>
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
