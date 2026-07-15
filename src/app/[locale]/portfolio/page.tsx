import { getShowcasePortfolioItems } from '@/lib/queries/portfolio'
import { setRequestLocale } from 'next-intl/server'
import PortfolioShowcaseClient from '@/components/features/portfolio/PortfolioShowcaseClient'
import { SHOWCASE_FOCUS_PARAM, SHOWCASE_POKLON_FOCUS } from '@/lib/showcase/featured-demo'
import { FRAME_SLOTS } from '@/components/three/showcase/constants'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PortfolioPage({ params, searchParams }: Props) {
  const { locale } = await params
  const query = await searchParams
  const focusRaw = query[SHOWCASE_FOCUS_PARAM]
  const focusPoklon = (Array.isArray(focusRaw) ? focusRaw[0] : focusRaw) === SHOWCASE_POKLON_FOCUS

  setRequestLocale(locale)
  const portfolioItems = await getShowcasePortfolioItems(locale, FRAME_SLOTS)
  return <PortfolioShowcaseClient portfolioItems={portfolioItems} focusPoklon={focusPoklon} />
}
