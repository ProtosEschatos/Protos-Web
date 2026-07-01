'use client'

import { usePathname } from '@/routing'
import { getBackgroundKey } from '@/lib/site-background-routes'
import PageBackgroundCanvas from '@/components/three/backgrounds/PageBackgroundCanvas'

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

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none isolate" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,102,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,rgba(6,182,212,0.04)_0%,transparent_50%)]" />
      <div
        className="absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate] opacity-80"
        style={{ backgroundImage: TWINKLE_BG }}
      />
      <div className="absolute inset-0 opacity-[0.38] saturate-[0.85]">
        <PageBackgroundCanvas routeKey={routeKey} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--dark)]/30 via-transparent to-[var(--dark)]/90" />
    </div>
  )
}
