'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type GlowColor = 'primary' | 'secondary' | 'accent' | 'purple'

const GLOW: Record<GlowColor, string> = {
  primary: 'rgba(255,102,0,0.35)',
  secondary: 'rgba(139,92,246,0.35)',
  accent: 'rgba(6,182,212,0.35)',
  purple: 'rgba(168,85,247,0.4)',
}

type GlowCardProps = {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
}

export default function GlowCard({ children, className = '', glowColor = 'secondary' }: GlowCardProps) {
  const reduceMotion = useReducedMotion()
  const glow = GLOW[glowColor]

  return (
    <motion.div
      className={`group relative ${className}`}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 22px ${glow}, 0 0 44px ${glow}` }}
        aria-hidden
      />
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 w-1/2"
            style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }}
            animate={{ x: ['-120%', '280%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
          />
        </div>
      )}
      {children}
    </motion.div>
  )
}
