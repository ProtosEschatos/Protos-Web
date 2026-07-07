'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-[600px] mx-auto text-center">
        <p className="text-[clamp(4rem,15vw,9rem)] font-extrabold leading-none gradient-text">
          {t('code')}
        </p>
        <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-[var(--light)] mt-2 mb-4">
          {t('title')}
        </h1>
        <p className="text-base text-[var(--light-muted)] leading-7 mb-10">{t('text')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[#ff8800] shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> {t('home')}
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[var(--light)] border border-[var(--border-card)] hover:border-[var(--primary)] transition-colors"
          >
            <BookOpen className="w-4 h-4" /> {t('blog')}
          </Link>
        </div>
      </div>
    </section>
  )
}
