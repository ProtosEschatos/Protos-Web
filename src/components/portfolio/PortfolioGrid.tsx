'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ExternalLink, ImageIcon } from 'lucide-react'
import type { PortfolioItem } from '@/actions/portfolio'
import GlowCard from '@/components/ui/GlowCard'

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
        <GlowCard key={p.id} className="rounded-2xl" glowColor={i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent'}>
          <motion.div
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariant}
            className="cosmic-panel rounded-2xl overflow-hidden transition-all duration-300"
          >
          {p.image_url ? (
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={p.image_url}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-card-hover)] flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-[var(--light-muted)] opacity-30" />
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
                {t('viewProject')} <ExternalLink className="w-3 h-3" />
              </a>
            ) : null}
          </div>
          </motion.div>
        </GlowCard>
      ))}
    </div>
  )
}
