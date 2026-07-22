'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ImLogoProps {
  size?: number
  className?: string
  compact?: boolean
  dramatic?: boolean
}

/**
 * Brand mark "I'M" — real converted assets from the provided M-swirl / R-burst art.
 * Sources: /brand/im-i-swirl.svg (I = swirl effect) + /brand/im-m-burst.svg (M = burst effect)
 * Composite with apostrophe: /brand/im-logo.svg
 */
export default function ImLogo({
  size = 40,
  className = '',
  compact = false,
  dramatic = false,
}: ImLogoProps) {
  const reduceMotion = useReducedMotion()
  const width = Math.round(size * (420 / 200))

  return (
    <motion.span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width, height: size }}
      initial={dramatic && !reduceMotion ? { opacity: 0, scale: 0.86 } : false}
      animate={
        dramatic && !reduceMotion
          ? { opacity: 1, scale: 1 }
          : reduceMotion
            ? undefined
            : {
                filter: [
                  'drop-shadow(0 0 4px rgba(92,200,255,0.35))',
                  'drop-shadow(0 0 14px rgba(154,230,255,0.75))',
                  'drop-shadow(0 0 4px rgba(92,200,255,0.35))',
                ],
              }
      }
      transition={
        dramatic
          ? { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          : { duration: compact ? 3.6 : 2.8, repeat: Infinity, ease: 'easeInOut' }
      }
      whileHover={reduceMotion || dramatic ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion || dramatic ? undefined : { scale: 0.96 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/im-logo.svg?v=20260722b"
        alt="I'M"
        width={width}
        height={size}
        draggable={false}
        className="h-full w-full select-none object-contain"
      />
    </motion.span>
  )
}
