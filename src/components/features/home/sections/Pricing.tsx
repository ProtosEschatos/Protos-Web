'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { Link } from '@/navigation'
import type { PricingPlanRow } from '@/lib/queries/pricing'

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
}

type Props = {
  plans: PricingPlanRow[]
}

export default function Pricing({ plans }: Props) {
  const t = useTranslations('pricing')

  if (plans.length === 0) return null

  return (
    <section className="cosmic-section py-24 border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>
        <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7 mb-12">{t('subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className={`cosmic-panel rounded-2xl p-8 text-left flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                p.highlighted
                  ? 'border-[var(--primary)]/50 shadow-[0_0_40px_rgba(255,102,0,0.15)] md:-translate-y-2'
                  : 'hover:border-[var(--primary)]/20'
              }`}
            >
              {p.badge ? (
                <span className="self-start mb-4 inline-block px-3 py-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] text-[0.7rem] font-semibold uppercase tracking-wider">
                  {p.badge}
                </span>
              ) : null}
              <h3 className="text-lg font-bold text-[var(--light)] mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold gradient-text">{p.price}</span>
                {p.period ? (
                  <span className="text-sm text-[var(--light-muted)]">/{p.period}</span>
                ) : null}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(p.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--light-muted)]">
                    <Check className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/kontakt"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  p.highlighted
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white hover:-translate-y-0.5'
                    : 'cosmic-panel text-[var(--light)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                {p.cta_text ?? t('ctaDefault')}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
