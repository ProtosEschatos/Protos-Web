'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import gsap from 'gsap'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'

export const BOOT_SESSION_KEY = 'protos-boot-gate-v7'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
const BOOT_BG = '/loader/boot-bg.jpg'

/** Soft bioluminescent pulses aligned to jellyfish in the artwork */
const JELLY_GLOWS = [
  { left: 11, top: 7, size: 22, delay: 0, duration: 3.2 },
  { left: 34, top: 48, size: 34, delay: 0.6, duration: 4.1 },
  { left: 56, top: 40, size: 16, delay: 1.2, duration: 2.8 },
  { left: 74, top: 8, size: 24, delay: 0.3, duration: 3.6 },
  { left: 16, top: 34, size: 14, delay: 1.8, duration: 3.0 },
  { left: 78, top: 58, size: 18, delay: 2.1, duration: 3.4 },
]

function BootLiveBackground({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!active || !rootRef.current) return

    const ctx = gsap.context(() => {
      const bg = rootRef.current!.querySelector<HTMLElement>('[data-boot-bg]')
      const rays = rootRef.current!.querySelector<HTMLElement>('[data-boot-rays]')
      const particles = rootRef.current!.querySelectorAll<HTMLElement>('[data-boot-particle]')
      const glows = rootRef.current!.querySelectorAll<HTMLElement>('[data-boot-glow]')

      if (bg) {
        gsap.set(bg, { scale: 1.04, force3D: true, transformOrigin: '50% 45%' })
        gsap.to(bg, {
          x: -18,
          y: -12,
          scale: 1.09,
          duration: 22,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (rays) {
        gsap.to(rays, {
          opacity: 0.55,
          y: 12,
          duration: 5.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      glows.forEach((el, i) => {
        const spec = JELLY_GLOWS[i]
        if (!spec) return
        gsap.to(el, {
          scale: 1.18,
          opacity: 0.85,
          duration: spec.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: spec.delay,
        })
      })

      particles.forEach((el, i) => {
        gsap.set(el, { y: 0, opacity: 0.15 + (i % 5) * 0.08 })
        gsap.to(el, {
          y: -120 - (i % 4) * 40,
          x: `random(-30, 30)`,
          opacity: 0,
          duration: 6 + (i % 6),
          ease: 'none',
          repeat: -1,
          delay: i * 0.35,
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [active])

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#020818]" />
      <div
        data-boot-bg
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${BOOT_BG})` }}
      />
      <div
        data-boot-rays
        className="absolute inset-x-0 top-0 h-[55%] opacity-40 will-change-transform"
        style={{
          background:
            'linear-gradient(180deg, rgba(186,230,253,0.22) 0%, rgba(34,211,238,0.08) 35%, transparent 100%)',
        }}
      />
      {JELLY_GLOWS.map((g, i) => (
        <div
          key={i}
          data-boot-glow
          className="absolute rounded-full opacity-50 will-change-transform mix-blend-screen blur-2xl"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: `${g.size}vmin`,
            height: `${g.size}vmin`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(103,232,249,0.55) 0%, rgba(34,211,238,0.15) 45%, transparent 70%)',
          }}
        />
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          data-boot-particle
          className="absolute rounded-full bg-cyan-200/80 will-change-transform"
          style={{
            left: `${4 + ((i * 17) % 92)}%`,
            top: `${55 + ((i * 11) % 40)}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            boxShadow: '0 0 6px rgba(103,232,249,0.8)',
          }}
        />
      ))}
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
    link.as = 'image'
    link.href = BOOT_BG
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
          <BootLiveBackground active={loading} />

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
