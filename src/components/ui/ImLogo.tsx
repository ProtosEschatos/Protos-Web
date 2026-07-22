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
 * Unified "I'M" wordmark — real upright letterforms (SVG <text>), not hand-broken paths.
 * I: cyan glow + dust · ': pulse · M: chrome + soft ray bloom
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
  const iGrad = `im-i-${uid}`
  const mGrad = `im-m-${uid}`
  const bloomI = `im-bi-${uid}`
  const bloomM = `im-bm-${uid}`
  const glow = `im-g-${uid}`

  const dust = [
    { x: 14, y: 16, d: 0 },
    { x: 34, y: 12, d: 0.4 },
    { x: 18, y: 48, d: 0.8 },
    { x: 38, y: 50, d: 1.1 },
  ]

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
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#d8e6f4" />
            <stop offset="100%" stopColor="#7ea0c4" />
          </linearGradient>
          <radialGradient id={bloomI} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ae6ff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#4ec8ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4ec8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={bloomM} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#cfe4ff" stopOpacity="0.18" />
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

        <motion.ellipse
          cx="30"
          cy="32"
          rx="20"
          ry="22"
          fill={`url(#${bloomI})`}
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        />
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
            transition={{ duration: dramatic ? 10 : 18, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2
              return (
                <line
                  key={i}
                  x1={82}
                  y1={32}
                  x2={82 + Math.cos(a) * 26}
                  y2={32 + Math.sin(a) * 26}
                  stroke="rgba(230,245,255,0.32)"
                  strokeWidth={i % 3 === 0 ? 1.1 : 0.45}
                  strokeLinecap="round"
                />
              )
            })}
          </motion.g>
        )}

        {!reduceMotion &&
          dust.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.1}
              fill="#eaf8ff"
              animate={{ opacity: [0.15, 1, 0.15], r: [0.6, 1.35, 0.6] }}
              transition={{
                duration: dramatic ? 1.6 : 2.4,
                delay: p.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* Real typography — upright I and M */}
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

        {!reduceMotion && (
          <motion.line
            x1="18"
            y1="32"
            x2="102"
            y2="32"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.6"
            animate={{ opacity: [0.06, 0.35, 0.06] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>
      <span className="sr-only">I&apos;M</span>
    </motion.span>
  )
}
