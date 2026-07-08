'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/webgl'
import { BackgroundErrorBoundary } from '@/components/three/backgrounds/BackgroundErrorBoundary'
import {
  BACKGROUND_FALLBACKS,
  type BackgroundRouteKey,
} from '@/lib/site-background-routes'

/** Every route renders the same image-driven background, seeded per route for a distinct layout. */
const DbImageBackground = dynamic(
  () => import('@/components/three/backgrounds/DbImageBackground'),
  { ssr: false, loading: () => null },
)

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
        <DbImageBackground isMobile={isMobile} routeKey={routeKey} />
      </BackgroundErrorBoundary>
    </div>
  )
}
