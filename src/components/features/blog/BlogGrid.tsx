'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { Calendar } from 'lucide-react'
import type { BlogPost } from '@/types/blog'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
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

export default function BlogGrid({ posts, locale }: Props) {
  const t = useTranslations('blog')

  if (posts.length === 0) {
    return (
      <p className="text-center text-[var(--light-muted)] py-12">
        {t('empty')}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((p, i) => (
        <motion.div
          key={p.id}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={fadeUp}
        >
          <Link
            href={`/blog/${p.slug}`}
            className="cosmic-panel rounded-2xl p-7 flex flex-col h-full hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-3">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(p.created_at, locale)}
            </div>
            <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
              {p.title}
            </h3>
            <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">
              {p.excerpt}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
