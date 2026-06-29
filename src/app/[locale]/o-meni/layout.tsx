import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = { params: { locale: string }; children: React.ReactNode }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  return { title: t('title'), description: t('description') }
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
