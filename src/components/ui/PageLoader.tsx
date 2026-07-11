'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'
import {
  BOOT_SESSION_KEY,
  BOOT_COMPLETE_EVENT,
  BOOT_VIDEO,
  BOOT_BG,
  clearBootPending,
  setBootPending,
  removeBootSsrVeil,
  isBootComplete,
} from '@/lib/boot-gate'

export { BOOT_SESSION_KEY, BOOT_COMPLETE_EVENT } from '@/lib/boot-gate'

function BootVideoBackground({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!active) return
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.loop = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const play = () => {
      void video.play().catch(() => {})
    }

    if (video.readyState >= 2) play()
    else video.addEventListener('canplay', play, { once: true })

    return () => {
      video.removeEventListener('canplay', play)
      video.pause()
    }
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: BOOT_BG }} aria-hidden>
      <video
        ref={videoRef}
        src={BOOT_VIDEO}
        className="absolute inset-0 h-full w-full object-cover object-center [transform:translateZ(0)_scale(1.02)]"
        preload="auto"
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/30 pointer-events-none" />
    </div>
  )
}

export default function PageLoader() {
  const t = useTranslations('loader')
  const locale = useLocale()
  const termsHref = buildLocalePath(locale, '/terms')
  const privacyHref = buildLocalePath(locale, '/privacy')
  const cookiesHref = buildLocalePath(locale, '/cookies')
  // Start identical on server and first client render to avoid a hydration
  // mismatch; returning visitors are hidden in useLayoutEffect before paint.
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [readyToEnter, setReadyToEnter] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false)

  useLayoutEffect(() => {
    if (isBootComplete()) {
      setLoading(false)
    } else {
      removeBootSsrVeil()
    }
  }, [])

  useEffect(() => {
    if (loading) setBootPending()
    else clearBootPending()
  }, [loading])

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
    sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    clearBootPending()
    window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT))
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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: BOOT_BG }}
          data-boot-layer
        >
          <BootVideoBackground active={loading} />

          <div
            className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center overflow-hidden"
            aria-hidden
          >
            <div className="absolute h-[540px] w-[min(94vw,460px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(2,8,24,0.82)_0%,rgba(2,8,24,0.45)_48%,transparent_76%)]" />
            <motion.div
              className="absolute h-[520px] w-[min(92vw,440px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.55)_0%,rgba(125,211,252,0.28)_42%,transparent_72%)] blur-3xl"
              animate={{ scale: [1, 1.06, 1], opacity: [0.72, 0.92, 0.72] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute h-[380px] w-[min(78vw,360px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(224,242,254,0.4)_0%,rgba(147,197,253,0.18)_50%,transparent_75%)] blur-2xl"
              animate={{ scale: [1.04, 0.96, 1.04], opacity: [0.45, 0.65, 0.45] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center px-10 py-12 min-w-[min(92vw,320px)]">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-sky-200/25 bg-[#020818]/82 backdrop-blur-md shadow-[0_0_48px_rgba(125,211,252,0.35),0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-3 -z-10 rounded-[1.35rem] bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.28)_0%,transparent_68%)]"
              aria-hidden
            />
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

            <h2
              className="text-2xl font-extrabold gradient-text mb-2 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
              style={{ filter: 'drop-shadow(0 0 18px rgba(125,211,252,0.45))' }}
            >
              Protos Web
            </h2>
            <p className="text-sm font-semibold text-sky-50 tracking-[0.2em] uppercase mb-6 drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]">
              {t('subtitle')}
            </p>

            <div className="w-52 h-1.5 bg-black/45 border border-white/15 rounded-full overflow-hidden mb-6 shadow-inner">
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
                  className="px-10 py-3 rounded-full border border-sky-200/50 bg-[#020818]/85 backdrop-blur-sm text-white text-sm font-bold tracking-[0.25em] uppercase hover:bg-sky-950/90 hover:border-sky-100/60 transition-all duration-300 shadow-[0_0_28px_rgba(125,211,252,0.45),0_4px_20px_rgba(0,0,0,0.55)]"
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
