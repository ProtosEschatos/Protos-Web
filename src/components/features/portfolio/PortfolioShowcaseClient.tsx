'use client'

import { SpaceGallery } from '@/components/three/SpaceGallery'
import type { PortfolioItem } from '@/types/portfolio'

type Props = {
  portfolioItems: PortfolioItem[]
  focusPoklon?: boolean
}

export default function PortfolioShowcaseClient({ portfolioItems, focusPoklon = false }: Props) {
  return <SpaceGallery portfolioItems={portfolioItems} focusPoklon={focusPoklon} />
}
