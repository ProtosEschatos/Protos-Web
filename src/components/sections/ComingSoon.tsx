'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { Rocket, ArrowRight } from 'lucide-react'
import EffectCard from '@/components/ui/EffectCard'

type Props = {
  /** Optional extra top/bottom padding when used as a standalone page. */
  standalone?: boolean
}

export default function ComingSoon({ standalone = false }: Props) {
  const t = useTranslations('portfolio')

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 ${
        standalone ? 'min-h-[70vh] pt-36 pb-24' : 'py-12 sm:py-16'
      }`}
    >
      <EffectCard
        index={0}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[540px] rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] sm:h-20 sm:w-20">
          <Rocket className="h-7 w-7 sm:h-9 sm:w-9" />
        </div>

        <span className="inline-block rounded-full bg-[var(--secondary)]/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--secondary)]">
          {t('comingSoonBadge')}
        </span>

        <h3 className="mt-4 text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold leading-tight text-[var(--light)]">
          {t('comingSoonTitle')}
        </h3>

        <p className="mx-auto mt-3 max-w-[420px] text-sm leading-relaxed text-[var(--light-muted)] sm:text-base">
          {t('comingSoonText')}
        </p>

        <Link
          href="/kontakt"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
        >
          {t('comingSoonCta')} <ArrowRight className="h-4 w-4" />
        </Link>
      </EffectCard>
    </div>
  )
}
