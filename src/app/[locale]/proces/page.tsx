'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const steps = [
  { num: '01', title: 'We learn your business', text: 'No sales pitches — we sit down, listen, and understand what you actually need.' },
  { num: '02', title: 'Design and strategy on the table', text: 'Before we write a single line of code, we show you exactly how every page will look.' },
  { num: '03', title: 'Build and go live', text: 'You run your business, we build your website — we only reach out when we need a decision.' },
  { num: '04', title: 'We grow together', text: "After launch, we don't disappear — we stay available for whatever you need." },
]

const features = [
  { icon: 'fas fa-bolt', title: 'Speed', text: 'Average delivery time is 2-3 weeks for a standard project.', color: 'bg-[var(--primary)]/15 text-[var(--primary)]' },
  { icon: 'fas fa-clock', title: 'Deadlines', text: 'We respect agreed deadlines. Each step has a clear timeline.', color: 'bg-[var(--secondary)]/15 text-[var(--secondary)]' },
  { icon: 'fas fa-shield-halved', title: 'Security', text: 'SSL, backups and best data protection practices are included in every project.', color: 'bg-[var(--accent)]/15 text-[var(--accent)]' },
]

const stats = [
  { value: '5+', label: 'Years of experience' },
  { value: '30+', label: 'Completed projects' },
  { value: '1', label: 'Cross web app in development' },
  { value: '100%', label: 'Custom code, zero pre-made themes' },
]

const techs = ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Stripe', 'Drizzle ORM', 'Cloudflare', 'Linux / DevOps']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,102,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_30%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">OUR PROCESS</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            How <span className="gradient-text">we work</span>
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            A transparent process from first contact to launch. Every step is clear, measurable, and tailored to your needs.
          </p>
        </div>
      </section>

      {/* Steps */}
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

      {/* Features */}
      <section className="pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-3xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-xl ${f.color}`}>
                  <i className={f.icon} />
                </div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16">
        <Link href="/kontakt" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300">
          Contact <i className="fas fa-arrow-right" />
        </Link>
      </section>

      {/* Stats */}
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

      {/* Technologies */}
      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-8">Technologies</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {techs.map((t) => (
              <span key={t} className="px-6 py-2.5 border border-[var(--border-card)] rounded-full text-sm font-medium text-[var(--light)] bg-[var(--dark-card)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
