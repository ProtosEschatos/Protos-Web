import { getShowcasePortfolioItems } from '@/lib/queries/portfolio'
import { setRequestLocale } from 'next-intl/server'
import PortfolioShowcaseClient from '@/components/features/portfolio/PortfolioShowcaseClient'
import { FRAME_SLOTS } from '@/components/three/showcase/constants'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function PortfolioShowcasePage({ params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)
  const portfolioItems = await getShowcasePortfolioItems(locale, FRAME_SLOTS)
  return <PortfolioShowcaseClient portfolioItems={portfolioItems} />
}
