'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'

const SESSION_KEY = 'protos-boot-gate-v5'
const BOOT_BG = '/loader/boot-bg.jpg'

type JellyfishSpec = {
  id: string
  w: number
  left: string
  top: string
  pathX: number[]
  pathY: number[]
  duration: number
}

const JELLYFISH: JellyfishSpec[] = [
  { id: 'a', w: 88, left: '6%', top: '12%', pathX: [0, 90, 160, 70, 0], pathY: [0, 50, 120, 180, 40], duration: 28 },
  { id: 'b', w: 110, left: '68%', top: '6%', pathX: [0, -120, -200, -80, 0], pathY: [0, 80, 40, 140, 20], duration: 34 },
  { id: 'c', w: 64, left: '40%', top: '22%', pathX: [0, -60, 40, 100, 0], pathY: [0, -40, 30, 90, 0], duration: 22 },
  { id: 'd', w: 76, left: '18%', top: '55%', pathX: [0, 140, 220, 100, 0], pathY: [0, -70, 20, -40, 0], duration: 30 },
  { id: 'e', w: 92, left: '78%', top: '48%', pathX: [0, -100, -180, -40, 0], pathY: [0, 60, -30, 80, 0], duration: 26 },
  { id: 'f', w: 52, left: '52%', top: '68%', pathX: [0, 80, -50, 60, 0], pathY: [0, -50, -90, -20, 0], duration: 20 },
]

function JellyfishSprite({ spec }: { spec: JellyfishSpec }) {
  const gradId = `jf-${spec.id}`
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: spec.left, top: spec.top, width: spec.w }}
      animate={{ x: spec.pathX, y: spec.pathY, rotate: [0, 6, -5, 3, 0] }}
      transition={{ duration: spec.duration, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg viewBox="0 0 100 130" className="w-full h-auto drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="32" rx="36" ry="26" fill={`url(#${gradId})`} />
        {[22, 34, 50, 66, 78].map((x, i) => (
          <path
            key={x}
            d={`M${x} 52 Q${x + (i % 2 === 0 ? 6 : -6)} 88 ${x + (i % 2 === 0 ? -4 : 4)} 125`}
            stroke="rgba(103,232,249,0.55)"
            strokeWidth="1.8"
            fill="none"
          />
        ))}
      </svg>
    </motion.div>
  )
}

export default function PageLoader() {
  const t = useTranslations('loader')
  const locale = useLocale()
  const termsHref = buildLocalePath(locale, '/terms')
  const privacyHref = buildLocalePath(locale, '/privacy')
  const cookiesHref = buildLocalePath(locale, '/cookies')
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  })
  const [progress, setProgress] = useState(0)
  const [readyToEnter, setReadyToEnter] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false)

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
    setShowCookieModal(true)
  }, [readyToEnter])

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0 scale-105"
              animate={{ scale: [1.03, 1.08, 1.03], x: [0, -12, 8, 0], y: [0, -8, 6, 0] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image src={BOOT_BG} alt="" fill priority className="object-cover object-center" sizes="100vw" aria-hidden />
            </motion.div>
            {JELLYFISH.map((spec) => (
              <JellyfishSprite key={spec.id} spec={spec} />
            ))}
            <div className="absolute inset-0 bg-[#020818]/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/50" />
          </div>

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
            <p className="text-sm text-[var(--light-muted)] tracking-[0.2em] uppercase mb-6">{t('subtitle')}</p>

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

          <AnimatePresence>
            {showCookieModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-sm px-6"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="cosmic-panel max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-400/25 p-8 shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-[var(--light)] mb-2">{t('cookieModalTitle')}</h3>
                  <p className="text-sm text-[var(--light-muted)] leading-relaxed mb-5">
                    {t('cookieModalIntro')}{' '}
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
                    </a>
                    {' '}
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
                    onClick={() => {
                      saveCookiePreferences(analyticsOptIn)
                      finishBoot()
                    }}
                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t('cookieModalAccept')}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
