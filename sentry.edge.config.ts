/**
 * Sentry SDK — Edge runtime (middleware, edge route handlers). Loaded via
 * `src/instrumentation.ts` when `NEXT_RUNTIME === 'edge'`.
 *
 * The edge runtime has no Node built-ins, so integrations that rely on
 * `fs`/`http`/etc. are unavailable — the default init covers what works.
 */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  tracesSampleRate: 0.1,

  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: false,
})
