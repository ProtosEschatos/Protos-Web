'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ProtosEclipseLogoProps {
  size?: number
  className?: string
}

const CORONA_SHADOW = [
  '0 0 8px 2px rgba(255,160,0,0.55), 0 0 16px 4px rgba(255,120,0,0.35), 0 0 24px 8px rgba(255,80,0,0.15)',
  '0 0 12px 4px rgba(255,180,0,0.75), 0 0 22px 8px rgba(255,130,0,0.45), 0 0 32px 12px rgba(255,90,0,0.2)',
  '0 0 8px 2px rgba(255,160,0,0.55), 0 0 16px 4px rgba(255,120,0,0.35), 0 0 24px 8px rgba(255,80,0,0.15)',
]

export default function ProtosEclipseLogo({ size = 36, className = '' }: ProtosEclipseLogoProps) {
  const reduceMotion = useReducedMotion()
  const disc = Math.round(size * 0.94)
  const inset = (size - disc) / 2

  if (reduceMotion) {
    return (
      <div
        className={`relative shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <div
          className="absolute rounded-full"
          style={{
            inset,
            background: 'radial-gradient(circle at 38% 38%, #fff7aa 0%, #ffd700 35%, #ff8800 70%, #ff6600 100%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset,
            background: 'radial-gradient(circle at 30% 30%, #1a1a2e 0%, #0d0d1a 100%)',
            transform: 'translateX(2px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full border-[1.5px] border-[#FF8800]"
          style={{ boxSizing: 'border-box' }}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: -size * 0.15,
          background: 'radial-gradient(circle, rgba(255,136,0,0.4) 0%, rgba(255,102,0,0.12) 45%, transparent 70%)',
        }}
        animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          inset,
          background: 'radial-gradient(circle at 38% 38%, #fff7aa 0%, #ffd700 35%, #ff8800 70%, #ff6600 100%)',
        }}
        animate={{
          boxShadow: CORONA_SHADOW,
          scale: [1, 1.03, 1],
        }}
        transition={{
          boxShadow: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          inset,
          background: 'radial-gradient(circle at 28% 28%, #222244 0%, #12122a 55%, #0d0d1a 100%)',
          boxShadow: 'inset -2px -1px 6px rgba(100,120,255,0.18)',
        }}
        animate={{ x: [-3, 4, -2, 3, -3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute rounded-full border border-dashed border-white/15"
        style={{ inset: -size * 0.22 }}
        animate={{ rotate: 360, opacity: [0.15, 0.35, 0.15] }}
        transition={{
          rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full border-[1.5px] border-[#FF8800]"
        style={{ boxSizing: 'border-box' }}
        animate={{
          borderColor: ['rgba(255,136,0,0.65)', 'rgba(255,170,0,1)', 'rgba(255,136,0,0.65)'],
          boxShadow: [
            '0 0 0 0 rgba(255,136,0,0)',
            '0 0 6px 1px rgba(255,136,0,0.35)',
            '0 0 0 0 rgba(255,136,0,0)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: size * 0.12,
          height: size * 0.12,
          top: '18%',
          right: '14%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,220,150,0.4) 50%, transparent 70%)',
        }}
        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </div>
  )
}
