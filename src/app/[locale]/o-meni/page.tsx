'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowRight, BookOpen, Instagram } from 'lucide-react'
import OnlinePresence from '@/components/features/home/sections/OnlinePresence'
import DualStacksSection from '@/components/features/home/sections/DualStacksSection'
import { DARIO_INSTAGRAM_URL, MARTINA_INSTAGRAM_URL } from '@/lib/config/site'

const TEAM_MEMBERS = ['dario', 'martina'] as const
type TeamMemberId = (typeof TEAM_MEMBERS)[number]

const DARIO_FIELDS = ['location', 'experience', 'email', 'phone', 'languages', 'instagram'] as const
const MARTINA_FIELDS = ['focus', 'contribution', 'instagram'] as const

const TEAM_INSTAGRAM: Record<(typeof TEAM_MEMBERS)[number], string> = {
  dario: DARIO_INSTAGRAM_URL,
  martina: MARTINA_INSTAGRAM_URL,
}

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

function TeamInfoField({
  label,
  value,
  href,
  iconOnly,
}: {
  label: string
  value: string
  href?: string
  iconOnly?: boolean
}) {
  return (
    <div>
      <div className="text-[0.7rem] text-[var(--light-muted)] uppercase tracking-[0.15em] mb-1">{label}</div>
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={label}
          className={
            iconOnly
              ? 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[var(--primary)] transition-colors hover:border-[var(--primary)] hover:bg-white/[0.08]'
              : 'text-base font-semibold text-[var(--primary)] inline-flex items-center gap-1.5 hover:opacity-90'
          }
        >
          {href.includes('instagram') ? <Instagram className="w-4 h-4" /> : null}
          {!iconOnly ? value : null}
        </a>
      ) : (
        <div className="text-base font-semibold text-[var(--light)]">{value}</div>
      )}
    </div>
  )
}

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

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hash !== '#online-presence') return
    const scroll = () => document.getElementById('online-presence')?.scrollIntoView({ behavior: 'smooth' })
    const timer = window.setTimeout(scroll, 1400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <section className="pt-36 pb-10 text-center relative overflow-hidden cosmic-hero-band">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
          <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
            {t('heroTitleLine1') ? (
              <>
                {t('heroTitleLine1')}
                <br />
              </>
            ) : null}
            <span className="gradient-text">{t('heroTitleHighlight')}</span>
            {t('heroTitleLine2') ? (
              <>
                <br />
                {t('heroTitleLine2')}
              </>
            ) : null}
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[640px] mx-auto leading-7">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-4">{t('whoTitle')}</h3>
            <p className="text-sm text-[var(--light-muted)] leading-7">{t('studioIntro')}</p>
          </motion.div>

          <h3 className="text-xl font-bold mb-8 text-center">{t('teamTitle')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {TEAM_MEMBERS.map((member, index) => {
              const fields = member === 'dario' ? DARIO_FIELDS : MARTINA_FIELDS
              const expertise = t.raw(`team.${member}.expertise`) as string[]

              return (
                <motion.div
                  key={member}
                  id={member === 'dario' ? 'dario-imsirovic' : 'martina-markulin'}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.12 }}
                  className="cosmic-panel rounded-2xl p-8 h-full flex flex-col"
                >
                  <div className="mb-5">
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--primary)] mb-2">
                      {t(`team.${member}.label`)}
                    </p>
                    <h4 className="text-2xl font-extrabold text-[var(--light)] mb-1">{t(`team.${member}.name`)}</h4>
                    <p className="text-sm font-semibold text-cyan-200/90">{t(`team.${member}.role`)}</p>
                  </div>

                  <p className="text-sm text-[var(--light-muted)] leading-7 mb-4 flex-1">{t(`team.${member}.bio`)}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {expertise.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.65rem] uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 text-[var(--primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-5 pt-5 border-t border-white/10">
                    {fields.map((field) => {
                      const value = t(`team.${member}.fields.${field}`)
                      const label = t(`teamFieldLabels.${field}`)
                      const href =
                        field === 'email'
                          ? `mailto:${value}`
                          : field === 'instagram'
                            ? TEAM_INSTAGRAM[member]
                            : undefined

                      return (
                        <TeamInfoField
                          key={field}
                          label={label}
                          value={value}
                          href={href}
                          iconOnly={field === 'instagram'}
                        />
                      )
                    })}
                  </div>

                  {member === 'dario' && (
                    <p className="mt-6 text-sm">
                      <Link href="/blog" className="text-[var(--primary)] underline inline-flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {t('guideLink')} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <DualStacksSection />

      <OnlinePresence />

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
