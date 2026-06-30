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

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <defs>
        <filter id={glowFilter} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={ECLIPSE_PATH}
        fill="#FF8800"
        filter={`url(#${glowFilter})`}
        animate={reduceMotion ? undefined : { opacity: [0.35, 0.95, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <circle cx="18" cy="18" r="17" fill="#0d0d1a" stroke="#FF8800" strokeWidth="1.5" />
      <path d={ECLIPSE_PATH} fill="#FF6600" />
    </svg>
  )
}
