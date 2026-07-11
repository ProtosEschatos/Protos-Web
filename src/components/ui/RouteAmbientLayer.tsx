'use client'

import { BACKGROUND_AMBIENT, type BackgroundRouteKey } from '@/lib/showcase/site-background-routes'

type RouteAmbientLayerProps = {
  routeKey: BackgroundRouteKey
}

export default function RouteAmbientLayer({ routeKey }: RouteAmbientLayerProps) {
  const blobs = BACKGROUND_AMBIENT[routeKey]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((blob, i) => (
        <div
          key={`${routeKey}-${i}`}
          className={`ambient-blob absolute rounded-full blur-3xl ${blob.position}`}
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            animation: `${blob.animation} 18s ease-in-out infinite`,
            animationDelay: blob.delay ?? '0s',
          }}
        />
      ))}
    </div>
  )
}
