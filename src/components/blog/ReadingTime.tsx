'use client'

import { useTranslations } from 'next-intl'
import { BookOpen } from 'lucide-react'

type Props = {
  minutes: number
  className?: string
}

/** "X min čitanja" badge with a book icon — mirrors the reading-time board asset. */
export default function ReadingTime({ minutes, className = '' }: Props) {
  const t = useTranslations('blog')

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <BookOpen className="w-3.5 h-3.5" />
      {t('readingTime', { min: minutes })}
    </span>
  )
}
