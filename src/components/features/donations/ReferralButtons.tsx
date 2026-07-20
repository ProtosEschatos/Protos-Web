'use client'

import { ExternalLink, Wallet } from 'lucide-react'
import { AIRCASH_REFERRAL_URL, REVOLUT_REFERRAL_URL } from '@/lib/config/site'

type Props = {
  revolutLabel: string
  revolutHint?: string
  aircashLabel: string
  aircashHint?: string
  className?: string
}

/** External referral CTAs — sign up + first spend gives both sides a bonus.
 *  Rendered under the Stripe donation CTA (and mirrored on the home Contact
 *  section for Revolut). Both open in a new tab with rel=noopener. */
export default function ReferralButtons({
  revolutLabel,
  revolutHint,
  aircashLabel,
  aircashHint,
  className = '',
}: Props) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`.trim()}>
      <a
        href={REVOLUT_REFERRAL_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={revolutLabel}
        className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-sky-400/40 bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/70 hover:bg-sky-500/20 hover:text-sky-100"
      >
        <span className="inline-flex items-center gap-2">
          <Wallet className="h-4 w-4 shrink-0" />
          {revolutLabel}
          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
        </span>
        {revolutHint ? (
          <span className="text-[11px] font-normal text-sky-300/80">{revolutHint}</span>
        ) : null}
      </a>

      <a
        href={AIRCASH_REFERRAL_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={aircashLabel}
        className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/70 hover:bg-emerald-500/20 hover:text-emerald-100"
      >
        <span className="inline-flex items-center gap-2">
          <Wallet className="h-4 w-4 shrink-0" />
          {aircashLabel}
          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
        </span>
        {aircashHint ? (
          <span className="text-[11px] font-normal text-emerald-300/80">{aircashHint}</span>
        ) : null}
      </a>
    </div>
  )
}
