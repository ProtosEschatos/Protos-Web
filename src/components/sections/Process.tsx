'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const steps = [
  { num: '01', title: 'We learn your business', text: 'No sales pitches — we sit down, listen, and understand what you actually need.' },
  { num: '02', title: 'Design and strategy on the table', text: 'Before we write a single line of code, we show you exactly how every page will look.' },
  { num: '03', title: 'Build and go live', text: 'You run your business, we build your website — we only reach out when we need a decision.' },
  { num: '04', title: 'We grow together', text: 'After launch, we don\'t disappear — we stay available for whatever you need.' },
]

const features = [
  { icon: 'fas fa-bolt', title: 'Speed', text: 'Average delivery time is 2-3 weeks for a standard project.', color: 'primary' },
  { icon: 'fas fa-clock', title: 'Deadlines', text: 'We respect agreed deadlines. Each step has a clear timeline.', color: 'secondary' },
  { icon: 'fas fa-shield-halved', title: 'Security', text: 'SSL, backups and best data protection practices are included in every project.', color: 'accent' },
]

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
  return (
    <section className="py-24 bg-[var(--dark-surface)] border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-10">
          How <span className="gradient-text">we work</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-7 hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="text-4xl font-extrabold gradient-text mb-4 leading-none">{s.num}</div>
              <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i + 4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-3xl p-8 text-center hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl ${colorMap[f.color]}`}>
                <i className={f.icon} />
              </div>
              <h3 className="text-base font-bold text-[var(--light)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--light-muted)] leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
