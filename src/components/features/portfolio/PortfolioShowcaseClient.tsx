'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { PortfolioItem } from '@/types/portfolio'
import { ShowcaseBootLoader } from '@/components/three/showcase/ShowcaseBootLoader'

const SpaceGallery = dynamic(
  () => import('@/components/three/SpaceGallery').then((mod) => ({ default: mod.SpaceGallery })),
  {
    ssr: false,
    loading: () => <ShowcaseBootLoader />,
  },
)

type Props = {
  portfolioItems: PortfolioItem[]
}

export default function PortfolioShowcaseClient({ portfolioItems }: Props) {
  return (
    <Suspense fallback={<ShowcaseBootLoader />}>
      <SpaceGallery portfolioItems={portfolioItems} />
    </Suspense>
  )
}
