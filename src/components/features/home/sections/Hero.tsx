'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import TransitionLink from '@/components/navigation/TransitionLink'
import ShowcasePrefetchLink from '@/components/features/portfolio/ShowcasePrefetchLink'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' as const },
  }),
}

export default function Hero() {
  const t = useTranslations('hero')
  const stats = [
    { ...t.raw('stats.projects'), orange: true },
    { ...t.raw('stats.satisfaction'), orange: true },
    { ...t.raw('stats.languages'), orange: false },
    { ...t.raw('stats.webgl'), orange: false },
  ] as Array<{ value: string; suffix: string; label: string; orange: boolean }>

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-[1200px]">
        <div className="max-w-[700px]">
          <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp} className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-[var(--light-muted)] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-px before:bg-[var(--primary)]">
            {t('label')}
          </motion.p>
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[1.05] mb-6">
            {t('title_line1')}<br />{t('title_line2')}<br />
            <span className="gradient-text">{t('title_line3')}</span>
          </motion.h1>
          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-base text-[var(--light-muted)] mb-9 leading-7 max-w-[520px]">
            {t('subtitle')}
          </motion.p>
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-4 flex-wrap mb-16">
            <TransitionLink href="/kontakt" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--primary-glow)] transition-all duration-300">
              {t('cta_primary')} <ArrowRight className="w-3 h-3" />
            </TransitionLink>
            <TransitionLink href="/portfolio" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--border-card)] text-[var(--light)] text-xs font-semibold uppercase tracking-wider hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
              {t('cta_secondary')} <ArrowRight className="w-3 h-3" />
            </TransitionLink>
            <ShowcasePrefetchLink href="/portfolio?focus=poklon" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#a78bfa]/50 bg-[#6366f1]/10 text-[#ddd6fe] text-xs font-semibold uppercase tracking-wider hover:border-[#a78bfa] hover:bg-[#6366f1]/25 transition-all duration-300">
              {t('cta_gift')} <ArrowRight className="w-3 h-3" />
            </ShowcasePrefetchLink>
          </motion.div>
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex gap-10 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-[var(--light)] mb-1">
                  {s.orange ? <span className="text-[var(--primary)]">{s.value}</span> : s.value}
                  {s.suffix && <span className={s.orange ? '' : 'text-sm text-[var(--light-muted)] ml-1'}>{s.suffix}</span>}
                </div>
                <div className="text-[0.75rem] text-[var(--light-muted)] tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
