'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowRight, BookOpen } from 'lucide-react'

const infoKeys = ['name', 'location', 'experience', 'email', 'phone', 'languages'] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

const goalEmojis = ['\u{1F30E}', '\u{1F4BB}', '\u{1F510}']
const supportEmojis = ['\u{1F6E1}', '\u{1F4DA}', '\u{1F310}']
const supportBtnColors = [
  'bg-red-500 hover:bg-red-600',
  'bg-green-500 hover:bg-green-600',
  'bg-green-500 hover:bg-green-600',
]

export default function AboutPage() {
  const t = useTranslations('aboutPage')
  const goals = t.raw('goals') as Array<{ title: string; text: string }>
  const supportCards = t.raw('supportCards') as Array<{
    title: string
    text: string
    target: string
    btnText: string
    progress: number
  }>

  return (
    <>
      <section className="pt-36 pb-10 text-center relative overflow-hidden cosmic-hero-band">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
          <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
            {t('heroTitleLine1')}<br /><span className="gradient-text">{t('heroTitleHighlight')}</span><br />{t('heroTitleLine2')}
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h3 className="text-xl font-bold mb-5">{t('whoTitle')}</h3>
              <div className="space-y-4 text-sm text-[var(--light-muted)] leading-7">
                <p>{t('bio1')}</p>
                <p>{t('bio2')}</p>
                <p>{t('bio3')}</p>
                <p>{t('bio4')}</p>
                <p>
                  <Link href="/blog" className="text-[var(--primary)] underline inline-flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> {t('guideLink')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
              <h3 className="text-xl font-bold mb-6">{t('infoTitle')}</h3>
              <div className="flex flex-col gap-5">
                {infoKeys.map((key) => (
                  <div key={key}>
                    <div className="text-[0.7rem] text-[var(--light-muted)] uppercase tracking-[0.15em] mb-1">{t(`infoLabels.${key}`)}</div>
                    {key === 'email' ? (
                      <a href={`mailto:${t(`infoValues.${key}`)}`} className="text-base font-semibold text-[var(--primary)]">{t(`infoValues.${key}`)}</a>
                    ) : (
                      <div className="text-base font-semibold text-[var(--light)]">{t(`infoValues.${key}`)}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-10">{t('goalsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((g, i) => (
              <motion.div key={g.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="cosmic-panel rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-4">{goalEmojis[i]}</div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{g.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{g.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cosmic-section py-24 border-t border-b border-white/[0.06] text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('supportLabel')}</p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-5">
            {t('supportTitle')} <span className="gradient-text">{t('supportTitleHighlight')}</span>
          </h2>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7 mb-12">
            {t('supportSubtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportCards.map((c, i) => (
              <motion.div key={c.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="cosmic-panel rounded-2xl p-7 flex flex-col text-left">
                <div className="text-3xl mb-4">{supportEmojis[i]}</div>
                <h3 className="text-base font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1 mb-5">{c.text}</p>
                <div className="flex justify-between text-xs text-[var(--light-muted)] mb-3">
                  <span>{t('currencyZero')}</span>
                  <span>{t('currencyOf', { target: c.target })}</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden mb-5">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800]" style={{ width: `${c.progress}%` }} />
                </div>
                <button type="button" disabled aria-disabled="true" className={`inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 opacity-70 cursor-not-allowed ${supportBtnColors[i]}`}>
                  {c.btnText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
