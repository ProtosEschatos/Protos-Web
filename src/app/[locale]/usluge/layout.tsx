import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import JsonLd from '@/components/seo/JsonLd'
import PageBreadcrumbSeo from '@/components/seo/PageBreadcrumbSeo'
import { buildPageMetadata, servicesPageJsonLd } from '@/lib/config/seo'

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.services' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/usluge',
    seoPage: 'services',
  })
}

export default async function ServicesLayout(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

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
