'use client'

import { useTranslations } from 'next-intl'
import ProtosLoader from '@/components/ui/ProtosLoader'

export function ShowcaseBootLoader() {
  const t = useTranslations('showcase')

  return (
    <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-[#0a0a1a] px-6">
      <ProtosLoader variant="orbit" size={72} color="purple" label={t('loaderTitle')} />
      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#94a3b8]">{t('loaderSubtitle')}</p>
    </div>
  )
}
