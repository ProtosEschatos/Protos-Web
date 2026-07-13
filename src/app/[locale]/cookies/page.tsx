import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/config/seo'
import LegalDocument from '@/components/legal/LegalDocument'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'legalPages' })
  return buildPageMetadata({
    title: t('cookiesTitle'),
    description: t('cookiesDescription'),
    locale,
    path: '/cookies',
  })
}

export default function CookiesPage() {
  return <LegalDocument namespace="cookies" />
}
