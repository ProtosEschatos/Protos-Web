import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import { getPortfolioItems } from '@/actions/portfolio'

const RetrowaveRoom = dynamic(
  () => import('@/components/three/showcase/RetrowaveRoom'),
  { ssr: false },
)

type Props = { params: { locale: string } }

export default async function PortfolioShowcasePage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const items = await getPortfolioItems(locale, 8)
  return <RetrowaveRoom items={items} />
}
