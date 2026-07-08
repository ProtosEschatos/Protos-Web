import dynamic from 'next/dynamic'
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
  return <SpaceGallery />
}
