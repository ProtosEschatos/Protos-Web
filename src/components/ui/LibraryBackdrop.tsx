'use client'

import { usePathname } from '@/routing'
import { getBackgroundKey } from '@/lib/site-background-routes'
import { getRouteBackgroundStack, toLibSlug } from '@/lib/design-library'

/**
 * Page backdrop built from the design_elements library:
 * hero-backgrounds + animated-bg-patterns + lighting-backgrounds per route.
 */
export default function LibraryBackdrop() {
  const pathname = usePathname()
  const routeKey = getBackgroundKey(pathname)
  const stack = getRouteBackgroundStack(routeKey)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        key={`${routeKey}-hero`}
        className={`lib-bg-layer lib-bg-hero-${toLibSlug(stack.hero)}`}
      />
      <div
        key={`${routeKey}-pattern`}
        className={`lib-bg-layer lib-bg-pattern-${toLibSlug(stack.pattern)}`}
      />
      <div
        key={`${routeKey}-light`}
        className={`lib-bg-layer lib-bg-light-${toLibSlug(stack.lighting)}`}
      />
      <div className="lib-bg-vignette" />
    </div>
  )
}
