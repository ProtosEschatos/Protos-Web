'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import PageLoaderBackground from '@/components/ui/PageLoaderBackground'
import BootCookieModal from '@/components/ui/BootCookieModal'
import { COOKIE_STORAGE_KEY } from '@/lib/cookie-consent'

const SESSION_KEY = 'protos-boot-gate-v3'

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-end overflow-hidden pb-[max(4rem,env(safe-area-inset-bottom))] md:pb-24"
        >
          <PageLoaderBackground />

          <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6">
            <div className="h-1.5 w-56 overflow-hidden rounded-full border border-emerald-400/20 bg-black/40 backdrop-blur-sm md:w-64">
              <motion.div
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 shadow-[0_0_16px_rgba(52,211,153,0.5)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(progress, 100) / 100 }}
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
                  className="mt-10 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-200/60 hover:bg-cyan-400/15 hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]"
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
