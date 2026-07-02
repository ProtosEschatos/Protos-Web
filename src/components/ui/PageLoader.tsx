'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import PageLoaderCyberBackground from '@/components/ui/PageLoaderCyberBackground'
import BootCookieModal from '@/components/ui/BootCookieModal'
import { COOKIE_STORAGE_KEY } from '@/lib/cookie-consent'

const SESSION_KEY = 'protos-page-loaded'

export default function PageLoader() {
  const t = useTranslations('loader')
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  })
  const [progress, setProgress] = useState(0)
  const [readyToEnter, setReadyToEnter] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)

  useEffect(() => {
    if (!loading) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setReadyToEnter(true)
          return 100
        }
        return Math.min(prev + Math.random() * 12 + 4, 100)
      })
    }, 120)

    return () => clearInterval(interval)
  }, [loading])

  const finishBoot = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setShowCookieModal(false)
    setLoading(false)
  }, [])

  const handleEnter = useCallback(() => {
    if (!readyToEnter) return

    const hasConsent =
      typeof window !== 'undefined' && localStorage.getItem(COOKIE_STORAGE_KEY) === 'accepted'

    if (hasConsent) {
      finishBoot()
    } else {
      setShowCookieModal(true)
    }
  }, [readyToEnter, finishBoot])

  useEffect(() => {
    if (!loading || !readyToEnter || showCookieModal) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleEnter()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loading, readyToEnter, showCookieModal, handleEnter])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[var(--dark)] flex flex-col items-center justify-center overflow-hidden"
        >
          <PageLoaderCyberBackground />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-[var(--secondary)] border-t-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <h2 className="text-2xl font-bold gradient-text mb-2">Protos Web</h2>
            <p className="text-sm text-[var(--light-muted)] tracking-[0.2em] uppercase mb-6">
              {t('subtitle')}
            </p>

            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence>
              {readyToEnter && !showCookieModal && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={handleEnter}
                  className="px-10 py-3 rounded-full border border-[var(--primary)]/60 bg-[var(--primary)]/10 text-[var(--light)] text-sm font-semibold tracking-[0.25em] uppercase hover:bg-[var(--primary)]/20 hover:border-[var(--primary)] transition-all duration-300 shadow-[0_0_24px_rgba(255,102,0,0.25)]"
                >
                  {t('enter')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <BootCookieModal open={showCookieModal} onAccept={finishBoot} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
