import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPosts } from '@/lib/queries/blog'
import { buildPageMetadata } from '@/lib/config/seo'
import Hero from '@/components/features/home/sections/Hero'
import Services from '@/components/features/home/sections/Services'
import Process from '@/components/features/home/sections/Process'
import Portfolio from '@/components/features/home/sections/Portfolio'
import Blog from '@/components/features/home/sections/Blog'
import Contact from '@/components/features/home/sections/Contact'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'metadata.home' })
  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '',
    seoPage: 'home',
  })
}

export default async function HomePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const blogPosts = await getBlogPosts(3, locale)

  return (
    <>
      <Hero />
      <Process />
      <Portfolio />
      <Services />
      <Blog posts={blogPosts} locale={locale} />
      <Contact />
    </>
  )
}
