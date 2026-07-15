'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { buildLocalePath } from '@/lib/config/seo'
import { saveSiteConsent } from '@/lib/config/site-consent'

type SiteConsentModalProps = {
  open: boolean
  onAccepted: () => void
}

export default function SiteConsentModal({ open, onAccepted }: SiteConsentModalProps) {
  const t = useTranslations('loader')
  const locale = useLocale()
  const termsHref = buildLocalePath(locale, '/terms')
  const privacyHref = buildLocalePath(locale, '/privacy')
  const cookiesHref = buildLocalePath(locale, '/cookies')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-consent-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="cosmic-panel max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-400/25 p-8 shadow-2xl"
          >
            <h3 id="site-consent-title" className="text-lg font-bold text-[var(--light)] mb-2">
              {t('consentModalTitle')}
            </h3>
            <p className="text-sm text-[var(--light-muted)] leading-relaxed mb-4">{t('consentModalRequired')}</p>
            <p className="text-sm text-[var(--light-muted)] leading-relaxed mb-5">
              {t('consentModalIntro')}{' '}
              <a
                href={termsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                {t('cookieModalTerms')}
              </a>
              {', '}
              <a
                href={privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                {t('cookieModalPrivacy')}
              </a>{' '}
              {t('cookieModalLegalAnd')}{' '}
              <a
                href={cookiesHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                {t('cookieModalCookies')}
              </a>
              .
            </p>

            <label className="flex gap-3 items-start rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 cursor-pointer hover:border-amber-400/50 transition-colors mb-4">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 accent-amber-400"
                required
              />
              <span>
                <span className="block text-sm font-semibold text-[var(--light)]">{t('termsAcceptLabel')}</span>
                <span className="block text-xs text-[var(--light-muted)] mt-1 leading-relaxed">{t('termsAcceptDesc')}</span>
              </span>
            </label>

            <div className="space-y-3 mb-6">
              <label className="flex gap-3 items-start rounded-xl border border-white/10 bg-white/5 p-4 opacity-90">
                <input type="checkbox" checked disabled className="mt-1 accent-cyan-400" />
                <span>
                  <span className="block text-sm font-semibold text-[var(--light)]">{t('cookieEssentialLabel')}</span>
                  <span className="block text-xs text-[var(--light-muted)] mt-1 leading-relaxed">{t('cookieEssentialDesc')}</span>
                </span>
              </label>
              <label className="flex gap-3 items-start rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4 cursor-pointer hover:border-cyan-400/40 transition-colors">
                <input
                  type="checkbox"
                  checked={analyticsOptIn}
                  onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                  className="mt-1 accent-cyan-400"
                />
                <span>
                  <span className="block text-sm font-semibold text-[var(--light)]">{t('cookieAnalyticsLabel')}</span>
                  <span className="block text-xs text-[var(--light-muted)] mt-1 leading-relaxed">{t('cookieAnalyticsDesc')}</span>
                </span>
              </label>
            </div>

            <button
              type="button"
              disabled={!termsAccepted}
              onClick={() => {
                saveSiteConsent(analyticsOptIn)
                onAccepted()
              }}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {t('consentModalAccept')}
            </button>
            {!termsAccepted && (
              <p className="mt-3 text-center text-xs text-amber-200/90">{t('consentModalBlocked')}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
