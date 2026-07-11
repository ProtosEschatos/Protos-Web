import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import PageBreadcrumbSeo from '@/components/seo/PageBreadcrumbSeo'
import { buildPageMetadata } from '@/lib/config/seo'

type Props = { params: { locale: string }; children: React.ReactNode }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.portfolio' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/portfolio',
  })
}

export default async function PortfolioLayout({ children, params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.portfolio' })

  return (
    <>
      <PageBreadcrumbSeo locale={locale} path="/portfolio" pageTitle={t('title')} />
      {children}
    </>
  )
}
