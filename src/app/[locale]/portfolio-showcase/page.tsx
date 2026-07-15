import { getPortfolioItems } from '@/lib/queries/portfolio'
import { setRequestLocale } from 'next-intl/server'
import PortfolioShowcaseClient from '@/components/features/portfolio/PortfolioShowcaseClient'

type Props = { params: Promise<{ locale: string }> }

export default async function PortfolioShowcasePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const portfolioItems = await getPortfolioItems(locale, 4)
  return <PortfolioShowcaseClient portfolioItems={portfolioItems} />
}
