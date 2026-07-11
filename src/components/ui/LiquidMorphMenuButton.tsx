'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

type LiquidMorphMenuButtonProps = {
  isOpen: boolean
  onClick: () => void
  ariaLabel: string
  className?: string
}

const spring = { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const }

export default function LiquidMorphMenuButton({
  isOpen,
  onClick,
  ariaLabel,
  className = '',
}: LiquidMorphMenuButtonProps) {
  const reduceMotion = useReducedMotion()
  const filterId = useId().replace(/:/g, '')

  if (reduceMotion) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`relative flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[var(--dark-card)]/60 ${className}`}
      >
        <span className={`block h-0.5 w-6 rounded-full bg-[var(--light)] transition-transform ${isOpen ? 'translate-y-1 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 rounded-full bg-[var(--light)] transition-opacity ${isOpen ? 'opacity-0 scale-0' : ''}`} />
        <span className={`block h-0.5 w-6 rounded-full bg-[var(--light)] transition-transform ${isOpen ? '-translate-y-1 -rotate-45' : ''}`} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className={`relative flex h-12 w-12 items-center justify-center overflow-visible rounded-xl border border-white/10 bg-[#0a0a1a]/75 shadow-[0_0_24px_rgba(139,92,246,0.14)] transition-shadow duration-500 hover:border-[var(--primary)]/35 hover:shadow-[0_0_36px_rgba(255,102,0,0.22)] ${className}`}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <motion.span
        className="pointer-events-none absolute inset-0 rounded-xl"
        animate={
          isOpen
            ? {
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.45), transparent 55%)',
                  'radial-gradient(circle at 80% 80%, rgba(168,85,247,0.5), transparent 55%)',
                  'radial-gradient(circle at 50% 50%, rgba(255,102,0,0.4), transparent 60%)',
                  'radial-gradient(circle at 20% 20%, rgba(57,255,20,0.35), transparent 55%)',
                  'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.45), transparent 55%)',
                ],
              }
            : {
                background:
                  'radial-gradient(circle at 50% 40%, rgba(255,179,71,0.12), transparent 65%)',
              }
        }
        transition={isOpen ? { duration: 5, repeat: Infinity, ease: 'linear' } : { duration: 0.35 }}
        aria-hidden
      />

      <div
        className="relative h-8 w-8"
        style={{ filter: `url(#${filterId})` }}
        aria-hidden
      >
        <motion.span
          className="absolute left-1 block h-[5px] w-6 rounded-full"
          style={{
            background: isOpen
              ? 'linear-gradient(135deg, #06b6d4, #a855f7, #ff6600)'
              : 'linear-gradient(135deg, #eef2ff, #ffb347, #c4b5fd)',
            boxShadow: isOpen ? '0 0 12px rgba(168,85,247,0.55)' : '0 0 6px rgba(255,179,71,0.35)',
          }}
          animate={
            isOpen
              ? { top: 13.5, rotate: 45, scale: 1.05 }
              : { top: 6, rotate: 0, scale: 1 }
          }
          transition={spring}
        />
        <motion.span
          className="absolute left-1 block h-[5px] w-6 rounded-full"
          style={{
            background: isOpen
              ? 'linear-gradient(135deg, #39ff14, #a855f7)'
              : 'linear-gradient(135deg, #f8fafc, #ff8800, #8b5cf6)',
          }}
          animate={
            isOpen
              ? { top: 13.5, opacity: 0, scaleX: 0.15, scaleY: 0.15 }
              : { top: 13.5, opacity: 1, scaleX: 1, scaleY: 1 }
          }
          transition={spring}
        />
        <motion.span
          className="absolute left-1 block h-[5px] w-6 rounded-full"
          style={{
            background: isOpen
              ? 'linear-gradient(135deg, #ff6600, #06b6d4, #39ff14)'
              : 'linear-gradient(135deg, #e8e8f0, #ff6600, #a855f7)',
            boxShadow: isOpen ? '0 0 12px rgba(6,182,212,0.45)' : '0 0 6px rgba(139,92,246,0.25)',
          }}
          animate={
            isOpen
              ? { top: 13.5, rotate: -45, scale: 1.05 }
              : { top: 21, rotate: 0, scale: 1 }
          }
          transition={spring}
        />
      </div>
    </button>
  )
}
