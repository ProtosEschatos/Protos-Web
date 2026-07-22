'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ImLogoProps {
  size?: number
  className?: string
  compact?: boolean
  dramatic?: boolean
}

/**
 * Unified "I'M" wordmark — one mark, tight tracking.
 * I: cyan glow + dust · ': soft pulse · M: chrome + soft ray bloom
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  // Tighter aspect — reads as one word, not two tiles.
  const width = Math.round(size * 1.55)
  const pulse = dramatic ? 2.2 : compact ? 3.4 : 2.8

  const dust = [
    { x: 0.08, y: 0.22, d: 0 },
    { x: 0.22, y: 0.18, d: 0.4 },
    { x: 0.12, y: 0.72, d: 0.8 },
    { x: 0.28, y: 0.68, d: 1.1 },
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
          <linearGradient id="im-i-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#c8efff" />
            <stop offset="100%" stopColor="#4ec8ff" />
          </linearGradient>
          <linearGradient id="im-m-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#d8e6f4" />
            <stop offset="100%" stopColor="#7ea0c4" />
          </linearGradient>
          <radialGradient id="im-bloom-i" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ae6ff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#4ec8ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4ec8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="im-bloom-m" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#cfe4ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#cfe4ff" stopOpacity="0" />
          </radialGradient>
          <filter id="im-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shared soft plate — one surface */}
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

        {/* I bloom */}
        <motion.ellipse
          cx="28"
          cy="32"
          rx="22"
          ry="24"
          fill="url(#im-bloom-i)"
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* M bloom + soft rays (behind letter, not a second tile) */}
        <motion.ellipse
          cx="82"
          cy="32"
          rx="28"
          ry="26"
          fill="url(#im-bloom-m)"
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
              const x2 = 82 + Math.cos(a) * 26
              const y2 = 32 + Math.sin(a) * 26
              return (
                <line
                  key={i}
                  x1={82}
                  y1={32}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(230,245,255,0.35)"
                  strokeWidth={i % 3 === 0 ? 1.1 : 0.45}
                  strokeLinecap="round"
                />
              )
            })}
          </motion.g>
        )}

        {/* Dust near I */}
        {!reduceMotion &&
          dust.map((p, i) => (
            <motion.circle
              key={i}
              cx={12 + p.x * 36}
              cy={8 + p.y * 48}
              r={1.1}
              fill="#eaf8ff"
              animate={{ opacity: [0.15, 1, 0.15], r: [0.6, 1.4, 0.6] }}
              transition={{
                duration: dramatic ? 1.6 : 2.4,
                delay: p.d,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* Letter I — custom stem, tight */}
        <motion.g
          filter="url(#im-glow)"
          animate={reduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M22 14 H34 V18.5 H30.2 V45.5 H34 V50 H22 V45.5 H25.8 V18.5 H22 Z"
            fill="url(#im-i-grad)"
            style={{
              filter:
                'drop-shadow(0 0 4px rgba(120,210,255,0.95)) drop-shadow(0 0 10px rgba(92,200,255,0.55))',
            }}
          />
        </motion.g>

        {/* Apostrophe — tucked between */}
        <motion.path
          d="M42 18 C44.2 15.8, 48 16, 48.5 19.2 C48.8 21.8, 46.2 27, 44.4 30.5 C43.7 32, 42 31.5, 42.2 29.6 C43 25.5, 45 21.5, 43.5 19.5 C43 18.5, 41.8 18.2, 42 18 Z"
          fill="#eaf8ff"
          animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(180,230,255,0.95))' }}
        />

        {/* Letter M — same baseline/weight as I */}
        <motion.g
          filter="url(#im-glow)"
          animate={reduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={{ duration: pulse, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        >
          <path
            d="M54 14 H63.5 V38 L72 18 H79 L87.5 38 V14 H97 V50 H87 L79.5 30 L72 50 H63.5 L54 50 Z"
            fill="url(#im-m-grad)"
            style={{
              filter:
                'drop-shadow(0 0 4px rgba(255,255,255,0.75)) drop-shadow(0 0 10px rgba(160,210,255,0.45))',
            }}
          />
          {/* chrome edge highlight */}
          <path
            d="M55.5 15.5 H61.5 V46"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Shared horizontal sheen across the word */}
        {!reduceMotion && (
          <motion.line
            x1="18"
            y1="32"
            x2="102"
            y2="32"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="0.6"
            animate={{ opacity: [0.08, 0.4, 0.08] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>

      <span className="sr-only">I&apos;M</span>
    </motion.span>
  )
}
