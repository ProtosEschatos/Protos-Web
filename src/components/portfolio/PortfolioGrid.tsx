'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { PortfolioItem } from '@/actions/portfolio'

const tagColors = [
  'text-[var(--primary)]',
  'text-[var(--secondary)]',
  'text-[var(--accent)]',
]

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
}

type Props = {
  items: PortfolioItem[]
}

export default function PortfolioGrid({ items }: Props) {
  const t = useTranslations('portfolio')

  if (items.length === 0) {
    return (
      <p className="text-center text-[var(--light-muted)] py-12">{t('empty')}</p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {items.map((p, i) => (
        <motion.div
          key={p.id}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={cardVariant}
          className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300"
        >
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.title} className="w-full aspect-[4/3] object-cover" />
          ) : (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-card-hover)] flex items-center justify-center">
              <i className="fas fa-image text-3xl text-[var(--light-muted)] opacity-30" />
            </div>
          )}
          <div className="p-5 text-left">
            {p.tag ? (
              <div className={`text-[0.7rem] font-semibold tracking-[0.15em] uppercase mb-2 ${tagColors[i % tagColors.length]}`}>
                {p.tag}
              </div>
            ) : null}
            <div className="text-lg font-bold text-[var(--light)] mb-1">{p.title}</div>
            {p.description ? (
              <div className="text-sm text-[var(--light-muted)]">{p.description}</div>
            ) : null}
            {p.project_url ? (
              <a
                href={p.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] hover:underline"
              >
                View project <i className="fas fa-arrow-up-right-from-square text-[0.65rem]" />
              </a>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
