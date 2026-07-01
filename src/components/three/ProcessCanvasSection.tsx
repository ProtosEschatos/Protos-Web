'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/webgl'

const ProcessCanvas = dynamic(() => import('@/components/three/ProcessCanvas'), {
  ssr: false,
  loading: () => null,
})

const cssFallback = (
  <div
    className="pointer-events-none absolute inset-0 opacity-60"
    aria-hidden
    style={{
      background:
        'radial-gradient(ellipse at 30% 50%, rgba(255,102,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.12) 0%, transparent 55%)',
    }}
  />
)

export default function ProcessCanvasSection() {
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(isWebGLAvailable())
    setMounted(true)
  }, [])

  if (!mounted) {
    return cssFallback
  }

  if (!supported) {
    return cssFallback
  }

  return (
    <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
      <ProcessCanvas />
    </div>
  )
}
