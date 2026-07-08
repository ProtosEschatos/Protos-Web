'use client'

import { useTranslations } from 'next-intl'
import { PROCESS_FEATURE_ICONS } from '@/lib/section-icons'
import EffectCard from '@/components/ui/EffectCard'
const featureColors = ['primary', 'secondary', 'accent']

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)]',
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
}

export default function Process() {
  const t = useTranslations('process')
  const steps = t.raw('steps') as Array<{ num: string; title: string; text: string }>
  const features = t.raw('features') as Array<{ title: string; text: string }>

  return (
    <section className="cosmic-section py-24 border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-10">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <EffectCard
              key={s.num}
              index={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="rounded-2xl p-7 text-left"
            >
              <div className="text-4xl font-extrabold gradient-text mb-4 leading-none">{s.num}</div>
              <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.text}</p>
            </EffectCard>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((f, i) => (
            <EffectCard
              key={f.title}
              index={i + 4}
              custom={i + 4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="rounded-3xl p-8 text-center"
            >
              <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl ${colorMap[featureColors[i]]}`}>
                {(() => {
                  const Icon = PROCESS_FEATURE_ICONS[i]
                  return <Icon className="w-5 h-5" />
                })()}
              </div>
              <h3 className="text-base font-bold text-[var(--light)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--light-muted)] leading-relaxed">{f.text}</p>
            </EffectCard>
          ))}
        </div>
      </div>
    </section>
  )
}
