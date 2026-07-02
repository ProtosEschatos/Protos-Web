'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import gsap from 'gsap'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'

export const BOOT_SESSION_KEY = 'protos-boot-gate-v6'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
const BOOT_BASE = '/loader/boot-bg-base.jpg'

type ImageJellyfishSpec = {
  id: string
  src: string
  left: number
  top: number
  width: number
  height: number
  driftX: number
  driftY: number
  rotate: number
  duration: number
  delay: number
  pulse: number
}

const IMAGE_JELLYFISH: ImageJellyfishSpec[] = [
  { id: 'jf-1', src: '/loader/jf-1.png', left: 2, top: 2, width: 20, height: 28, driftX: 36, driftY: 22, rotate: 6, duration: 11, delay: 0, pulse: 0.07 },
  { id: 'jf-2', src: '/loader/jf-2.png', left: 18, top: 30, width: 32, height: 62, driftX: 52, driftY: 38, rotate: 5, duration: 16, delay: 0.8, pulse: 0.09 },
  { id: 'jf-3', src: '/loader/jf-3.png', left: 48, top: 42, width: 18, height: 28, driftX: 40, driftY: 26, rotate: 8, duration: 10, delay: 2.2, pulse: 0.06 },
  { id: 'jf-4', src: '/loader/jf-4.png', left: 62, top: 2, width: 28, height: 32, driftX: -44, driftY: 24, rotate: 7, duration: 13, delay: 1.4, pulse: 0.08 },
  { id: 'jf-5', src: '/loader/jf-5.png', left: 10, top: 28, width: 16, height: 22, driftX: 30, driftY: 20, rotate: 6, duration: 9, delay: 3, pulse: 0.06 },
  { id: 'jf-6', src: '/loader/jf-6.png', left: 72, top: 55, width: 22, height: 30, driftX: -38, driftY: 28, rotate: 9, duration: 12, delay: 2.6, pulse: 0.07 },
]

function BootBackgroundStage({ active }: { active: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!active || !stageRef.current) return

    const ctx = gsap.context(() => {
      IMAGE_JELLYFISH.forEach((spec) => {
        const el = stageRef.current!.querySelector<HTMLElement>(`[data-jf-id="${spec.id}"]`)
        if (!el) return

        gsap.set(el, { x: 0, y: 0, rotate: 0, force3D: true, transformOrigin: '50% 18%' })

        gsap.to(el, {
          x: spec.driftX,
          y: -spec.driftY,
          rotate: spec.rotate,
          duration: spec.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: spec.delay,
        })

        gsap.to(el, {
          scaleY: 1 + spec.pulse,
          scaleX: 1 - spec.pulse * 0.35,
          duration: 0.55,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: spec.delay * 0.4,
        })

        gsap.to(el, {
          filter: 'brightness(1.12)',
          duration: 1.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: spec.delay,
        })
      })
    }, stageRef)

    return () => ctx.revert()
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'max(100vw, 177.78vh)',
          height: 'max(100vh, 56.25vw)',
        }}
      >
        <div ref={stageRef} className="relative h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${BOOT_BASE})` }}>
          {IMAGE_JELLYFISH.map((spec) => (
            <div
              key={spec.id}
              data-jf-id={spec.id}
              className="absolute will-change-transform"
              style={{
                left: `${spec.left}%`,
                top: `${spec.top}%`,
                width: `${spec.width}%`,
                height: `${spec.height}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spec.src} alt="" className="h-full w-full object-contain object-left-top" draggable={false} />
            </div>
          ))}
        </div>
      </div>
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
    ;[BOOT_BASE, ...IMAGE_JELLYFISH.map((j) => j.src)].forEach((href) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      document.head.appendChild(link)
    })
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
          <BootBackgroundStage active={loading} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#020818]/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/40" />
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
