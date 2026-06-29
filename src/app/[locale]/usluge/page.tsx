'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const services = [
  { icon: 'fas fa-code', title: 'Custom Web Solutions', text: 'Tailored websites built from scratch with modern technologies, optimized for performance and conversions. No templates, no compromises — every project is 100% custom.', color: 'bg-[var(--primary)]/15 text-[var(--primary)]' },
  { icon: 'fas fa-palette', title: 'UI/UX Design', text: 'Beautiful, intuitive interfaces designed with the user journey in mind. Every pixel has a purpose. We design experiences that convert visitors into loyal customers.', color: 'bg-[var(--secondary)]/15 text-[var(--secondary)]' },
  { icon: 'fas fa-shopping-cart', title: 'E-Commerce & Web Apps', text: 'Full-featured online stores and web applications with payment integration, inventory management, and customer dashboards.', color: 'bg-[var(--accent)]/15 text-[var(--accent)]' },
  { icon: 'fas fa-search', title: 'SEO & Marketing', text: 'Search engine optimization and digital marketing strategies to increase your online visibility. We make sure your customers can find you on Google.', color: 'bg-[var(--primary)]/15 text-[var(--primary)]' },
  { icon: 'fas fa-robot', title: 'AI & Scheduling', text: 'Smart integrations including AI chatbots, automated booking systems, and intelligent workflows to save you time and serve your clients better.', color: 'bg-[var(--secondary)]/15 text-[var(--secondary)]' },
  { icon: 'fas fa-wrench', title: 'Maintenance', text: "Ongoing support, updates, security patches, and performance monitoring to keep your site running smoothly 24/7. We don't disappear after launch.", color: 'bg-[var(--accent)]/15 text-[var(--accent)]' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,102,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_30%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate]" style={{ backgroundImage: `radial-gradient(1px 1px at 10% 20%,rgba(255,255,255,0.4),transparent),radial-gradient(1px 1px at 50% 10%,rgba(255,255,255,0.5),transparent),radial-gradient(1px 1px at 90% 80%,rgba(255,255,255,0.4),transparent)` }} />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">SERVICES</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">
            What <span className="gradient-text">we offer</span>
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            Professional web solutions tailored to your business needs. From concept to launch and beyond.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-8 flex gap-5 hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${s.color}`}>
                  <i className={s.icon} />
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

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-4">Ready to start your project?</h2>
          <p className="text-base text-[var(--light-muted)] mb-8">Get a free consultation and quote — no strings attached.</p>
          <Link href="/kontakt" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300">
            Get a Quote <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>
    </>
  )
}
