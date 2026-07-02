'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import gsap from 'gsap'
import { saveCookiePreferences } from '@/lib/cookie-consent'
import { buildLocalePath } from '@/lib/seo'

export const BOOT_SESSION_KEY = 'protos-boot-gate-v5'
export const BOOT_COMPLETE_EVENT = 'protos-boot-complete'
const BOOT_BG = '/loader/boot-bg.jpg'

type JellyfishSpec = {
  id: string
  w: number
  top: string
  duration: number
  delay: number
  from: 'left' | 'right'
  wobble: number
}

const JELLYFISH: JellyfishSpec[] = [
  { id: 'a', w: 92, top: '14%', duration: 19, delay: 0, from: 'left', wobble: 36 },
  { id: 'b', w: 118, top: '6%', duration: 24, delay: 3, from: 'right', wobble: 48 },
  { id: 'c', w: 68, top: '28%', duration: 16, delay: 6, from: 'left', wobble: 28 },
  { id: 'd', w: 84, top: '52%', duration: 21, delay: 2, from: 'right', wobble: 40 },
  { id: 'e', w: 96, top: '44%', duration: 18, delay: 8, from: 'left', wobble: 32 },
  { id: 'f', w: 58, top: '68%', duration: 14, delay: 5, from: 'right', wobble: 24 },
  { id: 'g', w: 74, top: '78%', duration: 20, delay: 10, from: 'left', wobble: 30 },
]

const TENTACLE_X = [22, 34, 50, 66, 78]

function BootJellyfishLayer({ active }: { active: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!active || !layerRef.current) return

    const ctx = gsap.context(() => {
      JELLYFISH.forEach((spec) => {
        const root = layerRef.current!.querySelector<HTMLElement>(`[data-jf-id="${spec.id}"]`)
        const body = root?.querySelector<HTMLElement>('[data-jf-body]')
        const tentacles = root?.querySelector<HTMLElement>('[data-jf-tentacles]')
        if (!root || !body || !tentacles) return

        const swimRight = spec.from === 'left'
        const travel = swimRight ? '135vw' : '-135vw'

        gsap.set(root, { x: 0, y: 0, force3D: true })
        gsap.set(body, { transformOrigin: '50% 28%', force3D: true })
        gsap.set(tentacles, { transformOrigin: '50px 52px', force3D: true })

        gsap.to(root, {
          x: travel,
          duration: spec.duration,
          ease: 'none',
          repeat: -1,
          delay: spec.delay,
        })

        gsap.to(root, {
          y: -spec.wobble,
          duration: spec.duration * 0.28,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: spec.delay,
        })

        gsap.to(body, {
          scaleY: 0.68,
          scaleX: 1.12,
          rotate: swimRight ? -4 : 4,
          duration: 0.42,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        })

        gsap.to(tentacles, {
          rotate: 8,
          x: 3,
          duration: 0.35,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        TENTACLE_X.forEach((x, i) => {
          const tentacle = tentacles.querySelector<SVGPathElement>(`[data-jf-t="${x}"]`)
          if (!tentacle) return
          gsap.to(tentacle, {
            attr: {
              d: `M${x} 52 Q${x + (i % 2 === 0 ? -8 : 8)} 96 ${x + (i % 2 === 0 ? 8 : -8)} 128`,
            },
            duration: 0.45 + i * 0.03,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.05,
          })
        })
      })
    }, layerRef)

    return () => ctx.revert()
  }, [active])

  if (!active) return null

  return (
    <div ref={layerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {JELLYFISH.map((spec) => {
        const swimRight = spec.from === 'left'
        const gradId = `jf-${spec.id}`

        return (
          <div
            key={spec.id}
            data-jf-id={spec.id}
            className="absolute will-change-transform"
            style={{
              top: spec.top,
              width: spec.w,
              left: swimRight ? '-18vw' : undefined,
              right: swimRight ? undefined : '-18vw',
            }}
          >
            <div data-jf-body>
              <svg
                viewBox="0 0 100 130"
                className="w-full h-auto drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                style={{ transform: swimRight ? 'scaleX(1)' : 'scaleX(-1)' }}
              >
                <defs>
                  <radialGradient id={gradId} cx="50%" cy="35%" r="55%">
                    <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="50" cy="32" rx="36" ry="26" fill={`url(#${gradId})`} />
                <g data-jf-tentacles>
                  {TENTACLE_X.map((x, i) => (
                    <path
                      key={x}
                      data-jf-t={`${x}`}
                      d={`M${x} 52 Q${x + (i % 2 === 0 ? 10 : -10)} 92 ${x + (i % 2 === 0 ? -6 : 6)} 128`}
                      stroke="rgba(103,232,249,0.6)"
                      strokeWidth="1.8"
                      fill="none"
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        )
      })}
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
          style={{
            backgroundImage: `url(${BOOT_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <BootJellyfishLayer active={loading} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#020818]/15" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/45" />
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
