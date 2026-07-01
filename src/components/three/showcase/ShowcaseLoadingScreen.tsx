'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useShowcaseViewport } from '@/lib/showcase-viewport'

const LOADING_BG = '/showcase/loading-bg.jpg'

type ShowcaseLoadingScreenProps = {
  progress: number
  showEnter?: boolean
  onEnter?: () => void
}

export function ShowcaseLoadingScreen({ progress, showEnter = false, onEnter }: ShowcaseLoadingScreenProps) {
  const t = useTranslations('showcase')
  const viewport = useShowcaseViewport()

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-end overflow-hidden pb-[max(4rem,env(safe-area-inset-bottom))] md:pb-20">
      <Image
        src={LOADING_BG}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center">
        <div className="loader-title mb-2 text-3xl font-bold tracking-wide text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.45)] md:text-4xl">
          {t('loaderTitle')}
        </div>
        <div className="mb-8 text-xs uppercase tracking-[0.2em] text-cyan-100/70 sm:tracking-[0.35em] md:text-sm">
          {t('loaderSubtitle')}
        </div>

        <div className="h-1.5 w-56 overflow-hidden rounded-full border border-cyan-400/20 bg-black/50 backdrop-blur-sm md:w-64">
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)] transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `scaleX(${Math.min(Math.max(progress, 0), 100) / 100})`, width: '100%' }}
          />
        </div>

        {showEnter ? (
          <button
            type="button"
            onClick={onEnter}
            className="mt-10 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-200 hover:bg-cyan-400/20 hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] md:text-base"
          >
            {t('enter')}
          </button>
        ) : viewport === 'mobile' ? (
          <p className="mt-8 text-xs text-cyan-100/60 md:text-sm">{t('touchMoveHint')}</p>
        ) : (
          <p className="mt-8 text-xs text-cyan-100/60 md:text-sm">
            {t('loaderTipPrefix')} <span className="font-semibold text-cyan-300">WASD</span> {t('loaderTipOr')}{' '}
            <span className="font-semibold text-emerald-300">{t('loaderTipArrows')}</span> {t('loaderTipSuffix')}
          </p>
        )}
      </div>
    </div>
  )
}
