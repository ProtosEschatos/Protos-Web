'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type ShimmerTextProps = {
  children: ReactNode
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}

const shimmerClass =
  'inline-block bg-gradient-to-r from-[var(--primary)] via-white to-[var(--secondary)] bg-[length:200%_100%] bg-clip-text text-transparent'

export default function ShimmerText({ children, className = '', as = 'span' }: ShimmerTextProps) {
  const reduceMotion = useReducedMotion()
  const Tag = as

  if (reduceMotion || as !== 'span') {
    if (as === 'span') {
      return <span className={`gradient-text ${className}`}>{children}</span>
    }
    return <Tag className={`gradient-text ${className}`}>{children}</Tag>
  }

  return (
    <motion.span
      className={`${shimmerClass} ${className}`}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.span>
  )
}
