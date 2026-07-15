'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { ArrowRight, ExternalLink, ImageIcon, Layers } from 'lucide-react'
import type { PortfolioItem } from '@/types/portfolio'
import { PROTOS_WEB_MARQUEE } from '@/lib/config/tech-stacks'

const marqueeItems = PROTOS_WEB_MARQUEE

type Props = {
  featured: PortfolioItem | null
}

export default function Portfolio({ featured }: Props) {
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

        {featured ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-10 max-w-4xl text-left"
          >
            <div className="cosmic-panel overflow-hidden rounded-3xl hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition-all duration-300">
              {featured.image_url ? (
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-card-hover)] sm:aspect-[21/9]">
                  <ImageIcon className="h-10 w-10 text-[var(--light-muted)] opacity-30" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                {featured.tag ? (
                  <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                    {featured.tag}
                  </div>
                ) : null}
                <h3 className="mb-2 text-2xl font-bold text-[var(--light)] sm:text-3xl">{featured.title}</h3>
                {featured.description ? (
                  <p className="max-w-2xl text-base leading-7 text-[var(--light-muted)] sm:text-lg">{featured.description}</p>
                ) : null}
                {featured.project_url ? (
                  <a
                    href={featured.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)] hover:underline"
                  >
                    {t('viewProject')} <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}

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
