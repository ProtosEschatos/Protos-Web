import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import LegalDocument from '@/components/legal/LegalDocument'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'legalPages' })
  return buildPageMetadata({
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    locale,
    path: '/privacy',
  })
}

export default function PrivacyPage() {
  return <LegalDocument namespace="privacy" />
}
