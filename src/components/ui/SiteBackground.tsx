'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/routing'
import { BACKGROUND_FALLBACKS, getBackgroundKey } from '@/lib/site-background-routes'
import PageBackgroundCanvas from '@/components/three/backgrounds/PageBackgroundCanvas'
import { BOOT_COMPLETE_EVENT, isBootComplete } from '@/lib/boot-gate'

const TWINKLE_BG = `
  radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4), transparent),
  radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3), transparent),
  radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.5), transparent),
  radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.3), transparent),
  radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.4), transparent),
  radial-gradient(1.5px 1.5px at 15% 85%, rgba(255,255,255,0.2), transparent),
  radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.35), transparent),
  radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.25), transparent),
  radial-gradient(1px 1px at 60% 75%, rgba(255,255,255,0.3), transparent)
`

export default function SiteBackground() {
  const pathname = usePathname()
  const routeKey = getBackgroundKey(pathname)
  const [bootDone, setBootDone] = useState(() => isBootComplete())

  useEffect(() => {
    const sync = () => setBootDone(isBootComplete())
    sync()
    window.addEventListener(BOOT_COMPLETE_EVENT, sync)
    return () => window.removeEventListener(BOOT_COMPLETE_EVENT, sync)
  }, [])

  if (!bootDone) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[var(--dark)]" />
      {routeKey !== 'home' ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{ background: BACKGROUND_FALLBACKS[routeKey] }}
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate] opacity-90"
        style={{ backgroundImage: TWINKLE_BG }}
      />
      <div className="pointer-events-none absolute inset-0 [&_canvas]:pointer-events-none">
        <PageBackgroundCanvas key={routeKey} routeKey={routeKey} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--dark)]/0 via-transparent to-[var(--dark)]/20" />
    </div>
  )
}
