'use client'

import type { ComponentProps } from 'react'
import { Link } from '@/navigation'

type Props = ComponentProps<typeof Link>

/** Prefetch the heavy SpaceGallery chunk before the user navigates to showcase. */
export default function ShowcasePrefetchLink({ onMouseEnter, onFocus, ...rest }: Props) {
  const prefetchShowcase = () => {
    void import('@/components/three/SpaceGallery')
  }

  return (
    <Link
      {...rest}
      onMouseEnter={(event) => {
        prefetchShowcase()
        onMouseEnter?.(event)
      }}
      onFocus={(event) => {
        prefetchShowcase()
        onFocus?.(event)
      }}
    />
  )
}
