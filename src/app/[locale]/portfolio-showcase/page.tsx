import dynamic from 'next/dynamic'
import { getPortfolioItems } from '@/lib/queries/portfolio'
import { ShowcaseBootLoader } from '@/components/three/showcase/ShowcaseBootLoader'
import { setRequestLocale } from 'next-intl/server'

const SpaceGallery = dynamic(
  () => import('@/components/three/SpaceGallery').then((mod) => ({ default: mod.SpaceGallery })),
  {
    ssr: false,
    loading: () => <ShowcaseBootLoader />,
  },
)

type Props = { params: { locale: string } }

export default async function PortfolioShowcasePage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const portfolioItems = await getPortfolioItems(locale, 4)
  return <SpaceGallery portfolioItems={portfolioItems} />
}
