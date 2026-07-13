import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPosts } from '@/lib/queries/blog'
import { getPortfolioItems } from '@/lib/queries/portfolio'
import { getServices } from '@/lib/queries/services'
import { getProcessSteps } from '@/lib/queries/process'
import { buildPageMetadata } from '@/lib/config/seo'
import Hero from '@/components/features/home/sections/Hero'
import Services from '@/components/features/home/sections/Services'
import Process from '@/components/features/home/sections/Process'
import Portfolio from '@/components/features/home/sections/Portfolio'
import Blog from '@/components/features/home/sections/Blog'
import Contact from '@/components/features/home/sections/Contact'

type Props = { params: { locale: string } }

// Services/process/pricing/testimonials have no admin CRUD (and therefore no
// revalidatePath on edit) yet, so re-fetch periodically rather than only at
// build/deploy time.
export const revalidate = 300

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

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale)

  const [blogPosts, portfolioItems, services, processSteps] = await Promise.all([
      getBlogPosts(3, locale),
      getPortfolioItems(locale, 3),
      getServices(locale),
      getProcessSteps(locale),
    ])

  return (
    <>
      <Hero />
      <Process steps={processSteps} />
      <Portfolio items={portfolioItems} />
      <Services items={services} />
      <Blog posts={blogPosts} locale={locale} />
      <Contact />
    </>
  )
}
