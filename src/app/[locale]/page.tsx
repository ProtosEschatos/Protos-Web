import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Portfolio from '@/components/sections/Portfolio'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'

type Props = { params: { locale: string } }

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '',
  })
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Process />
      <Portfolio />
      <Services />
      <Blog />
      <Contact />
    </>
  )
}
