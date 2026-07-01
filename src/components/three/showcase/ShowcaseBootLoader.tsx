'use client'

import { useState, useEffect } from 'react'
import { ShowcaseLoadingScreen } from '@/components/three/showcase/ShowcaseLoadingScreen'

export function ShowcaseBootLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 12 + 4
        return next >= 100 ? 0 : next
      })
    }, 180)
    return () => clearInterval(interval)
  }, [])

  return <ShowcaseLoadingScreen progress={progress} />
}
