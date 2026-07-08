'use client'

import { usePathname } from '@/routing'
import { getBackgroundKey } from '@/lib/site-background-routes'
import { getRouteSceneBackground, getSceneBackgroundStyles } from '@/lib/design-assets'

/**
 * One real scene/hero image per route from Desktop "Za Protos Web" library
 * (cosmic hero, hero-header set crops, wireframe portal, 3D geometric scene).
 */
export default function LibraryBackdrop() {
  const pathname = usePathname()
  const routeKey = getBackgroundKey(pathname)
  const scene = getRouteSceneBackground(routeKey)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0a1a]" />
      <div
        key={routeKey}
        className="absolute inset-[-5%] bg-no-repeat transition-opacity duration-700"
        style={getSceneBackgroundStyles(scene)}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,26,0.72) 0%, rgba(10,10,26,0.35) 42%, rgba(10,10,26,0.82) 100%)',
        }}
      />
    </div>
  )
}
