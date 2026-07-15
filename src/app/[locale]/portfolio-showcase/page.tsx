import { getPortfolioItems } from '@/lib/queries/portfolio'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import PortfolioShowcaseClient from '@/components/features/portfolio/PortfolioShowcaseClient'
import JsonLd from '@/components/seo/JsonLd'
import { showcasePageJsonLd } from '@/lib/config/seo'

type Props = { params: Promise<{ locale: string }> }

export default async function PortfolioShowcasePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.showcase' })
  const portfolioItems = await getPortfolioItems(locale, 12)
  const pageLd = showcasePageJsonLd(locale, t('title'), t('description'))

  return (
    <>
      <JsonLd data={pageLd} />
      <PortfolioShowcaseClient portfolioItems={portfolioItems} />
    </>
  )
}
