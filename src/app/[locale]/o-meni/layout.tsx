import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/config/seo'
import { buildAboutPageJsonLd } from '@/lib/config/creator-seo'
import { LOCALIZED_PATHS, aboutPathForLocale } from '@/lib/routes/localized-paths'

type Props = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: aboutPathForLocale(locale),
    pathsByLocale: LOCALIZED_PATHS.about,
    ogImagePath: '/api/og?type=about',
    seoPage: 'about',
  })
}

export default async function AboutLayout(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

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
