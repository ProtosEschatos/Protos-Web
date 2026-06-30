'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ProtosEclipseLogoProps {
  size?: number
  className?: string
}

export default function ProtosEclipseLogo({ size = 36, className = '' }: ProtosEclipseLogoProps) {
  const reduceMotion = useReducedMotion()
  const disc = Math.round(size * (34 / 36))
  const inset = (size - disc) / 2
  const moonOffset = -Math.round(size * 0.19)

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: inset - 2,
          background:
            'radial-gradient(circle at 72% 50%, rgba(255,190,80,0.95) 0%, rgba(255,120,0,0.55) 28%, rgba(255,80,0,0.2) 48%, transparent 68%)',
        }}
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.55, 1, 0.55], scale: [0.96, 1.06, 0.96] }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="absolute rounded-full overflow-hidden"
        style={{ inset }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 40% 38%, #fff6b0 0%, #ffd54a 32%, #ff8800 68%, #ff6600 100%)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 32%, #1c1c34 0%, #101024 55%, #0d0d1a 100%)',
            transform: `translateX(${moonOffset}px)`,
          }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute rounded-full border-[1.5px] border-[#FF8800]"
        style={{ inset: 0, boxSizing: 'border-box' }}
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: [
                  '0 0 0 0 rgba(255,136,0,0)',
                  '0 0 8px 1px rgba(255,136,0,0.45)',
                  '0 0 0 0 rgba(255,136,0,0)',
                ],
              }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
