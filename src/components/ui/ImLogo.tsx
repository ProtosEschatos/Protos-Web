'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

interface ImLogoProps {
  /** Overall height in px; width scales with viewBox aspect. */
  size?: number
  className?: string
  /** Softer motion for compact nav/footer marks. */
  compact?: boolean
  /** Louder entrance + pulse for boot / loading screen. */
  dramatic?: boolean
}

/**
 * Brand mark "I'M":
 * - I  → luminous cyan glow + cosmic particle swirl (M-ref style)
 * - '  → glowing apostrophe between
 * - M  → metallic chrome + radial light-burst (R-ref style)
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const width = Math.round(size * (120 / 64))

  const swirlGrad = `im-swirl-${uid}`
  const metalGrad = `im-metal-${uid}`
  const rayGrad = `im-ray-${uid}`
  const glowFilter = `im-glow-${uid}`
  const burstFilter = `im-burst-${uid}`

  const swirlDuration = compact ? 5.5 : dramatic ? 3.2 : 4.5
  const pulseDuration = dramatic ? 2 : 3.2
  const raySpin = dramatic ? 10 : 16

  const particles = [
    { cx: 16, cy: 18, r: 1.05, delay: 0 },
    { cx: 30, cy: 24, r: 0.8, delay: 0.25 },
    { cx: 12, cy: 36, r: 0.7, delay: 0.45 },
    { cx: 34, cy: 40, r: 0.95, delay: 0.1 },
    { cx: 20, cy: 48, r: 0.7, delay: 0.35 },
    { cx: 36, cy: 30, r: 0.55, delay: 0.6 },
    { cx: 10, cy: 26, r: 0.5, delay: 0.75 },
    { cx: 28, cy: 14, r: 0.6, delay: 0.9 },
  ]

  const rays = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2
    const inner = 5
    const outer = 20 + (i % 3) * 3.5
    return {
      x1: 88 + Math.cos(angle) * inner,
      y1: 32 + Math.sin(angle) * inner,
      x2: 88 + Math.cos(angle) * outer,
      y2: 32 + Math.sin(angle) * outer,
      w: i % 3 === 0 ? 1.15 : 0.5,
      opacity: 0.28 + (i % 4) * 0.14,
    }
  })

  return (
    <motion.span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width, height: size }}
      initial={dramatic && !reduceMotion ? { opacity: 0, scale: 0.82 } : false}
      animate={dramatic && !reduceMotion ? { opacity: 1, scale: 1 } : undefined}
      transition={dramatic ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] } : undefined}
      whileHover={reduceMotion || dramatic ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion || dramatic ? undefined : { scale: 0.96 }}
    >
      <svg
        viewBox="0 0 120 64"
        width={width}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={swirlGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#c8efff" />
            <stop offset="100%" stopColor="#4ec8ff" />
          </linearGradient>
          <linearGradient id={metalGrad} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#f7fbff" />
            <stop offset="32%" stopColor="#c8d8ec" />
            <stop offset="68%" stopColor="#8eafd2" />
            <stop offset="100%" stopColor="#5f87b0" />
          </linearGradient>
          <radialGradient id={rayGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#d6ecff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" />
          </radialGradient>
          <filter id={glowFilter} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={burstFilter} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="1.5"
          y="1.5"
          width="117"
          height="61"
          rx="10"
          ry="10"
          fill="#050b18"
          stroke="#5cc8ff"
          strokeWidth="1.25"
        />
        <rect
          x="4"
          y="4"
          width="112"
          height="56"
          rx="8"
          ry="8"
          fill="none"
          stroke="rgba(92,200,255,0.22)"
          strokeWidth="0.6"
        />

        {/* Letter I — cosmic swirl */}
        <g filter={`url(#${glowFilter})`}>
          {!reduceMotion && (
            <motion.path
              d="M8 46 C16 34, 22 26, 30 18 S40 10, 40 20"
              fill="none"
              stroke="rgba(180,230,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                pathLength: [0.15, 1, 0.15],
                opacity: [0.3, 0.95, 0.3],
              }}
              transition={{
                duration: swirlDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          {!reduceMotion &&
            particles.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="#eaf8ff"
                animate={{ opacity: [0.12, 1, 0.12], scale: [0.65, 1.3, 0.65] }}
                transition={{
                  duration: dramatic ? 1.7 : 2.5,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
              />
            ))}
          <motion.path
            d="M20 11 L28 11 L28 15.5 L25.4 15.5 L25.4 48.5 L28 48.5 L28 53 L20 53 L20 48.5 L22.6 48.5 L22.6 15.5 L20 15.5 Z"
            fill={`url(#${swirlGrad})`}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.88, 1, 0.88],
                  }
            }
            transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              filter:
                'drop-shadow(0 0 5px rgba(92,200,255,0.95)) drop-shadow(0 0 12px rgba(120,210,255,0.55))',
            }}
          />
        </g>

        {/* Apostrophe */}
        <motion.path
          d="M48 15.5 C50.2 13.2, 54 13.5, 54.5 17 C54.8 19.5, 52.2 25, 50.2 29 C49.4 30.6, 47.6 30, 47.9 28 C48.8 24, 50.2 20, 49 17.8 C48.4 16.6, 47.6 16, 48 15.5 Z"
          fill="#eaf8ff"
          animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(180,230,255,0.95))' }}
        />

        {/* Letter M — metallic light burst */}
        <g>
          {!reduceMotion && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: raySpin, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '88px 32px', transformBox: 'view-box' }}
            >
              {rays.map((ray, i) => (
                <line
                  key={i}
                  x1={ray.x1}
                  y1={ray.y1}
                  x2={ray.x2}
                  y2={ray.y2}
                  stroke="rgba(230,245,255,0.6)"
                  strokeWidth={ray.w}
                  opacity={ray.opacity}
                  strokeLinecap="round"
                />
              ))}
            </motion.g>
          )}
          <motion.circle
            cx="88"
            cy="32"
            r="13"
            fill={`url(#${rayGrad})`}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.4, 0.9, 0.4], scale: [0.92, 1.12, 0.92] }
            }
            transition={{
              duration: dramatic ? 2.1 : 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '88px 32px', transformBox: 'view-box' }}
            filter={`url(#${burstFilter})`}
          />
          {!reduceMotion && (
            <motion.line
              x1="66"
              y1="32"
              x2="110"
              y2="32"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.75"
              animate={{ opacity: [0.15, 0.65, 0.15] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <path
            d="M67 11 L73.2 11 L73.2 42.5 L80.2 20.5 L85.8 20.5 L92.8 42.5 L92.8 11 L99 11 L99 53 L91.2 53 L85.5 34.5 L79.8 53 L72 53 L67 53 Z"
            fill={`url(#${metalGrad})`}
            style={{
              filter:
                'drop-shadow(0 0 4px rgba(200,220,255,0.8)) drop-shadow(0 0 10px rgba(255,255,255,0.35))',
            }}
          />
          <path
            d="M68.4 12.4 L71.8 12.4 L71.8 49.5"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <span className="sr-only">I&apos;M</span>
    </motion.span>
  )
}
