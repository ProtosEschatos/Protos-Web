import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/routing'
import { ArrowRight } from 'lucide-react'
import { getServices } from '@/lib/queries/services'
import ServicesGrid from '@/components/features/services/ServicesGrid'
import FaqSection from '@/components/features/home/sections/FaqSection'

type Props = { params: { locale: string } }

// `services` has no admin CRUD (and therefore no revalidatePath on edit)
// yet, so re-fetch periodically rather than only at build/deploy time.
export const revalidate = 300

export default async function ServicesPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'services' })
  const items = await getServices(locale)
  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>

  return (
    <>
      <section className="pt-36 pb-16 text-center relative overflow-hidden cosmic-hero-band">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">{t('pageSubtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ServicesGrid items={items} />
        </div>
      </section>

      <FaqSection
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        items={faqItems}
        locale={locale}
      />

      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-4">{t('ctaTitle')}</h2>
          <p className="text-base text-[var(--light-muted)] mb-8">{t('ctaText')}</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300">
            {t('ctaButton')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
