'use client'

import { motion } from 'framer-motion'
import type { ProcessStepRow } from '@/lib/queries/process'

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
}

type Props = {
  steps: ProcessStepRow[]
}

export default function ProcessStepsGrid({ steps }: Props) {
  if (steps.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((s, i) => (
        <motion.div
          key={s.id}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={cardVariant}
          className="cosmic-panel rounded-2xl p-7 hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300 text-left"
        >
          <div className="text-4xl font-extrabold gradient-text mb-4 leading-none">
            {String(s.step_number).padStart(2, '0')}
          </div>
          <h3 className="text-base font-bold text-[var(--light)] mb-2">{s.title}</h3>
          {s.description ? (
            <p className="text-sm text-[var(--light-muted)] leading-relaxed">{s.description}</p>
          ) : null}
        </motion.div>
      ))}
    </div>
  )
}
