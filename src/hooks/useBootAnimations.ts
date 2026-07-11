'use client'

import { useEffect, useState } from 'react'
import { BOOT_COMPLETE_EVENT, isBootComplete } from '@/lib/boot-gate'

/** True once boot gate has passed — skip hidden initial motion states. */
export function useBootAnimations(): boolean {
  const [shouldAnimateFromHidden, setShouldAnimateFromHidden] = useState(
    () => typeof window !== 'undefined' && !isBootComplete(),
  )

  useEffect(() => {
    const sync = () => setShouldAnimateFromHidden(!isBootComplete())
    sync()
    window.addEventListener(BOOT_COMPLETE_EVENT, sync)
    return () => window.removeEventListener(BOOT_COMPLETE_EVENT, sync)
  }, [])

  return shouldAnimateFromHidden
}
