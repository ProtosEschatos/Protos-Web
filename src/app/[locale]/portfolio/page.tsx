import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolioItems } from '@/lib/queries/portfolio'
import JsonLd from '@/components/seo/JsonLd'
import { portfolioItemListJsonLd } from '@/lib/config/seo'
import { PROTOS_WEB_MARQUEE } from '@/lib/config/tech-stacks'
import { Link } from '@/navigation'
import { ArrowRight, Layers } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export default async function PortfolioPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'portfolioPage' })
  const items = await getPortfolioItems(locale, 12)
  const itemListLd = portfolioItemListJsonLd(items, locale)

  const marqueeItems = PROTOS_WEB_MARQUEE

  return (
    <>
      <JsonLd data={itemListLd} />
      <section className="pt-36 pb-16 text-center relative overflow-hidden cosmic-hero-band">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">{t('subtitle')}</p>
        </div>
      </section>

      <div className="overflow-hidden py-6 relative before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-24 before:bg-gradient-to-r before:from-[var(--dark)] before:to-transparent before:z-10 after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-24 after:bg-gradient-to-l after:from-[var(--dark)] after:to-transparent after:z-10">
        <div className="flex gap-12 animate-[marquee_25s_linear_infinite] w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-xl font-bold uppercase tracking-[0.1em] text-white/[0.12] whitespace-nowrap">
              {item} <span className="mx-4">•</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-16 cosmic-section">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="text-center text-[var(--light-muted)] mb-10 leading-7 max-w-2xl mx-auto">{t('showcaseOnlyHint')}</p>

          <div className="bg-gradient-to-r from-[var(--secondary)]/15 to-[var(--accent)]/10 border border-[var(--secondary)]/20 rounded-3xl p-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] text-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-500 text-[0.7rem] font-semibold uppercase mb-1">NEW</span>
                <div className="text-lg font-bold text-[var(--light)]">{t('showcaseTitle')}</div>
                <div className="text-sm text-[var(--light-muted)]">{t('showcaseText')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent)]">{t('showcaseCta')}</span>
              <Link href="/portfolio-showcase" className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
