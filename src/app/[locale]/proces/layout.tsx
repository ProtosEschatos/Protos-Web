import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/config/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.process' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/proces',
  })
}

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return children
}
