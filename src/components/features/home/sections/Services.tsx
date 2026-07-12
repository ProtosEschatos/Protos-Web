'use client'

import { useTranslations } from 'next-intl'
import ServicesGrid from '@/components/features/services/ServicesGrid'
import type { ServiceRow } from '@/lib/queries/services'

type Props = {
  items: ServiceRow[]
}

export default function Services({ items }: Props) {
  const t = useTranslations('services')

  return (
    <section className="cosmic-section py-24 border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>
        <div className="mt-10">
          <ServicesGrid items={items} />
        </div>
      </div>
    </section>
  )
}
