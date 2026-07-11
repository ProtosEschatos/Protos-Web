'use client'

import { useReducedMotion } from 'framer-motion'
import { Orbit, Ring } from 'ldrs/react'
import 'ldrs/react/Orbit.css'
import 'ldrs/react/Ring.css'

const COLORS = {
  purple: '#a855f7',
  green: '#39ff14',
  orange: '#ff6600',
  cyan: '#06b6d4',
  white: '#e8e8f0',
} as const

type LoaderColor = keyof typeof COLORS
type LoaderVariant = 'orbit' | 'ring'

type ProtosLoaderProps = {
  variant?: LoaderVariant
  size?: number
  color?: LoaderColor
  className?: string
  label?: string
  inline?: boolean
}

export default function ProtosLoader({
  variant = 'ring',
  size = 28,
  color = 'purple',
  className = '',
  label,
  inline = false,
}: ProtosLoaderProps) {
  const reduceMotion = useReducedMotion()
  const hex = COLORS[color]
  const ariaLabel = label ?? 'Loading'

  if (reduceMotion) {
    return (
      <span
        className={`inline-flex items-center justify-center ${inline ? 'gap-2' : 'flex-col gap-3'} ${className}`}
        role="status"
        aria-label={ariaLabel}
      >
        <span
          className="inline-block animate-pulse rounded-full"
          style={{ width: size, height: size, backgroundColor: hex, opacity: 0.65 }}
        />
        {label ? <span className="text-sm text-[var(--light-muted)]">{label}</span> : null}
      </span>
    )
  }

  const Loader = variant === 'orbit' ? Orbit : Ring

  return (
    <span
      className={`${inline ? 'inline-flex items-center gap-2' : 'flex flex-col items-center justify-center gap-3'} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <Loader size={String(size)} color={hex} speed={variant === 'orbit' ? '1.2' : '1'} />
      {label ? (
        <span className={`text-sm text-[var(--light-muted)] ${inline ? '' : 'text-center'}`}>{label}</span>
      ) : null}
    </span>
  )
}
