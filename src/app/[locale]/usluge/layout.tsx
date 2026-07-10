import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import JsonLd from '@/components/seo/JsonLd'
import PageBreadcrumbSeo from '@/components/seo/PageBreadcrumbSeo'
import { buildPageMetadata, servicesPageJsonLd } from '@/lib/seo'

type Props = { params: { locale: string }; children: React.ReactNode }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.services' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/usluge',
  })
}

export default async function ServicesLayout({ children, params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.services' })

  return (
    <>
      <PageBreadcrumbSeo locale={locale} path="/usluge" pageTitle={t('title')} />
      <JsonLd
        data={servicesPageJsonLd(locale, t('title'), t('description'))}
      />
      {children}
    </>
  )
}
