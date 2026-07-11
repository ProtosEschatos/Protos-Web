'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

type Phase = 'entry' | 'magnetism' | 'orbit' | 'impact' | 'nebula' | 'welcome' | 'enter'

const TIMELINE: Array<{ phase: Phase; at: number }> = [
  { phase: 'entry', at: 0 },
  { phase: 'magnetism', at: 500 },
  { phase: 'orbit', at: 1000 },
  { phase: 'impact', at: 3500 },
  { phase: 'nebula', at: 4000 },
  { phase: 'welcome', at: 4500 },
  { phase: 'enter', at: 5000 },
]

function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

type BootScreenProps = {
  onEnter: () => void
  onEnterReady?: () => void
}

export default function BootScreen({ onEnter, onEnterReady }: BootScreenProps) {
  const t = useTranslations('loader')
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduceMotion ? 'welcome' : 'entry')
  const enterReadyRef = useRef(false)

  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        left: seeded(i * 3.17) * 100,
        top: seeded(i * 7.91) * 100,
        size: seeded(i * 2.43) * 2 + 0.5,
        opacity: 0.3 + seeded(i * 5.11) * 0.6,
        duration: 2 + seeded(i * 1.73) * 4,
        delay: seeded(i * 4.29) * 3,
      })),
    [],
  )

  const impactParticles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        angle: (i / 60) * Math.PI * 2,
        distance: 200 + seeded(i * 9.13) * 400,
        isGreen: i % 2 === 0,
      })),
    [],
  )

  const nebulaDust = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        angle: seeded(i * 6.37) * Math.PI * 2,
        radius: 150 + seeded(i * 3.89) * 350,
        color: i % 3 === 0 ? '#a855f7' : i % 2 ? '#39ff14' : '#ff8c00',
        duration: 2 + seeded(i * 2.17) * 3,
        delay: seeded(i * 8.41) * 2,
      })),
    [],
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

    const timers = TIMELINE.map(({ phase: nextPhase, at }) =>
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

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-gradient-to-br from-[#020308] via-[#050815] to-[#020308]">
      <div className="absolute inset-0" aria-hidden>
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showOrbs && (
          <motion.div
            key="orbs"
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <motion.div
                className="absolute h-20 w-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #ffffff 0%, #39ff14 35%, transparent 100%)',
                  boxShadow: '0 0 60px #39ff14, 0 0 120px rgba(57,255,20,0.6)',
                }}
                initial={{ x: 1200, y: -300, opacity: 0 }}
                animate={
                  phase === 'entry'
                    ? { x: 250, y: -200, opacity: 1 }
                    : phase === 'magnetism'
                      ? { x: 50, y: 0, opacity: 1 }
                      : { x: [0, 200, 0, -200, 0], y: [0, -100, 0, 100, 0] }
                }
                transition={
                  phase === 'orbit'
                    ? { duration: 2.5, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.5, ease: 'easeOut' }
                }
              />

              <motion.div
                className="absolute h-16 w-16 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #ffffff 0%, #ff8c00 35%, transparent 100%)',
                  boxShadow: '0 0 60px #ff8c00, 0 0 120px rgba(255,140,0,0.6)',
                }}
                initial={{ x: -1200, y: 300, opacity: 0 }}
                animate={
                  phase === 'entry'
                    ? { x: -250, y: 200, opacity: 1 }
                    : phase === 'magnetism'
                      ? { x: -50, y: 0, opacity: 1 }
                      : { x: [0, -200, 0, 200, 0], y: [0, 100, 0, -100, 0] }
                }
                transition={
                  phase === 'orbit'
                    ? { duration: 2.5, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.5, ease: 'easeOut' }
                }
              />

              {phase === 'magnetism' && (
                <motion.div
                  className="absolute h-40 w-1"
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
        {phase === 'impact' && (
          <motion.div key="impact" className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute h-40 w-40 rounded-full"
              style={{
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
                  className="absolute h-2 w-2 rounded-full"
                  style={{
                    background: particle.isGreen ? '#39ff14' : '#ff8c00',
                    boxShadow: '0 0 20px currentColor',
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white"
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
            className="absolute inset-0"
          >
            <motion.div
              className="absolute left-1/2 top-1/2 h-[min(55vw,400px)] w-[min(85vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(156, 81, 255, 0.6) 0%, rgba(180, 100, 255, 0.3) 30%, rgba(139, 92, 246, 0.15) 60%, transparent 80%)',
                filter: 'blur(40px)',
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(168, 85, 247, 0.6) 60%, transparent 80%)',
                filter: 'blur(20px)',
              }}
              animate={{ scale: [1, 1.3, 1] }}
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
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
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
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <motion.h1
              className="text-center text-4xl font-extralight tracking-wide text-white sm:text-5xl md:text-7xl lg:text-8xl"
              style={{
                background: 'linear-gradient(90deg, #39ff14, #ffffff, #a855f7, #ff8c00)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter:
                  'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 50px rgba(57, 255, 20, 0.3))',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              {t('welcome')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-6 text-xs uppercase tracking-[0.5em] text-white/50"
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
            className="group absolute bottom-16 left-1/2 -translate-x-1/2 overflow-hidden rounded-full px-16 py-5 text-sm font-semibold tracking-[0.5em] text-white sm:bottom-24 sm:px-20"
            style={{
              background:
                'linear-gradient(90deg, rgba(57,255,20,0.12), rgba(168,85,247,0.12), rgba(255,140,0,0.12))',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 0 50px rgba(168,85,247,0.3), 0 0 100px rgba(57,255,20,0.2), 0 0 150px rgba(255,140,0,0.15)',
            }}
          >
            <span className="relative z-10">{t('enterCta')}</span>
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
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
