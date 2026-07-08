'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowRight, BookOpen } from 'lucide-react'
import DonateButton from '@/components/sections/DonateButton'
import OnlinePresence from '@/components/sections/OnlinePresence'

import ContactChannels from '@/components/ui/ContactChannels'
import EffectCard from '@/components/ui/EffectCard'
import { WHATSAPP_URL } from '@/lib/social-links'

const infoKeys = ['name', 'location', 'experience', 'contact', 'phone', 'languages'] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

const goalEmojis = ['\u{1F30E}', '\u{1F4BB}', '\u{1F510}']
const supportEmojis = ['\u{1F6E1}', '\u{1F4DA}', '\u{1F310}']

export default function AboutPage() {
  const t = useTranslations('aboutPage')
  const goals = t.raw('goals') as Array<{ title: string; text: string }>
  const supportCards = t.raw('supportCards') as Array<{
    title: string
    text: string
    target: string
    progress: number
  }>

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hash !== '#online-presence') return
    const scroll = () => document.getElementById('online-presence')?.scrollIntoView({ behavior: 'smooth' })
    // wait for the page transition overlay to finish before scrolling
    const timer = window.setTimeout(scroll, 1400)
    return () => window.clearTimeout(timer)
  }, [])

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
                    {key === 'contact' ? (
                      <ContactChannels iconClassName="w-5 h-5" />
                    ) : key === 'phone' ? (
                      <a href={WHATSAPP_URL} className="text-base font-semibold text-[var(--primary)] hover:underline">
                        {t(`infoValues.${key}`)}
                      </a>
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

      <OnlinePresence />

      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-10">{t('goalsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((g, i) => (
              <EffectCard
                key={g.title}
                index={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl p-8 text-center"
              >
                <div className="text-3xl mb-4">{goalEmojis[i]}</div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{g.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{g.text}</p>
              </EffectCard>
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
              <EffectCard
                key={c.title}
                index={i + 3}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl p-7 flex flex-col text-left"
              >
                <div className="text-3xl mb-4">{supportEmojis[i]}</div>
                <h3 className="text-base font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1 mb-5">{c.text}</p>
                <div className="flex justify-between text-xs text-[var(--light-muted)] mb-3">
                  <span>{t('currencyZero')}</span>
                  <span>{t('currencyOf', { target: c.target })}</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800]" style={{ width: `${c.progress}%` }} />
                </div>
              </EffectCard>
            ))}
          </div>
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <DonateButton />
          </motion.div>
        </div>
      </section>
    </>
  )
}
