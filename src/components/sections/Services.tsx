'use client'

import { motion } from 'framer-motion'

const services = [
  { icon: 'fas fa-code', title: 'Custom Web Solutions', text: 'Tailored websites built from scratch with modern technologies, optimized for performance and conversions.', color: 'primary' },
  { icon: 'fas fa-palette', title: 'UI/UX Design', text: 'Beautiful, intuitive interfaces designed with the user journey in mind. Every pixel has a purpose.', color: 'secondary' },
  { icon: 'fas fa-shopping-cart', title: 'E-Commerce & Web Apps', text: 'Full-featured online stores and web applications with payment integration and inventory management.', color: 'accent' },
  { icon: 'fas fa-search', title: 'SEO & Marketing', text: 'Search engine optimization and digital marketing strategies to increase your online visibility.', color: 'primary' },
  { icon: 'fas fa-robot', title: 'AI & Scheduling', text: 'Smart integrations including AI chatbots, automated booking systems, and intelligent workflows.', color: 'secondary' },
  { icon: 'fas fa-wrench', title: 'Maintenance', text: 'Ongoing support, updates, security patches, and performance monitoring to keep your site running smoothly.', color: 'accent' },
]

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)]',
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
}

export default function Services() {
  return (
    <section className="py-24 bg-[var(--dark-surface)] border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">SERVICES</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          What <span className="gradient-text">we offer</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-8 flex gap-5 hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${colorMap[s.color]}`}>
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
  )
}
