'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

interface ProtosLogoProps {
  size?: number
  className?: string
}

/**
 * Protos Web brand mark — a clean geometric "P" monogram (Protos = Greek for
 * "first") on a rounded gradient tile. Replaces the old pulsing eclipse.
 */
export default function ProtosLogo({ size = 36, className = '' }: ProtosLogoProps) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const tile = `plogo-tile-${uid}`
  const sheen = `plogo-sheen-${uid}`

  return (
    <motion.span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={tile} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA24D" />
            <stop offset="52%" stopColor="#FF6A00" />
            <stop offset="100%" stopColor="#FF4300" />
          </linearGradient>
          <linearGradient id={sheen} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="1" y="1" width="34" height="34" rx="10" fill={`url(#${tile})`} />
        <rect x="1" y="1" width="34" height="34" rx="10" fill={`url(#${sheen})`} />
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          rx="9.5"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        <g fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9.5 V26.5" />
          <path d="M14 9.5 H18.5 A5 5 0 0 1 18.5 19.5 H14" />
        </g>
      </svg>
    </motion.span>
  )
}
