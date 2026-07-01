'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import type { ShowcaseProject } from './constants'

const edgeColors = ['#6366f1', '#06b6d4', '#f59e0b', '#818cf8']

type ShowcaseFallbackProps = {
  projects: ShowcaseProject[]
  reason?: 'unsupported' | 'lost'
  onRetry?: () => void
}

export function ShowcaseFallback({ projects, reason = 'unsupported', onRetry }: ShowcaseFallbackProps) {
  const t = useTranslations('showcase')
  const tNav = useTranslations('nav')

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0a0a1a]">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 to-black/40 p-6 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-lg font-bold">
            P
          </div>
          <span className="font-semibold">Protos Web</span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 text-xl font-bold tracking-widest md:block">
          <span className="bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">{t('space')}</span>{' '}
          <span className="text-white">{t('station')}</span>
        </div>
        <Link
          href="/portfolio"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white transition-all hover:border-[#6366f1] hover:bg-[#6366f1]"
        >
          ← {t('back')}
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6366f1]">{t('loaderSubtitle')}</p>
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent md:text-5xl">
            {reason === 'lost' ? t('webglContextLostTitle') : t('webglUnsupportedTitle')}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#94a3b8]">
            {reason === 'lost' ? t('webglContextLostDesc') : t('webglUnsupportedDesc')}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              {t('webglRetry')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const edge = edgeColors[index % edgeColors.length]
            return (
              <article
                key={project.link}
                className="cosmic-panel overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
                style={{ borderColor: `${edge}44` }}
              >
                {project.imageUrl && (
                  <div className="relative mx-auto w-[55%] pt-6">
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="aspect-[195/422] w-full object-cover object-top"
                      />
                    </div>
                  </div>
                )}
                <div className="p-6 pt-4">
                  <h2 className="mb-2 text-xl font-bold" style={{ color: edge }}>
                    {project.title}
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed text-[#94a3b8]">{project.description}</p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: edge }}
                  >
                    {t('viewProject')} →
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/portfolio"
            className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:border-[#6366f1]"
          >
            {t('webglViewPortfolio')}
          </Link>
          <Link
            href="/kontakt"
            className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] px-8 py-3 text-sm font-semibold text-white"
          >
            {tNav('contact')}
          </Link>
        </div>
      </main>
    </div>
  )
}
