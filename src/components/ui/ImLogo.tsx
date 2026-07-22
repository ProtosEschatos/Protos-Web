'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

interface ImLogoProps {
  size?: number
  className?: string
  compact?: boolean
  dramatic?: boolean
}

/**
 * I'M — real upright text glyphs only.
 * Effects from refs: I = cyan swirl/particles · M = chrome + light-burst rays.
 * No letter redesign.
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const width = Math.round(size * 1.55)
  const pulse = dramatic ? 2.2 : compact ? 3.4 : 2.8
  const raySpin = dramatic ? 9 : compact ? 16 : 12
  const iGrad = `im-i-${uid}`
  const mGrad = `im-m-${uid}`
  const bloomI = `im-bi-${uid}`
  const bloomM = `im-bm-${uid}`
  const glow = `im-g-${uid}`

  const dust = [
    { x: 14, y: 16, d: 0 },
    { x: 34, y: 12, d: 0.35 },
    { x: 12, y: 38, d: 0.55 },
    { x: 38, y: 44, d: 0.8 },
    { x: 22, y: 50, d: 1.0 },
    { x: 42, y: 28, d: 1.2 },
  ]

  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    return {
      x2: 82 + Math.cos(a) * (22 + (i % 3) * 4),
      y2: 32 + Math.sin(a) * (22 + (i % 3) * 4),
      w: i % 3 === 0 ? 1.15 : 0.45,
      o: 0.28 + (i % 4) * 0.1,
    }
  })

  return (
    <motion.span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width, height: size }}
      initial={dramatic && !reduceMotion ? { opacity: 0, scale: 0.88, y: 6 } : false}
      animate={dramatic && !reduceMotion ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={dramatic ? { duration: 0.85, ease: [0.22, 1, 0.36, 1] } : undefined}
      whileHover={reduceMotion || dramatic ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion || dramatic ? undefined : { scale: 0.97 }}
      aria-label="I'M"
    >
      <svg
        viewBox="0 0 120 64"
        width={width}
        height={size}
        className="overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={iGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#c8efff" />
            <stop offset="100%" stopColor="#4ec8ff" />
          </linearGradient>
          <linearGradient id={mGrad} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7fbff" />
            <stop offset="35%" stopColor="#d8e6f4" />
            <stop offset="70%" stopColor="#8eafd2" />
            <stop offset="100%" stopColor="#5f87b0" />
          </linearGradient>
          <radialGradient id={bloomI} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ae6ff" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#4ec8ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4ec8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={bloomM} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#cfe4ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#cfe4ff" stopOpacity="0" />
          </radialGradient>
          <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="1"
          y="1"
          width="118"
          height="62"
          rx="14"
          fill="#050b18"
          stroke="#5cc8ff"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />

        {/* I effects: glow + swirl + particles */}
        <motion.ellipse
          cx="30"
          cy="32"
          rx="20"
          ry="22"
          fill={`url(#${bloomI})`}
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!reduceMotion && (
          <motion.path
            d="M10 46 C18 34, 24 26, 30 18 S42 10, 44 22"
            fill="none"
            stroke="rgba(180,230,255,0.55)"
            strokeWidth="1.35"
            strokeLinecap="round"
            animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.25, 0.85, 0.25] }}
            transition={{ duration: dramatic ? 3 : 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {!reduceMotion &&
          dust.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.05}
              fill="#eaf8ff"
              animate={{ opacity: [0.12, 1, 0.12], r: [0.55, 1.35, 0.55] }}
              transition={{
                duration: dramatic ? 1.6 : 2.4,
                delay: p.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* M effects: bloom + rotating rays */}
        <motion.ellipse
          cx="82"
          cy="32"
          rx="28"
          ry="24"
          fill={`url(#${bloomM})`}
          animate={reduceMotion ? undefined : { opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        {!reduceMotion && (
          <motion.g
            style={{ transformOrigin: '82px 32px', transformBox: 'view-box' }}
            animate={{ rotate: 360 }}
            transition={{ duration: raySpin, repeat: Infinity, ease: 'linear' }}
          >
            {rays.map((r, i) => (
              <line
                key={i}
                x1={82}
                y1={32}
                x2={r.x2}
                y2={r.y2}
                stroke="rgba(230,245,255,0.5)"
                strokeWidth={r.w}
                opacity={r.o}
                strokeLinecap="round"
              />
            ))}
          </motion.g>
        )}

        {/* Real typography — upright I ' M only */}
        <motion.text
          x="30"
          y="44"
          textAnchor="middle"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="36"
          fill={`url(#${iGrad})`}
          filter={`url(#${glow})`}
          style={{
            filter:
              'drop-shadow(0 0 4px rgba(120,210,255,0.95)) drop-shadow(0 0 10px rgba(92,200,255,0.55))',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        >
          I
        </motion.text>

        <motion.text
          x="48"
          y="28"
          textAnchor="middle"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="20"
          fill="#eaf8ff"
          animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(180,230,255,0.95))' }}
        >
          ’
        </motion.text>

        <motion.text
          x="82"
          y="44"
          textAnchor="middle"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="36"
          fill={`url(#${mGrad})`}
          filter={`url(#${glow})`}
          style={{
            filter:
              'drop-shadow(0 0 4px rgba(255,255,255,0.75)) drop-shadow(0 0 10px rgba(160,210,255,0.45))',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        >
          M
        </motion.text>
      </svg>
      <span className="sr-only">I&apos;M</span>
    </motion.span>
  )
}
