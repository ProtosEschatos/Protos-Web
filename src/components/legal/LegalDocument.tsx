'use client'

import { useTranslations } from 'next-intl'
import EffectCard from '@/components/ui/EffectCard'

type LegalDocumentProps = {
  namespace: 'privacy' | 'terms' | 'cookies'
}

export default function LegalDocument({ namespace }: LegalDocumentProps) {
  const t = useTranslations('legalPages')

  return (
    <section className="pt-36 pb-20">
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Protos Web</p>
        <h1 className="mb-8 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight">{t(`${namespace}Title`)}</h1>
        <EffectCard index={2} className="space-y-4 rounded-2xl p-6 text-sm leading-7 text-[var(--light-muted)] md:p-8">
          {t(`${namespace}Body`).split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </EffectCard>
      </div>
    </section>
  )
}
