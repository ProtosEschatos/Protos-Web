'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { acceptCookieConsent } from '@/lib/cookie-consent'

type ShowcaseCookieModalProps = {
  open: boolean
  onAccepted: () => void
  onClose: () => void
}

export function ShowcaseCookieModal({ open, onAccepted, onClose }: ShowcaseCookieModalProps) {
  const t = useTranslations('cookie')
  const ts = useTranslations('showcase')

  if (!open) return null

  const handleAccept = () => {
    acceptCookieConsent()
    onAccepted()
  }

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="showcase-cookie-title"
        className="w-full max-w-md rounded-2xl border border-cyan-400/25 bg-[#0a1020]/95 p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
      >
        <h2 id="showcase-cookie-title" className="mb-3 text-lg font-semibold text-cyan-100">
          {ts('cookieModalTitle')}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">{t('text')}</p>
        <p className="mb-6 text-sm text-slate-400">
          {ts('cookieModalLegalPrefix')}{' '}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
            {ts('cookieModalTerms')}
          </Link>{' '}
          {ts('cookieModalLegalAnd')}{' '}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
            {ts('cookieModalPrivacy')}
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            {t('accept')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
          >
            {t('decline')}
          </button>
        </div>
      </div>
    </div>
  )
}
