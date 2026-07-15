'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { ArrowRight, Layers } from 'lucide-react'
import type { PortfolioItem } from '@/types/portfolio'
import PortfolioGrid from '@/components/features/portfolio/PortfolioGrid'
import { PROTOS_WEB_MARQUEE } from '@/lib/config/tech-stacks'

const marqueeItems = PROTOS_WEB_MARQUEE

type Props = {
  items: PortfolioItem[]
}

export default function Portfolio({ items }: Props) {
  const t = useTranslations('portfolio')

  return (
    <section className="py-24 cosmic-section">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>

        <div className="overflow-hidden py-6 relative before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-24 before:bg-gradient-to-r before:from-[var(--dark)] before:to-transparent before:z-10 after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-24 after:bg-gradient-to-l after:from-[var(--dark)] after:to-transparent after:z-10">
          <div className="flex gap-12 animate-[marquee_25s_linear_infinite] w-max">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="text-xl font-bold uppercase tracking-[0.1em] text-white/[0.12] whitespace-nowrap">
                {item} {i < marqueeItems.length * 2 - 1 && <span className="mx-4">•</span>}
              </span>
            ))}
          </div>
        </div>

        <PortfolioGrid items={items} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-[var(--secondary)]/15 to-[var(--accent)]/10 border border-[var(--secondary)]/20 rounded-3xl p-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] text-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-[var(--light)]">{t('showcaseTitle')}</div>
              <div className="text-sm text-[var(--light-muted)]">{t('showcaseText')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent)]">{t('showcaseCta')}</span>
            <Link href="/portfolio-showcase" className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300" aria-label={t('showcaseCta')}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
