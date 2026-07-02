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
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-w-md w-full rounded-2xl border border-cyan-400/25 bg-black/75 p-8 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-cyan-50 mb-3">{t('cookieModalTitle')}</h3>
            <p className="text-sm text-cyan-100/70 leading-relaxed mb-6">
              {t('cookieModalLegalPrefix')}{' '}
              <Link href="/terms" className="text-emerald-300 hover:underline">
                {t('cookieModalTerms')}
              </Link>{' '}
              {t('cookieModalLegalAnd')}{' '}
              <Link href="/privacy" className="text-emerald-300 hover:underline">
                {t('cookieModalPrivacy')}
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full rounded-full border border-cyan-300/40 bg-cyan-500/15 px-6 py-3 text-sm font-semibold text-cyan-50 transition-all hover:bg-cyan-400/25 hover:border-cyan-200/50"
            >
              {t('cookieModalAccept')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
