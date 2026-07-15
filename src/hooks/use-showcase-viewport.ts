'use client'

import { useEffect, useState } from 'react'

export type ShowcaseViewport = 'mobile' | 'desktop'

const DESKTOP_MQ = '(min-width: 768px)'

export function getShowcaseViewport(): ShowcaseViewport {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia(DESKTOP_MQ).matches ? 'desktop' : 'mobile'
}

export type ShowcaseViewportState = {
  viewport: ShowcaseViewport
  width: number
}

export function useShowcaseViewport(): ShowcaseViewport {
  return useShowcaseViewportState().viewport
}

/** Viewport bucket + live inner width for responsive 3D layout. */
export function useShowcaseViewportState(): ShowcaseViewportState {
  const [state, setState] = useState<ShowcaseViewportState>(() => ({
    viewport: typeof window !== 'undefined' ? getShowcaseViewport() : 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
  }))

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const update = () => {
      setState({
        viewport: mq.matches ? 'desktop' : 'mobile',
        width: window.innerWidth,
      })
    }
    update()
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return state
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
