'use client'

import { useTranslations } from 'next-intl'

export function ShowcaseBootLoader() {
  const t = useTranslations('showcase')

  return (
    <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-[#0a0a1a]">
      <div className="relative mb-8 h-20 w-20">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#ff0099] border-t-transparent" />
        <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-2 border-[#00eaff] border-b-transparent" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#ff0099]/40 to-[#00eaff]/40" />
      </div>
      <p className="text-2xl font-bold bg-gradient-to-br from-[#ff0099] to-[#00eaff] bg-clip-text text-transparent">
        {t('loaderTitle')}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#94a3b8]">{t('loaderSubtitle')}</p>
    </div>
  )
}
