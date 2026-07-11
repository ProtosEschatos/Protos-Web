'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

type Phase = 'entry' | 'magnetism' | 'orbit' | 'impact' | 'nebula' | 'welcome' | 'enter'
type VisualTier = 'full' | 'lite' | 'minimal'

const PHASE_TIMELINE: Array<{ phase: Phase; at: number }> = [
  { phase: 'entry', at: 0 },
  { phase: 'magnetism', at: 500 },
  { phase: 'orbit', at: 1000 },
  { phase: 'impact', at: 3500 },
  { phase: 'nebula', at: 4000 },
  { phase: 'welcome', at: 4500 },
  { phase: 'enter', at: 5000 },
]

const TIER_COUNTS = {
  full: { stars: 180, impact: 56, dust: 36 },
  lite: { stars: 90, impact: 28, dust: 18 },
  minimal: { stars: 48, impact: 0, dust: 0 },
} as const

function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function resolveVisualTier(reduceMotion: boolean | null, width: number): VisualTier {
  if (reduceMotion) return 'minimal'
  if (width < 768) return 'lite'
  return 'full'
}

function useBootLayout() {
  const reduceMotion = useReducedMotion()
  const [layout, setLayout] = useState({
    tier: 'lite' as VisualTier,
    scale: 0.85,
    entryOff: 900,
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const minDim = Math.min(w, h)
      const scale = Math.max(0.55, Math.min(1, minDim / 820))
      setLayout({
        tier: resolveVisualTier(reduceMotion, w),
        scale,
        entryOff: Math.max(w, h) + 120,
      })
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [reduceMotion])

  return { reduceMotion: !!reduceMotion, ...layout }
}

type BootScreenProps = {
  onEnter: () => void
  onEnterReady?: () => void
  /** When true, renders as overlay inside PageLoader (video visible underneath). */
  embedded?: boolean
}

export default function BootScreen({ onEnter, onEnterReady, embedded = false }: BootScreenProps) {
  const t = useTranslations('loader')
  const { reduceMotion, tier, scale, entryOff } = useBootLayout()
  const [phase, setPhase] = useState<Phase>(reduceMotion ? 'welcome' : 'entry')
  const enterReadyRef = useRef(false)

  const counts = TIER_COUNTS[tier]
  const orbitX = Math.round(200 * scale)
  const orbitY = Math.round(100 * scale)
  const magnetX = Math.round(50 * scale)
  const entryNearX = Math.round(250 * scale)
  const entryNearY = Math.round(200 * scale)
  const orbGreen = Math.max(48, Math.round(80 * scale))
  const orbOrange = Math.max(40, Math.round(64 * scale))
  const impactDistance = Math.round(180 + 220 * scale)

  const stars = useMemo(
    () =>
      Array.from({ length: counts.stars }, (_, i) => ({
        left: seeded(i * 3.17) * 100,
        top: seeded(i * 7.91) * 100,
        size: seeded(i * 2.43) * 2 + 0.5,
        opacity: 0.3 + seeded(i * 5.11) * 0.6,
        duration: 2 + seeded(i * 1.73) * 4,
        delay: seeded(i * 4.29) * 3,
      })),
    [counts.stars],
  )

  const impactParticles = useMemo(
    () =>
      Array.from({ length: counts.impact }, (_, i) => ({
        angle: (i / Math.max(counts.impact, 1)) * Math.PI * 2,
        distance: impactDistance * (0.45 + seeded(i * 9.13) * 0.55),
        isGreen: i % 2 === 0,
      })),
    [counts.impact, impactDistance],
  )

  const nebulaDust = useMemo(
    () =>
      Array.from({ length: counts.dust }, (_, i) => ({
        angle: seeded(i * 6.37) * Math.PI * 2,
        radius: (120 + seeded(i * 3.89) * 280) * scale,
        color: i % 3 === 0 ? '#a855f7' : i % 2 ? '#39ff14' : '#ff8c00',
        duration: 2 + seeded(i * 2.17) * 3,
        delay: seeded(i * 8.41) * 2,
      })),
    [counts.dust, scale],
  )

  useEffect(() => {
    if (reduceMotion) {
      const welcomeTimer = window.setTimeout(() => setPhase('welcome'), 0)
      const enterTimer = window.setTimeout(() => setPhase('enter'), 400)
      return () => {
        window.clearTimeout(welcomeTimer)
        window.clearTimeout(enterTimer)
      }
    }

    const timers = PHASE_TIMELINE.map(({ phase: nextPhase, at }) =>
      window.setTimeout(() => setPhase(nextPhase), at),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [reduceMotion])

  useEffect(() => {
    if (phase === 'enter' && !enterReadyRef.current) {
      enterReadyRef.current = true
      onEnterReady?.()
    }
  }, [phase, onEnterReady])

  const showOrbs = phase === 'entry' || phase === 'magnetism' || phase === 'orbit'
  const showNebula = phase === 'nebula' || phase === 'welcome' || phase === 'enter'
  const showWelcome = phase === 'welcome' || phase === 'enter'
  const animateStars = !reduceMotion && tier !== 'minimal'

  return (
    <div
      className={
        embedded
          ? 'absolute inset-0 touch-none overscroll-none overflow-hidden bg-transparent [min-height:100dvh] [min-width:100dvw]'
          : 'fixed inset-0 z-[99999] touch-none overscroll-none overflow-hidden bg-gradient-to-br from-[#020308] via-[#050815] to-[#020308] [min-height:100dvh] [min-width:100dvw]'
      }
      role="dialog"
      aria-modal="true"
      aria-label={t('welcome')}
      aria-live="polite"
    >
      <div className="absolute inset-0 [contain:paint]" aria-hidden>
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white [transform:translateZ(0)]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
            animate={animateStars ? { opacity: [0.3, 1, 0.3] } : undefined}
            transition={
              animateStars
                ? {
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                  }
                : undefined
            }
          />
        ))}
      </div>

      <AnimatePresence>
        {showOrbs && (
          <motion.div
            key="orbs"
            className="absolute inset-0 flex items-center justify-center [contain:layout]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative flex h-full w-full max-w-[100vw] items-center justify-center overflow-hidden">
              <motion.div
                className="absolute rounded-full [transform:translateZ(0)]"
                style={{
                  width: orbGreen,
                  height: orbGreen,
                  background: 'radial-gradient(circle, #ffffff 0%, #39ff14 35%, transparent 100%)',
                  boxShadow: '0 0 60px #39ff14, 0 0 120px rgba(57,255,20,0.6)',
                }}
                initial={{ x: entryOff, y: -entryNearY, opacity: 0 }}
                animate={
                  phase === 'entry'
                    ? { x: entryNearX, y: -entryNearY, opacity: 1 }
                    : phase === 'magnetism'
                      ? { x: magnetX, y: 0, opacity: 1 }
                      : { x: [0, orbitX, 0, -orbitX, 0], y: [0, -orbitY, 0, orbitY, 0] }
                }
                transition={
                  phase === 'orbit'
                    ? { duration: 2.5, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.5, ease: 'easeOut' }
                }
              />

              <motion.div
                className="absolute rounded-full [transform:translateZ(0)]"
                style={{
                  width: orbOrange,
                  height: orbOrange,
                  background: 'radial-gradient(circle, #ffffff 0%, #ff8c00 35%, transparent 100%)',
                  boxShadow: '0 0 60px #ff8c00, 0 0 120px rgba(255,140,0,0.6)',
                }}
                initial={{ x: -entryOff, y: entryNearY, opacity: 0 }}
                animate={
                  phase === 'entry'
                    ? { x: -entryNearX, y: entryNearY, opacity: 1 }
                    : phase === 'magnetism'
                      ? { x: -magnetX, y: 0, opacity: 1 }
                      : { x: [0, -orbitX, 0, orbitX, 0], y: [0, orbitY, 0, -orbitY, 0] }
                }
                transition={
                  phase === 'orbit'
                    ? { duration: 2.5, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.5, ease: 'easeOut' }
                }
              />

              {phase === 'magnetism' && (
                <motion.div
                  className="absolute h-32 w-1 sm:h-40"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, #39ff14, #ff8c00, transparent)',
                    boxShadow: '0 0 30px white',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'impact' && counts.impact > 0 && (
          <motion.div key="impact" className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute rounded-full [transform:translateZ(0)]"
              style={{
                width: Math.round(160 * scale),
                height: Math.round(160 * scale),
                background:
                  'radial-gradient(circle, #ffffff 0%, #39ff14 25%, #ff8c00 50%, transparent 80%)',
                boxShadow: '0 0 300px white, 0 0 600px #39ff14, 0 0 900px #ff8c00',
              }}
            />

            <div className="absolute left-1/2 top-1/2">
              {impactParticles.map((particle, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(particle.angle) * particle.distance,
                    y: Math.sin(particle.angle) * particle.distance,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
                  style={{
                    background: particle.isGreen ? '#39ff14' : '#ff8c00',
                    boxShadow: '0 0 20px currentColor',
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0] }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(168,85,247,0.45) 0%, rgba(57,255,20,0.25) 35%, rgba(255,140,0,0.15) 55%, transparent 75%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNebula && (
          <motion.div
            key="nebula"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 [contain:paint]"
          >
            <motion.div
              className="absolute left-1/2 top-1/2 h-[min(55vw,400px)] w-[min(92vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full [transform:translateZ(0)]"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(156, 81, 255, 0.6) 0%, rgba(180, 100, 255, 0.3) 30%, rgba(139, 92, 246, 0.15) 60%, transparent 80%)',
                filter: 'blur(40px)',
                WebkitFilter: 'blur(40px)',
              }}
              animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-32 sm:w-32 [transform:translateZ(0)]"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(168, 85, 247, 0.6) 60%, transparent 80%)',
                filter: 'blur(20px)',
                WebkitFilter: 'blur(20px)',
              }}
              animate={reduceMotion ? undefined : { scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {nebulaDust.map((dust, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
                style={{
                  x: Math.cos(dust.angle) * dust.radius,
                  y: Math.sin(dust.angle) * dust.radius,
                  background: dust.color,
                  boxShadow: '0 0 10px currentColor',
                }}
                animate={reduceMotion ? undefined : { opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{
                  duration: dust.duration,
                  repeat: Infinity,
                  delay: dust.delay,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pb-32"
          >
            <motion.h1
              className="max-w-[14ch] text-balance text-center text-[clamp(1.65rem,7.5vw,4.5rem)] font-extralight leading-[1.08] tracking-wide text-white sm:max-w-none"
              style={{
                background: 'linear-gradient(90deg, #39ff14, #ffffff, #a855f7, #ff8c00)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              {t('welcome')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-4 max-w-xs text-center text-[10px] uppercase tracking-[0.28em] text-white/50 sm:mt-6 sm:max-w-none sm:text-xs sm:tracking-[0.5em]"
            >
              {t('welcomeTagline')}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'enter' && (
          <motion.button
            key="enter"
            type="button"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            onClick={onEnter}
            className="group absolute left-1/2 min-h-12 min-w-[11rem] -translate-x-1/2 touch-manipulation overflow-hidden rounded-full px-10 py-4 text-sm font-semibold tracking-[0.35em] text-white sm:min-h-[3.25rem] sm:min-w-[12rem] sm:px-20 sm:py-5 sm:tracking-[0.5em]"
            style={{
              bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              background:
                'linear-gradient(90deg, rgba(57,255,20,0.12), rgba(168,85,247,0.12), rgba(255,140,0,0.12))',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow:
                '0 0 50px rgba(168,85,247,0.3), 0 0 100px rgba(57,255,20,0.2), 0 0 150px rgba(255,140,0,0.15)',
            }}
          >
            <span className="relative z-10">{t('enterCta')}</span>
            {!reduceMotion && (
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(90deg, rgba(57,255,20,0.3), rgba(168,85,247,0.3), rgba(255,140,0,0.3))',
                    'linear-gradient(90deg, rgba(255,140,0,0.3), rgba(57,255,20,0.3), rgba(168,85,247,0.3))',
                    'linear-gradient(90deg, rgba(168,85,247,0.3), rgba(255,140,0,0.3), rgba(57,255,20,0.3))',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ mixBlendMode: 'overlay', opacity: 0.5 }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
