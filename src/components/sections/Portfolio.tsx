'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

const projects = [
  { cat: 'INDUSTRIAL DESIGN', name: 'Coating Tools', desc: '30+ years of experience in industrial solutions', color: 'text-[var(--primary)]' },
  { cat: 'E-COMMERCE CREATIVE', name: 'Mood Water', desc: 'Take a sip, enjoy the trip - Vibrant brand', color: 'text-[var(--secondary)]' },
  { cat: 'DIGITAL STUDIO', name: 'Estrela Studio', desc: 'A people first digital studio', color: 'text-[var(--accent)]' },
]

const marqueeItems = ['NEXT.JS', 'TYPESCRIPT', 'TAILWIND', 'THREE.JS', 'FRAMER MOTION', 'WEBGL', 'SUPABASE']

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
}

export default function Portfolio() {
  const t = useTranslations('portfolio')

  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>

        <div className="overflow-hidden py-6 relative before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-24 before:bg-gradient-to-r before:from-[var(--dark)] before:to-transparent before:z-10 after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-24 after:bg-gradient-to-l after:from-[var(--dark)] after:to-transparent after:z-10">
          <div className="flex gap-12 animate-[marquee_25s_linear_infinite] w-max">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="text-xl font-bold uppercase tracking-[0.1em] text-white/[0.12] whitespace-nowrap">
                {item} {i < marqueeItems.length * 2 - 1 && <span className="mx-4">&bull;</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-card-hover)] flex items-center justify-center">
                <i className="fas fa-image text-3xl text-[var(--light-muted)] opacity-30" />
              </div>
              <div className="p-5 text-left">
                <div className={`text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 ${p.color}`}>{p.cat}</div>
                <div className="text-lg font-bold text-[var(--light)] mb-1">{p.name}</div>
                <div className="text-sm text-[var(--light-muted)]">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-[var(--secondary)]/15 to-[var(--accent)]/10 border border-[var(--secondary)]/20 rounded-3xl p-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] text-lg">
              <i className="fas fa-layer-group" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-[var(--light)]">{t('showcaseTitle')}</div>
              <div className="text-sm text-[var(--light-muted)]">{t('showcaseText')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent)]">{t('showcaseCta')}</span>
            <Link href="/portfolio-showcase" className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300" aria-label={t('showcaseCta')}>
              <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
