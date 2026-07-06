'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/webgl'
import { BackgroundErrorBoundary } from '@/components/three/backgrounds/BackgroundErrorBoundary'
import AdminKnightMark from '@/components/admin/AdminKnightMark'

const AdminBackground3D = dynamic(
  () => import('@/components/three/backgrounds/AdminBackground'),
  { ssr: false, loading: () => null },
)

const TWINKLE_BG = `
  radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.35), transparent),
  radial-gradient(1px 1px at 68% 18%, rgba(255,136,0,0.4), transparent),
  radial-gradient(1px 1px at 42% 72%, rgba(139,92,246,0.35), transparent),
  radial-gradient(1px 1px at 88% 64%, rgba(6,182,212,0.3), transparent),
  radial-gradient(1.5px 1.5px at 24% 48%, rgba(255,255,255,0.2), transparent),
  radial-gradient(1px 1px at 76% 38%, rgba(255,102,0,0.25), transparent)
`

export default function AdminBackground() {
  const [mounted, setMounted] = useState(false)
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    setWebgl(isWebGLAvailable())
    setMounted(true)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#100818]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at 25% 35%, rgba(139,92,246,0.28) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(255,102,0,0.18) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.12) 0%, transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0 animate-[twinkle_10s_ease-in-out_infinite_alternate] opacity-80"
        style={{ backgroundImage: TWINKLE_BG }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#100818] via-transparent to-[#100818]/40" />

      {mounted && webgl ? (
        <div className="absolute inset-0 h-full w-full [&_canvas]:pointer-events-none">
          <BackgroundErrorBoundary fallback={null}>
            <AdminBackground3D />
          </BackgroundErrorBoundary>
        </div>
      ) : null}

      <AdminKnightMark className="absolute -right-[8%] bottom-[5%] w-[min(55vw,22rem)] h-auto opacity-[0.14] blur-[0.3px] pointer-events-none select-none" />
      <AdminKnightMark className="absolute -left-[12%] top-[8%] w-[min(40vw,14rem)] h-auto opacity-[0.06] rotate-12 scale-x-[-1] pointer-events-none select-none" />
    </div>
  )
}
