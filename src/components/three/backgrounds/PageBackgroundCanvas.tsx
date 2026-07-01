'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/webgl'
import {
  BACKGROUND_FALLBACKS,
  type BackgroundRouteKey,
  type PageBackgroundProps,
} from '@/lib/site-background-routes'

const Backgrounds: Record<BackgroundRouteKey, ComponentType<PageBackgroundProps>> = {
  home: dynamic(() => import('@/components/three/backgrounds/HomeBackground'), { ssr: false, loading: () => null }),
  about: dynamic(() => import('@/components/three/backgrounds/AboutBackground'), { ssr: false, loading: () => null }),
  process: dynamic(() => import('@/components/three/backgrounds/ProcessBackground'), { ssr: false, loading: () => null }),
  portfolio: dynamic(() => import('@/components/three/backgrounds/PortfolioBackground'), { ssr: false, loading: () => null }),
  services: dynamic(() => import('@/components/three/backgrounds/ServicesBackground'), { ssr: false, loading: () => null }),
  blog: dynamic(() => import('@/components/three/backgrounds/BlogBackground'), { ssr: false, loading: () => null }),
  contact: dynamic(() => import('@/components/three/backgrounds/ContactBackground'), { ssr: false, loading: () => null }),
}

type PageBackgroundCanvasProps = {
  routeKey: BackgroundRouteKey
}

export default function PageBackgroundCanvas({ routeKey }: PageBackgroundCanvasProps) {
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const Background = Backgrounds[routeKey]

  useEffect(() => {
    setSupported(isWebGLAvailable())
    setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    setMounted(true)
  }, [])

  const fallbackStyle = { background: BACKGROUND_FALLBACKS[routeKey] }

  if (!mounted) {
    return <div className="absolute inset-0 opacity-60" style={fallbackStyle} aria-hidden />
  }

  if (!supported) {
    return <div className="absolute inset-0 opacity-70" style={fallbackStyle} aria-hidden />
  }

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <Background isMobile={isMobile} />
    </div>
  )
}
