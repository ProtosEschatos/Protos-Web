'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { MouseEvent, ReactElement, ReactNode } from 'react'

type MagneticButtonProps = {
  children: ReactNode
  strength?: number
  className?: string
}

export default function MagneticButton({
  children,
  strength = 0.22,
  className = 'inline-block',
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 22 })
  const springY = useSpring(y, { stiffness: 280, damping: 22 })

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={className}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children as ReactElement}
    </motion.div>
  )
}
