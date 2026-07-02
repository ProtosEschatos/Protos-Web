'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { acceptCookieConsent } from '@/lib/cookie-consent'

const SESSION_KEY = 'protos-boot-gate-v4'
const BOOT_BG = '/loader/boot-bg.jpg'

function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      t += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 4; i++) {
        const yBase = canvas.height * (0.25 + i * 0.14)
        ctx.beginPath()
        for (let x = 0; x <= canvas.width; x += 12) {
          const y =
            yBase +
            Math.sin(x * 0.004 + t * (1.2 + i * 0.25)) * 36 +
            Math.sin(x * 0.009 - t * 0.8) * 18
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const grad = ctx.createLinearGradient(0, yBase - 60, canvas.width, yBase + 60)
        grad.addColorStop(0, 'rgba(16, 185, 129, 0)')
        grad.addColorStop(0.45, `rgba(52, 211, 153, ${0.08 + i * 0.02})`)
        grad.addColorStop(0.7, `rgba(139, 92, 246, ${0.06 + i * 0.015})`)
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 28 + i * 6
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-50 mix-blend-screen" aria-hidden />
}

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
          {/* Animated aurora — behind loader, pointer-events none */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0 scale-110"
              animate={{ scale: [1.05, 1.14, 1.05], x: [0, -24, 12, 0], y: [0, -18, 8, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image src={BOOT_BG} alt="" fill priority className="object-cover object-center" sizes="100vw" aria-hidden />
            </motion.div>
            <AuroraCanvas />
            <div className="absolute inset-0 bg-[var(--dark)]/25" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--dark)]/45" />
          </div>

          {/* Original loader UI — on top */}
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

          {/* Cookie modal — same file, no extra component */}
          <AnimatePresence>
            {showCookieModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="cosmic-panel max-w-md w-full rounded-2xl border border-[var(--primary)]/30 p-8 shadow-2xl"
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
                    onClick={() => {
                      acceptCookieConsent()
                      finishBoot()
                    }}
                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold hover:-translate-y-0.5 transition-all duration-300"
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
