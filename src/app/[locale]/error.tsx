'use client'

import { useEffect } from 'react'

/**
 * Locale-segment fallback for public routes when a page throws before
 * `admin/error.tsx` can catch it. Intentionally minimal — public pages
 * should never rely on this as UI, it's a last resort before
 * `global-error.tsx`.
 *
 * Kept fully self-contained: no context-dependent hooks (`useLocale`,
 * `useTranslations`), no Sentry import, no custom `Link` component.
 * If the parent tree died, any of those can throw here and escalate to
 * `global-error.tsx` — resulting in a fully-blank screen.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (typeof console !== 'undefined') {
      console.error('[locale/error]', error)
    }
  }, [error])

  return (
    <main
      className="mx-auto max-w-xl px-6 py-16 text-center"
      data-testid="locale-error-boundary"
      data-error-message={error.message || 'unknown'}
    >
      <h1 className="text-2xl font-semibold text-white">Nešto je pošlo po zlu</h1>
      <p className="mt-3 text-sm text-white/70">
        Stranicu nije bilo moguće prikazati. Pokušaj ponovo za koji trenutak.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-white/40">digest {error.digest}</p>
      ) : null}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
        >
          Pokušaj ponovo
        </button>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload from an error boundary is intentional; Link would reuse the failed client tree */}
        <a
          href="/"
          className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          Naslovnica
        </a>
      </div>
    </main>
  )
}
