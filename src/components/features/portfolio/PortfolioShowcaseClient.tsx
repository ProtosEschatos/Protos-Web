'use client'

import dynamic from 'next/dynamic'
import type { PortfolioItem } from '@/types/portfolio'

const SpaceGallery = dynamic(
  () => import('@/components/three/SpaceGallery').then((mod) => ({ default: mod.SpaceGallery })),
  { ssr: false, loading: () => null },
)

type Props = {
  portfolioItems: PortfolioItem[]
  focusPoklon?: boolean
}

export default function PortfolioShowcaseClient({ portfolioItems, focusPoklon = false }: Props) {
  return <SpaceGallery portfolioItems={portfolioItems} focusPoklon={focusPoklon} />
}
