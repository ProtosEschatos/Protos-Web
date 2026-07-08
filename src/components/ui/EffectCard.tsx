'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type BaseProps = {
  index?: number
  libraryOffset?: number
  className?: string
  children: ReactNode
  bare?: boolean
}

type DivProps = BaseProps &
  HTMLMotionProps<'div'> & {
    as?: 'div'
  }

type AnchorProps = BaseProps &
  HTMLMotionProps<'a'> & {
    as: 'a'
    href: string
    target?: string
    rel?: string
    'aria-label'?: string
    'aria-disabled'?: boolean | 'true' | 'false'
    role?: string
  }

export type EffectCardProps = DivProps | AnchorProps

function mergeClasses(className?: string, bare?: boolean) {
  return [bare ? null : 'plain-card', className].filter(Boolean).join(' ')
}

export default function EffectCard(props: EffectCardProps) {
  const { index: _index, libraryOffset: _libraryOffset, className, children, bare, as = 'div', ...rest } = props

  if (as === 'a') {
    const { href, target, rel, ...motionRest } = rest as AnchorProps
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={mergeClasses(className, bare)}
        {...motionRest}
      >
        {children}
      </motion.a>
    )
  }

  const motionRest = rest as HTMLMotionProps<'div'>
  return (
    <motion.div className={mergeClasses(className, bare)} {...motionRest}>
      {children}
    </motion.div>
  )
}
