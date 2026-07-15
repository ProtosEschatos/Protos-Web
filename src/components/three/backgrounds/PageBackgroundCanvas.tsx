'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/showcase/webgl'
import { BackgroundErrorBoundary } from '@/components/three/backgrounds/BackgroundErrorBoundary'
import {
  BACKGROUND_FALLBACKS,
  type BackgroundRouteKey,
  type PageBackgroundProps,
} from '@/lib/showcase/site-background-routes'

const Backgrounds: Record<BackgroundRouteKey, ComponentType<PageBackgroundProps>> = {
  home: dynamic(() => import('@/components/three/backgrounds/HomeBackground'), { ssr: false, loading: () => null }),
  about: dynamic(() => import('@/components/three/backgrounds/AboutBackground'), { ssr: false, loading: () => null }),
  process: dynamic(() => import('@/components/three/backgrounds/ProcessBackground'), { ssr: false, loading: () => null }),
  services: dynamic(() => import('@/components/three/backgrounds/ServicesBackground'), { ssr: false, loading: () => null }),
  blog: dynamic(() => import('@/components/three/backgrounds/BlogBackground'), { ssr: false, loading: () => null }),
  contact: dynamic(() => import('@/components/three/backgrounds/ContactBackground'), { ssr: false, loading: () => null }),
}

type PageBackgroundCanvasProps = {
  routeKey: BackgroundRouteKey
}

function CssFallback({ routeKey }: { routeKey: BackgroundRouteKey }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-100"
      style={{ background: BACKGROUND_FALLBACKS[routeKey] }}
      aria-hidden
    />
  )
}

export default function PageBackgroundCanvas({ routeKey }: PageBackgroundCanvasProps) {
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const Background = Backgrounds[routeKey]

  useEffect(() => {
    setSupported(isWebGLAvailable())
    const mq = window.matchMedia('(max-width: 767px)')
    const updateMobile = () => setIsMobile(mq.matches)
    updateMobile()
    mq.addEventListener('change', updateMobile)
    setMounted(true)
    return () => mq.removeEventListener('change', updateMobile)
  }, [])

  if (!mounted) {
    return <CssFallback routeKey={routeKey} />
  }

  if (!supported) {
    return <CssFallback routeKey={routeKey} />
  }

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full [&_canvas]:pointer-events-none">
      <BackgroundErrorBoundary fallback={<CssFallback routeKey={routeKey} />}>
        <Background isMobile={isMobile} />
      </BackgroundErrorBoundary>
    </div>
  )
}
