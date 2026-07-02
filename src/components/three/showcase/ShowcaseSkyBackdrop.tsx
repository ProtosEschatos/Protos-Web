'use client'

import { useEffect, useRef } from 'react'
import { SHOWCASE_BACKDROP } from '@/lib/showcase-backdrop'

type Props = {
  parallaxRef: React.MutableRefObject<number>
}

export function ShowcaseSkyBackdrop({ parallaxRef }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const el = ref.current
      if (el) {
        const shift = Math.max(-80, Math.min(80, parallaxRef.current * 0.35))
        el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.06)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [parallaxRef])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 will-change-transform"
      style={{
        backgroundImage: `url(${SHOWCASE_BACKDROP})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
