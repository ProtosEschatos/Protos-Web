'use client'

import { useState } from 'react'
import { Check, Copy, Smartphone } from 'lucide-react'
import { AIRCASH_PHONE, AIRCASH_PHONE_DISPLAY } from '@/lib/config/site'

type Props = {
  label: string
  copiedLabel: string
  hint?: string
  className?: string
}

export default function AirCashButton({ label, copiedLabel, hint, className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AIRCASH_PHONE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select via prompt if clipboard API blocked
      window.prompt('AirCash broj', AIRCASH_PHONE)
    }
  }

  return (
    <div className={`flex w-full flex-col items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-8 py-4 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/20 hover:text-emerald-200"
        aria-label={`${label} ${AIRCASH_PHONE_DISPLAY}`}
      >
        {copied ? <Check className="h-4 w-4 shrink-0" /> : <Smartphone className="h-4 w-4 shrink-0" />}
        <span>
          {copied ? copiedLabel : label}{' '}
          <span className="font-mono tracking-wide">{AIRCASH_PHONE_DISPLAY}</span>
        </span>
        {!copied ? <Copy className="h-3.5 w-3.5 shrink-0 opacity-70" /> : null}
      </button>
      {hint ? <p className="text-xs text-[var(--light-muted)]">{hint}</p> : null}
    </div>
  )
}
