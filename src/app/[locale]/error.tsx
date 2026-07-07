'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { ArrowLeft, RotateCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errorPage')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-[600px] mx-auto text-center">
        <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold text-[var(--light)] mb-4">
          {t('title')}
        </h1>
        <p className="text-base text-[var(--light-muted)] leading-7 mb-10">{t('text')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[#ff8800] shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <RotateCw className="w-4 h-4" /> {t('retry')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[var(--light)] border border-[var(--border-card)] hover:border-[var(--primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('home')}
          </Link>
        </div>
      </div>
    </section>
  )
}
