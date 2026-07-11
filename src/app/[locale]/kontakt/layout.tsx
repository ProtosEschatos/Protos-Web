import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import JsonLd from '@/components/seo/JsonLd'
import PageBreadcrumbSeo from '@/components/seo/PageBreadcrumbSeo'
import { buildPageMetadata, contactPageJsonLd } from '@/lib/config/seo'

type Props = { params: { locale: string }; children: React.ReactNode }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.contact' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/kontakt',
  })
}

export default async function ContactLayout({ children, params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.contact' })

  return (
    <>
      <PageBreadcrumbSeo locale={locale} path="/kontakt" pageTitle={t('title')} />
      <JsonLd data={contactPageJsonLd(locale, t('title'), t('description'))} />
      {children}
    </>
  )
}
