'use client'

import { motion } from 'framer-motion'
import type { ServiceRow } from '@/lib/queries/services'
import { resolveFaIcon } from '@/components/ui/section-icons'

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]/15 text-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  accent: 'bg-[var(--accent)]/15 text-[var(--accent)]',
}

const colors = ['primary', 'secondary', 'accent']

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
}

type Props = {
  items: ServiceRow[]
}

export default function ServicesGrid({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((s, i) => {
        const Icon = resolveFaIcon(s.icon)
        return (
          <motion.div
            key={s.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariant}
            className="cosmic-panel rounded-2xl p-8 flex gap-5 hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${colorMap[colors[i % colors.length]]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
              {s.subtitle ? (
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.subtitle}</p>
              ) : null}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
