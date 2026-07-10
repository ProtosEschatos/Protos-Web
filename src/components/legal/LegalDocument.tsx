'use client'

import { useTranslations } from 'next-intl'

type LegalSection = {
  title: string
  paragraphs: string[]
}

type LegalDocumentProps = {
  namespace: 'privacy' | 'terms' | 'cookies'
}

export default function LegalDocument({ namespace }: LegalDocumentProps) {
  const t = useTranslations('legalPages')
  const sections = t.raw(`${namespace}Sections`) as LegalSection[] | undefined
  const legacyBody = sections?.length ? null : t(`${namespace}Body`)

  return (
    <section className="pt-36 pb-20 cosmic-hero-band">
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Protos Web</p>
        <h1 className="mb-3 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight">{t(`${namespace}Title`)}</h1>
        <p className="mb-8 text-xs uppercase tracking-[0.14em] text-[var(--light-muted)]">
          {t('lastUpdated')}: {t('lastUpdatedDate')}
        </p>
        <div className="cosmic-panel space-y-8 rounded-2xl p-6 text-sm leading-7 text-[var(--light-muted)] md:p-8">
          {sections?.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-base font-bold text-[var(--light)]">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.title}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
              ))}
            </div>
          ))}
          {legacyBody
            ? legacyBody.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))
            : null}
        </div>
      </div>
    </section>
  )
}
