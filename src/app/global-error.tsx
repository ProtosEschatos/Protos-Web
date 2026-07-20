'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Absolute last-resort fallback. Rendered by Next.js when even the locale /
 * admin `error.tsx` boundaries fail (e.g. an error during the root layout
 * itself). Must include its own <html>/<body> — no other layout runs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (typeof console !== 'undefined') {
      console.error('[global-error]', error)
    }
    Sentry.captureException(error, {
      tags: { boundary: 'global-error' },
      extra: error.digest ? { digest: error.digest } : undefined,
    })
  }, [error])

  return (
    <html lang="hr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#e2e8f0',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 520, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 600 }}>
            Aplikacija je pala s kritičnom greškom
          </h1>
          <p style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            Pokušaj osvježiti stranicu. Ako se ponavlja, javi na
            dario.admin@protosweb.eu.
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: '0.5rem',
                color: '#64748b',
                fontSize: '0.75rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              digest {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                borderRadius: '0.375rem',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'rgba(148, 163, 184, 0.15)',
                color: '#e2e8f0',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Pokušaj ponovo
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error runs when the root layout has failed; next/link would reuse the broken tree */}
            <a
              href="/"
              style={{
                borderRadius: '0.375rem',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                color: '#cbd5e1',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Naslovnica
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
