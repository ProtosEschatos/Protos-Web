'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ImLogoProps {
  size?: number
  className?: string
  compact?: boolean
  dramatic?: boolean
}

const SWIRL = '/brand/im-i-swirl.png'
const BURST = '/brand/im-m-burst.png'

/**
 * Animated I'M mark — real source plates + live motion.
 * (SVG-as-<img> CSS animations do not run in browsers; effects live here.)
 * I cell = swirl plate · ' · M cell = burst plate
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  const width = Math.round(size * (420 / 200))
  const cell = Math.round(size * 0.88)
  const raySpin = dramatic ? 8 : compact ? 16 : 12
  const pulse = dramatic ? 2.1 : compact ? 3.4 : 2.7

  const dust = [
    { x: '12%', y: '22%', d: 0 },
    { x: '28%', y: '18%', d: 0.35 },
    { x: '18%', y: '68%', d: 0.7 },
    { x: '32%', y: '74%', d: 1.05 },
    { x: '8%', y: '48%', d: 1.4 },
  ]

  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360
    return { angle, thick: i % 3 === 0 }
  })

  return (
    <motion.span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] border border-[#5cc8ff]/80 bg-[#050b18] ${className}`}
      style={{
        width,
        height: size,
        boxShadow: '0 0 0 1px rgba(92,200,255,0.18) inset',
      }}
      initial={dramatic && !reduceMotion ? { opacity: 0, scale: 0.82, filter: 'brightness(0.6)' } : false}
      animate={
        dramatic && !reduceMotion
          ? { opacity: 1, scale: 1, filter: 'brightness(1)' }
          : undefined
      }
      transition={dramatic ? { duration: 0.95, ease: [0.22, 1, 0.36, 1] } : undefined}
      whileHover={reduceMotion || dramatic ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion || dramatic ? undefined : { scale: 0.96 }}
      aria-label="I'M"
    >
      {/* ambient glow */}
      {!reduceMotion && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[22%]"
          animate={{
            boxShadow: [
              '0 0 10px rgba(92,200,255,0.25), inset 0 0 12px rgba(92,200,255,0.08)',
              '0 0 22px rgba(154,230,255,0.55), inset 0 0 18px rgba(92,200,255,0.18)',
              '0 0 10px rgba(92,200,255,0.25), inset 0 0 12px rgba(92,200,255,0.08)',
            ],
          }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      )}

      {/* I / swirl cell */}
      <motion.span
        className="relative flex items-center justify-center"
        style={{ width: cell, height: cell }}
        animate={
          reduceMotion
            ? undefined
            : {
                filter: [
                  'drop-shadow(0 0 4px rgba(92,200,255,0.45))',
                  'drop-shadow(0 0 14px rgba(154,230,255,0.95))',
                  'drop-shadow(0 0 4px rgba(92,200,255,0.45))',
                ],
                scale: [1, 1.04, 1],
              }
        }
        transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={SWIRL}
          alt=""
          width={cell}
          height={cell}
          draggable={false}
          className="h-full w-full select-none object-contain"
          animate={reduceMotion ? undefined : { rotate: [0, 2.5, -2, 0] }}
          transition={{ duration: dramatic ? 5 : 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!reduceMotion &&
          dust.map((p, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute rounded-full bg-[#eaf8ff]"
              style={{
                left: p.x,
                top: p.y,
                width: compact ? 2 : 3,
                height: compact ? 2 : 3,
              }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.4, 0.6], y: [0, -4, 0] }}
              transition={{
                duration: dramatic ? 1.6 : 2.4,
                delay: p.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden
            />
          ))}
      </motion.span>

      {/* Apostrophe */}
      <motion.span
        className="relative z-[1] mx-[-2%] select-none font-semibold leading-none text-[#eaf8ff]"
        style={{
          fontSize: size * 0.42,
          textShadow: '0 0 8px rgba(184,236,255,0.95), 0 0 16px rgba(92,200,255,0.7)',
        }}
        animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65], y: [0, -1.5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        ’
      </motion.span>

      {/* M / burst cell */}
      <motion.span
        className="relative flex items-center justify-center"
        style={{ width: cell, height: cell }}
        animate={
          reduceMotion
            ? undefined
            : {
                filter: [
                  'drop-shadow(0 0 4px rgba(255,255,255,0.35))',
                  'drop-shadow(0 0 16px rgba(255,255,255,0.85))',
                  'drop-shadow(0 0 4px rgba(255,255,255,0.35))',
                ],
                scale: [1, 1.045, 1],
              }
        }
        transition={{ duration: pulse * 0.92, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      >
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: raySpin, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          >
            {rays.map((r, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 origin-left bg-gradient-to-r from-white/70 to-transparent"
                style={{
                  width: '48%',
                  height: r.thick ? 1.5 : 0.7,
                  transform: `rotate(${r.angle}deg)`,
                  opacity: r.thick ? 0.55 : 0.28,
                }}
              />
            ))}
          </motion.span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={BURST}
          alt=""
          width={cell}
          height={cell}
          draggable={false}
          className="relative z-[1] h-full w-full select-none object-contain"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.92, 1, 0.92], scale: [1, 1.02, 1] }
          }
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 z-[2] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{ opacity: [0.15, 0.75, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        )}
      </motion.span>
    </motion.span>
  )
}
