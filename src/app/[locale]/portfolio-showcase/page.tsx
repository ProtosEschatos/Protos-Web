import { getPortfolioItems } from '@/actions/portfolio'
import { SpaceGallery } from '@/components/three/SpaceGallery'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: { locale: string } }

export default async function PortfolioShowcasePage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const portfolioItems = await getPortfolioItems(locale, 4)
  return <SpaceGallery portfolioItems={portfolioItems} />
}
