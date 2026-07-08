'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowRight, Calendar } from 'lucide-react'
import type { BlogPost } from '@/actions/blog'
import EffectCard from '@/components/ui/EffectCard'
import ReadingTime from '@/components/blog/ReadingTime'
import { estimateReadingMinutes } from '@/lib/reading-time'

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type Props = {
  posts: BlogPost[]
  locale: string
}

export default function Blog({ posts, locale }: Props) {
  const t = useTranslations('blog')

  return (
    <section className="py-24 cosmic-section">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">{t('title')}</h2>
        <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto mb-12 leading-7">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <EffectCard
              key={p.id}
              index={i}
              libraryOffset={12}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="rounded-2xl h-full text-left"
            >
              <Link href={`/blog/${p.slug}`} className="flex flex-col h-full p-7 group">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--primary)] mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(p.created_at, locale)}
                  </span>
                  <span aria-hidden="true" className="text-[var(--light-muted)]">·</span>
                  <ReadingTime minutes={estimateReadingMinutes(p.content)} className="text-[var(--light-muted)]" />
                </div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">{p.excerpt}</p>
              </Link>
            </EffectCard>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/blog" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--border-card)] text-[var(--light)] text-xs font-semibold uppercase tracking-wider hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
            {t('viewAll')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  )
}
