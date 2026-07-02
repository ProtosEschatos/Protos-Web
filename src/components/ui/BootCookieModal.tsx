'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { acceptCookieConsent } from '@/lib/cookie-consent'

type Props = {
  open: boolean
  onAccept: () => void
}

export default function BootCookieModal({ open, onAccept }: Props) {
  const t = useTranslations('loader')

  const handleAccept = () => {
    acceptCookieConsent()
    onAccept()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--dark)]/70 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="cosmic-panel rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--primary)]/30"
          >
            <h3 className="text-lg font-bold text-[var(--light)] mb-3">{t('cookieModalTitle')}</h3>
            <p className="text-sm text-[var(--light-muted)] leading-relaxed mb-6">
              {t('cookieModalLegalPrefix')}{' '}
              <Link href="/terms" className="text-[var(--primary)] hover:underline">
                {t('cookieModalTerms')}
              </Link>{' '}
              {t('cookieModalLegalAnd')}{' '}
              <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                {t('cookieModalPrivacy')}
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('cookieModalAccept')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
