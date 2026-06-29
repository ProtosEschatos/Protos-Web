'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

const featureIcons = ['fas fa-bolt', 'fas fa-clock', 'fas fa-shield-halved']
const featureColors = [
  'bg-[var(--primary)]/15 text-[var(--primary)]',
  'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  'bg-[var(--accent)]/15 text-[var(--accent)]',
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

export default function ProcessPage() {
  const t = useTranslations('processPage')
  const steps = t.raw('steps') as Array<{ num: string; title: string; text: string }>
  const features = t.raw('features') as Array<{ title: string; text: string }>
  const stats = t.raw('stats') as Array<{ value: string; label: string }>
  const techs = t.raw('technologies') as string[]

  return (
    <>
      <section className="pt-36 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,102,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_30%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-7 hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl font-extrabold gradient-text mb-4 leading-none">{s.num}</div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-3xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl ${featureColors[i]}`}>
                  <i className={featureIcons[i]} />
                </div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center pb-16">
        <Link href="/kontakt" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300">
          {t('cta')} <i className="fas fa-arrow-right" />
        </Link>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-center p-8 border border-[var(--border-card)] rounded-3xl bg-[var(--dark-card)]">
                <div className="text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
                <div className="text-xs text-[var(--light-muted)]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-8">{t('technologiesTitle')}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {techs.map((tech) => (
              <span key={tech} className="px-6 py-2.5 border border-[var(--border-card)] rounded-full text-sm font-medium text-[var(--light)] bg-[var(--dark-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
