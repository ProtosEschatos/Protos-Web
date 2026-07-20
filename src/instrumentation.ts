/**
 * Next.js instrumentation entry — Sentry SDK bootstrap for server and edge
 * runtimes. The matching browser-side init lives in
 * `instrumentation-client.ts` at the repo root.
 *
 * `onRequestError` gets called by Next.js for every unhandled error that
 * escapes a Server Component, middleware, or route handler — it is the
 * only way to reliably see RSC render errors in Sentry.
 */
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
