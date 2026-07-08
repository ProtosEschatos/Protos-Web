'use client'

import { useTranslations } from 'next-intl'
import ComingSoon from '@/components/sections/ComingSoon'

const marqueeItems = ['NEXT.JS', 'TYPESCRIPT', 'TAILWIND', 'THREE.JS', 'FRAMER MOTION', 'WEBGL', 'SUPABASE']

export default function Portfolio() {
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

        <ComingSoon />
      </div>
    </section>
  )
}
