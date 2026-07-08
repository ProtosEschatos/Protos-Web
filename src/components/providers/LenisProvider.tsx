'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePathname } from '@/routing'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShowcase = pathname.includes('portfolio-showcase')
  const isAdmin = pathname.includes('/admin')

  useEffect(() => {
    if (isShowcase || isAdmin) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame = 0
    function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [isShowcase, isAdmin])

  return <>{children}</>
}
