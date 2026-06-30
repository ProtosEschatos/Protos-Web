'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

interface ProtosEclipseLogoProps {
  size?: number
  className?: string
}

const ECLIPSE_PATH = 'M18,1 A17,17 0 0,1 18,35 A17,17 0 0,0 18,1'

export default function ProtosEclipseLogo({ size = 36, className = '' }: ProtosEclipseLogoProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const glowFilter = `eclipse-glow-${uid}`
  const sunGradient = `eclipse-sun-${uid}`

  return (
    <motion.span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
      whileHover={reduceMotion ? undefined : { scale: 1.1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 420, damping: 20 }}
    >
      <motion.span
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: -size * 0.28,
          background:
            'radial-gradient(circle at 72% 50%, rgba(255,180,60,0.55) 0%, rgba(255,120,0,0.22) 38%, transparent 68%)',
        }}
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.45, 0.85, 0.45], scale: [0.94, 1.06, 0.94] }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-[1]"
        aria-hidden
      >
        <defs>
          <radialGradient id={sunGradient} cx="74%" cy="46%" r="58%">
            <stop offset="0%" stopColor="#fff8c8" />
            <stop offset="38%" stopColor="#ffc040" />
            <stop offset="72%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff5500" />
          </radialGradient>
          <filter id={glowFilter} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={ECLIPSE_PATH}
          fill="#FF9900"
          filter={`url(#${glowFilter})`}
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <circle cx="18" cy="18" r="17" fill="#0d0d1a" stroke="#FF8800" strokeWidth="1.5" />

        <motion.path
          d={ECLIPSE_PATH}
          fill={`url(#${sunGradient})`}
          animate={reduceMotion ? undefined : { opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.circle
          cx="24"
          cy="14"
          r="1.2"
          fill="#fffde8"
          animate={reduceMotion ? undefined : { opacity: [0.15, 0.85, 0.15], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </svg>

      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full border border-[#FF8800]/0"
        animate={
          reduceMotion
            ? undefined
            : {
                borderColor: [
                  'rgba(255,136,0,0)',
                  'rgba(255,170,0,0.35)',
                  'rgba(255,136,0,0)',
                ],
              }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.span>
  )
}
