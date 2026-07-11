'use client'

import { useEffect, useState } from 'react'

export type ShowcaseViewport = 'mobile' | 'desktop'

const DESKTOP_MQ = '(min-width: 768px)'

export function getShowcaseViewport(): ShowcaseViewport {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia(DESKTOP_MQ).matches ? 'desktop' : 'mobile'
}

export function useShowcaseViewport(): ShowcaseViewport {
  const [viewport, setViewport] = useState<ShowcaseViewport>('desktop')

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const update = () => setViewport(mq.matches ? 'desktop' : 'mobile')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return viewport
}

export function useTouchControlsEnabled(): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setEnabled(coarse || touch)
  }, [])

  return enabled
}

export type TouchInput = {
  active: boolean
  x: number
  y: number
}

export const INITIAL_TOUCH_INPUT: TouchInput = { active: false, x: 0, y: 0 }
