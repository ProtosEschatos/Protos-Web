'use client'

import type { PortfolioItem } from '@/types/portfolio'
import { SpaceGallery } from '@/components/three/SpaceGallery'

type Props = {
  portfolioItems: PortfolioItem[]
  focusPoklon?: boolean
}

export default function PortfolioShowcaseClient({ portfolioItems, focusPoklon = false }: Props) {
  return <SpaceGallery portfolioItems={portfolioItems} focusPoklon={focusPoklon} />
}
