'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { ArrowRight, Calendar } from 'lucide-react'
import type { BlogPost } from '@/types/blog'

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
    timeZone: 'UTC',
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
            <motion.div
              key={p.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="cosmic-panel rounded-2xl p-7 text-left flex flex-col h-full hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(p.created_at, locale)}
                </div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">{p.excerpt}</p>
              </Link>
            </motion.div>
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
