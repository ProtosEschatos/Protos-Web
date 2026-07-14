'use client'

import { useLayoutEffect } from 'react'
import { clearBootPending, removeBootSsrVeil } from '@/lib/config/boot-gate'

/** Showcase must never show the public-site boot veil or PageLoader chrome. */
export function ShowcaseBootBypass() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-route', 'showcase')
    document.documentElement.classList.remove('boot-pending')
    document.documentElement.classList.add('boot-complete')
    clearBootPending()
    removeBootSsrVeil()
    document.body.style.overflow = 'hidden'
    void import('@/components/three/SpaceGallery')
  }, [])

  return null
}
