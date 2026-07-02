'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'

export const BOOT_SESSION_KEY = 'protos-boot-gate-v9'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
const BOOT_VIDEO = '/loader/boot-bg.mp4'
const BOOT_POSTER = '/loader/boot-bg.jpg'
const LOOP_CROSSFADE_SEC = 1.1

function BootVideoBackground({ active }: { active: boolean }) {
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)
  const leadingIsARef = useRef(true)
  const crossfadingRef = useRef(false)

  useEffect(() => {
    if (!active) return

    const videoA = videoARef.current
    const videoB = videoBRef.current
    if (!videoA || !videoB) return

    const getLeading = () => (leadingIsARef.current ? videoA : videoB)
    const getTrailing = () => (leadingIsARef.current ? videoB : videoA)

    const resetVideo = (video: HTMLVideoElement) => {
      video.pause()
      video.currentTime = 0
      video.style.opacity = '0'
    }

    const startCrossfade = () => {
      if (crossfadingRef.current) return

      const leading = getLeading()
      const trailing = getTrailing()
      const duration = leading.duration
      if (!duration || duration <= LOOP_CROSSFADE_SEC * 2) return

      crossfadingRef.current = true
      trailing.currentTime = 0
      void trailing.play()

      trailing.style.transition = `opacity ${LOOP_CROSSFADE_SEC}s ease-in-out`
      leading.style.transition = `opacity ${LOOP_CROSSFADE_SEC}s ease-in-out`
      trailing.style.opacity = '1'
      leading.style.opacity = '0'

      window.setTimeout(() => {
        resetVideo(leading)
        leadingIsARef.current = !leadingIsARef.current
        crossfadingRef.current = false
      }, LOOP_CROSSFADE_SEC * 1000)
    }

    const onTimeUpdate = (event: Event) => {
      const target = event.target as HTMLVideoElement
      const leading = getLeading()
      if (target !== leading || crossfadingRef.current) return

      const duration = leading.duration
      if (duration && leading.currentTime >= duration - LOOP_CROSSFADE_SEC) {
        startCrossfade()
      }
    }

    for (const video of [videoA, videoB]) {
      video.muted = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      video.preload = 'auto'
      video.addEventListener('timeupdate', onTimeUpdate)
    }

    videoA.style.opacity = '1'
    videoB.style.opacity = '0'

    const playLeading = () => {
      void getLeading().play().catch(() => {})
    }

    if (videoA.readyState >= 1) playLeading()
    else videoA.addEventListener('loadedmetadata', playLeading, { once: true })

    return () => {
      for (const video of [videoA, videoB]) {
        video.removeEventListener('timeupdate', onTimeUpdate)
        video.pause()
      }
      crossfadingRef.current = false
    }
  }, [active])

  const videoClass = 'absolute inset-0 h-full w-full object-cover will-change-[opacity]'

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020818] pointer-events-none" aria-hidden>
      <video ref={videoARef} src={BOOT_VIDEO} poster={BOOT_POSTER} className={videoClass} />
      <video ref={videoBRef} src={BOOT_VIDEO} className={videoClass} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/35" />
    </div>
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
    return sessionStorage.getItem(BOOT_SESSION_KEY) !== '1'
  })
  const [progress, setProgress] = useState(0)
  const [readyToEnter, setReadyToEnter] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false)

  useEffect(() => {
    if (!loading) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'video'
    link.href = BOOT_VIDEO
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#020818]"
        >
          <BootVideoBackground active={loading} />

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
