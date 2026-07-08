'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { Calendar } from 'lucide-react'
import type { BlogPost } from '@/actions/blog'
import EffectCard from '@/components/ui/EffectCard'
import ReadingTime from '@/components/blog/ReadingTime'
import { estimateReadingMinutes } from '@/lib/reading-time'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
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
        <EffectCard
          key={p.id}
          index={i}
          libraryOffset={8}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={fadeUp}
          className="rounded-2xl h-full"
        >
          <Link
            href={`/blog/${p.slug}`}
            className="flex flex-col h-full p-7 group"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--primary)] mb-3">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(p.created_at, locale)}
              </span>
              <span aria-hidden="true" className="text-[var(--light-muted)]">·</span>
              <ReadingTime minutes={estimateReadingMinutes(p.content)} className="text-[var(--light-muted)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
              {p.title}
            </h3>
            <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">
              {p.excerpt}
            </p>
          </Link>
        </EffectCard>
      ))}
    </div>
  )
}
