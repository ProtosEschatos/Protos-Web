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
 * Real background images from the Supabase `showcase/environment` set.
 * Each route gets a distinct image. Drift + mouse parallax on separate
 * layers so transforms never fight each other.
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
  const parallaxRef = useRef<HTMLDivElement>(null)

  const imageUrl = getShowcaseStorageUrl(ROUTE_IMAGE[routeKey])
  const glow = BACKGROUND_GLOW[routeKey]
  const fog = BACKGROUND_FOG[routeKey]

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = imageUrl
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [imageUrl])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = parallaxRef.current
        if (!el) return
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.transform = `translate3d(${x * -12}px, ${y * -12}px, 0)`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: fog }} />

      <div
        key={routeKey}
        className="absolute inset-0 animate-[backdrop-drift_36s_ease-in-out_infinite_alternate]"
      >
        <div
          ref={parallaxRef}
          className="absolute inset-[-8%] bg-cover bg-center opacity-55 transition-transform duration-500 ease-out will-change-transform"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${glow}55 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${fog}dd 0%, ${fog}88 42%, ${fog}ee 100%)`,
        }}
      />
    </div>
  )
}
