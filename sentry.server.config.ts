/**
 * Sentry SDK — Node.js runtime (Server Components, Route Handlers, Server
 * Actions, middleware). Loaded via `src/instrumentation.ts` when
 * `NEXT_RUNTIME === 'nodejs'`.
 *
 * DSN is public (client also needs it); auth token stays server-only and
 * is used by @sentry/nextjs at build time for source-map upload.
 */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Sampled at 10% — plenty to see hot paths without blowing quota on a low
  // traffic site. Bump if we want deeper perf data.
  tracesSampleRate: 0.1,

  // Only enable Sentry when a DSN is actually configured, so local `npm run
  // dev` without a DSN stays silent instead of spamming init warnings.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // In dev we already log every error to the terminal; don't double-report.
  debug: false,
})
