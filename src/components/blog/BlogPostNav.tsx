'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AdjacentBlogPost } from '@/actions/blog'

type Props = {
  previous: AdjacentBlogPost | null
  next: AdjacentBlogPost | null
}

export default function BlogPostNav({ previous, next }: Props) {
  const t = useTranslations('blog')

  return (
    <>
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          aria-label={`${t('previous')}: ${previous.title}`}
          title={previous.title}
          className="group fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 flex items-center"
        >
          <span className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--dark-card)]/80 backdrop-blur text-[var(--light-muted)] shadow-lg transition-all duration-300 hover:text-[var(--primary)] hover:border-[var(--primary)]/40 hover:-translate-x-0.5">
            <ChevronLeft className="h-5 w-5" />
          </span>
          <span className="pointer-events-none ml-2 hidden max-w-[220px] truncate rounded-lg border border-[var(--border-card)] bg-[var(--dark-card)]/95 px-3 py-2 text-xs text-[var(--light)] opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 lg:block">
            {previous.title}
          </span>
        </Link>
      ) : null}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          aria-label={`${t('next')}: ${next.title}`}
          title={next.title}
          className="group fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 flex items-center"
        >
          <span className="pointer-events-none mr-2 hidden max-w-[220px] truncate rounded-lg border border-[var(--border-card)] bg-[var(--dark-card)]/95 px-3 py-2 text-xs text-[var(--light)] opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 lg:block">
            {next.title}
          </span>
          <span className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--dark-card)]/80 backdrop-blur text-[var(--light-muted)] shadow-lg transition-all duration-300 hover:text-[var(--primary)] hover:border-[var(--primary)]/40 hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </span>
        </Link>
      ) : null}
    </>
  )
}
