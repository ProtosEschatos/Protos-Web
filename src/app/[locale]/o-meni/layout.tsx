import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import { buildAboutPageJsonLd } from '@/lib/creator-seo'

type Props = {
  params: { locale: string }
  children: React.ReactNode
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/o-meni',
    ogImagePath: '/api/og?type=about',
  })
}

export default async function AboutLayout({ children, params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  const jsonLd = buildAboutPageJsonLd(locale, t('title'), t('description'))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
