'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { useCallback, useRef, type ReactNode } from 'react'
import { getCardEffectClasses } from '@/lib/card-effects'

type BaseProps = {
  index?: number
  className?: string
  children: ReactNode
  /** Skip cosmic-panel base when the card has its own surface styles. */
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

function mergeClasses(index: number, className?: string, bare?: boolean) {
  return ['effect-card', bare ? null : 'cosmic-panel', getCardEffectClasses(index), className]
    .filter(Boolean)
    .join(' ')
}

export default function EffectCard(props: EffectCardProps) {
  const { index = 0, className, children, bare, as = 'div', ...rest } = props
  const nodeRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((node: HTMLDivElement | HTMLAnchorElement | null) => {
    nodeRef.current = node
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = nodeRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', String((e.clientX - rect.left) / rect.width))
    el.style.setProperty('--my', String((e.clientY - rect.top) / rect.height))
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = nodeRef.current
    if (!el) return
    el.style.setProperty('--mx', '0.5')
    el.style.setProperty('--my', '0.5')
  }, [])

  const shared = {
    ref: setRef,
    className: mergeClasses(index, className, bare),
    onMouseMove,
    onMouseLeave,
  }

  const layers = (
    <>
      <span className="effect-card__fx effect-card__fx--primary" aria-hidden />
      <span className="effect-card__fx effect-card__fx--layer" aria-hidden />
      <span className="effect-card__fx effect-card__fx--trail" aria-hidden />
      <div className="effect-card__content">{children}</div>
    </>
  )

  if (as === 'a') {
    const { href, target, rel, ...motionRest } = rest as AnchorProps
    return (
      <motion.a
        {...shared}
        href={href}
        target={target}
        rel={rel}
        {...motionRest}
      >
        {layers}
      </motion.a>
    )
  }

  const motionRest = rest as HTMLMotionProps<'div'>
  return (
    <motion.div {...shared} {...motionRest}>
      {layers}
    </motion.div>
  )
}
