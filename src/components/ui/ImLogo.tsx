'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ImLogoProps {
  size?: number
  className?: string
  compact?: boolean
  dramatic?: boolean
}

/**
 * Brand "I'M":
 * - I  → cyan cosmic glow + particle swirl (effect from M-ref)
 * - '  → glowing apostrophe
 * - M  → metallic chrome + radial light-burst (effect from R-ref)
 * Letters are I and M only — source M/R glyphs are not shown.
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  const width = Math.round(size * (420 / 200))
  const cell = Math.round(size * 0.9)
  const letterPx = Math.round(size * 0.62)
  const raySpin = dramatic ? 8 : compact ? 16 : 12
  const pulse = dramatic ? 2.0 : compact ? 3.2 : 2.6

  const dust = [
    { x: '18%', y: '22%', d: 0 },
    { x: '72%', y: '28%', d: 0.3 },
    { x: '28%', y: '70%', d: 0.6 },
    { x: '68%', y: '68%', d: 0.9 },
    { x: '48%', y: '16%', d: 1.2 },
    { x: '12%', y: '48%', d: 1.5 },
  ]

  const rays = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * 360,
    thick: i % 3 === 0,
  }))

  return (
    <motion.span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] border border-[#5cc8ff]/85 bg-[#050b18] ${className}`}
      style={{ width, height: size }}
      initial={dramatic && !reduceMotion ? { opacity: 0, scale: 0.82 } : false}
      animate={dramatic && !reduceMotion ? { opacity: 1, scale: 1 } : undefined}
      transition={dramatic ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] } : undefined}
      whileHover={reduceMotion || dramatic ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion || dramatic ? undefined : { scale: 0.96 }}
      aria-label="I'M"
    >
      {!reduceMotion && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[22%]"
          animate={{
            boxShadow: [
              '0 0 8px rgba(92,200,255,0.3), inset 0 0 10px rgba(92,200,255,0.1)',
              '0 0 22px rgba(154,230,255,0.6), inset 0 0 18px rgba(92,200,255,0.2)',
              '0 0 8px rgba(92,200,255,0.3), inset 0 0 10px rgba(92,200,255,0.1)',
            ],
          }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      )}

      {/* ── I cell: swirl / cosmic glow ── */}
      <motion.span
        className="relative flex items-center justify-center"
        style={{ width: cell, height: cell }}
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.04, 1] }
        }
        transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(154,230,255,0.45)_0%,rgba(78,200,255,0.12)_45%,transparent_70%)]"
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.9, 0.45], scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-[18%] rounded-full border border-[#9ae6ff]/25"
            animate={{ rotate: 360 }}
            transition={{ duration: dramatic ? 6 : 10, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          />
        )}
        {!reduceMotion &&
          dust.map((p, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute z-[1] rounded-full bg-[#eaf8ff]"
              style={{ left: p.x, top: p.y, width: compact ? 2 : 3, height: compact ? 2 : 3 }}
              animate={{ opacity: [0.1, 1, 0.1], scale: [0.5, 1.5, 0.5], y: [0, -5, 0] }}
              transition={{
                duration: dramatic ? 1.5 : 2.3,
                delay: p.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden
            />
          ))}
        <motion.span
          className="relative z-[2] select-none font-black leading-none"
          style={{
            fontSize: letterPx,
            backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #c8efff 42%, #4ec8ff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter:
              'drop-shadow(0 0 6px rgba(120,210,255,1)) drop-shadow(0 0 16px rgba(92,200,255,0.85))',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.9, 1, 0.9] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        >
          I
        </motion.span>
      </motion.span>

      {/* Apostrophe */}
      <motion.span
        className="relative z-[3] mx-[0.5%] select-none font-semibold leading-none text-[#eaf8ff]"
        style={{
          fontSize: size * 0.38,
          textShadow: '0 0 8px rgba(184,236,255,1), 0 0 18px rgba(92,200,255,0.8)',
        }}
        animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6], y: [0, -2, 0] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        ’
      </motion.span>

      {/* ── M cell: metallic + light burst ── */}
      <motion.span
        className="relative flex items-center justify-center"
        style={{ width: cell, height: cell }}
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: pulse * 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      >
        <motion.span
          className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(180,220,255,0.2)_40%,transparent_68%)]"
          animate={reduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 z-[1]"
            animate={{ rotate: 360 }}
            transition={{ duration: raySpin, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          >
            {rays.map((r, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 origin-left bg-gradient-to-r from-white/80 to-transparent"
                style={{
                  width: '46%',
                  height: r.thick ? 1.6 : 0.7,
                  transform: `rotate(${r.angle}deg)`,
                  opacity: r.thick ? 0.6 : 0.28,
                }}
              />
            ))}
          </motion.span>
        )}
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute left-[6%] right-[6%] top-1/2 z-[2] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{ opacity: [0.2, 0.85, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        )}
        <motion.span
          className="relative z-[3] select-none font-black leading-none"
          style={{
            fontSize: letterPx,
            backgroundImage: 'linear-gradient(145deg, #ffffff 0%, #d7e6f5 38%, #6f95bb 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter:
              'drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(154,212,255,0.75))',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.9, 1, 0.9] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        >
          M
        </motion.span>
      </motion.span>
    </motion.span>
  )
}
