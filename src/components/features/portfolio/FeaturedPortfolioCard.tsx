'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ExternalLink, ImageIcon } from 'lucide-react'
import type { PortfolioItem } from '@/types/portfolio'

type Props = {
  item: PortfolioItem
  className?: string
}

export default function FeaturedPortfolioCard({ item, className = '' }: Props) {
  const t = useTranslations('portfolio')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mx-auto max-w-4xl text-left ${className}`}
    >
      <div className="cosmic-panel overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {item.image_url ? (
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-[var(--dark-surface)] to-[var(--dark-card-hover)] sm:aspect-[21/9]">
            <ImageIcon className="h-10 w-10 text-[var(--light-muted)] opacity-30" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          {item.tag ? (
            <div className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              {item.tag}
            </div>
          ) : null}
          <h3 className="mb-2 text-2xl font-bold text-[var(--light)] sm:text-3xl">{item.title}</h3>
          {item.description ? (
            <p className="max-w-2xl text-base leading-7 text-[var(--light-muted)] sm:text-lg">{item.description}</p>
          ) : null}
          {item.project_url ? (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)] hover:underline"
            >
              {t('viewProject')} <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
