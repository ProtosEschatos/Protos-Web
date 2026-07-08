'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from '@/routing'
import { getShowcaseStorageUrl, SHOWCASE_STORAGE } from '@/lib/showcase-storage'
import {
  BACKGROUND_FOG,
  BACKGROUND_GLOW,
  getBackgroundKey,
  type BackgroundRouteKey,
} from '@/lib/site-background-routes'

/**
 * Real background images pulled from the Supabase `showcase/environment` set
 * (the synthwave 360 panorama + the four room reference views). Each route gets
 * a distinct image so no two adjacent pages look the same.
 */
const ROUTE_IMAGE: Record<BackgroundRouteKey, string> = {
  home: SHOWCASE_STORAGE.environment.synthwavePanorama,
  about: SHOWCASE_STORAGE.environment.front,
  process: SHOWCASE_STORAGE.environment.right,
  portfolio: SHOWCASE_STORAGE.environment.back,
  services: SHOWCASE_STORAGE.environment.left,
  blog: SHOWCASE_STORAGE.environment.synthwavePanorama,
  contact: SHOWCASE_STORAGE.environment.front,
}

export default function ImageBackdrop() {
  const pathname = usePathname()
  const routeKey = getBackgroundKey(pathname)
  const layerRef = useRef<HTMLDivElement>(null)

  const imageUrl = getShowcaseStorageUrl(ROUTE_IMAGE[routeKey])
  const glow = BACKGROUND_GLOW[routeKey]
  const fog = BACKGROUND_FOG[routeKey]

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = layerRef.current
        if (!el) return
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--px', `${x * -14}px`)
        el.style.setProperty('--py', `${y * -14}px`)
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: fog }} />

      <div
        key={routeKey}
        ref={layerRef}
        className="absolute inset-0 bg-cover bg-center animate-[backdrop-drift_36s_ease-in-out_infinite_alternate] opacity-45"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: 'translate3d(var(--px, 0), var(--py, 0), 0) scale(1.12)',
          transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />

      <div
        className="absolute inset-0 opacity-70 mix-blend-soft-light"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${glow}55 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${fog}cc 0%, ${fog}66 40%, ${fog}dd 100%)`,
        }}
      />
    </div>
  )
}
