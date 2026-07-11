'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SERVICE_ICONS } from '@/components/ui/section-icons'

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)]',
}

const colors = ['primary', 'secondary', 'accent', 'primary', 'secondary', 'accent']

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
}

export default function Services() {
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ title: string; text: string }>

  return (
    <section className="cosmic-section py-24 border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="cosmic-panel rounded-2xl p-8 flex gap-5 hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${colorMap[colors[i]]}`}>
                {(() => {
                  const Icon = SERVICE_ICONS[i]
                  return <Icon className="w-5 h-5" />
                })()}
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
