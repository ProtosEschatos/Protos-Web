/**
 * Sentry SDK — browser runtime. Next.js 15+ picks up this file at the repo
 * root automatically (mirrors `instrumentation.ts` for server code).
 *
 * Session Replay is wired so that we only record video for sessions that
 * hit an error — `replaysSessionSampleRate: 0` means no idle recording,
 * `replaysOnErrorSampleRate: 1` means every crash gets a replay. Cheap on
 * quota, invaluable when debugging a 3D configurator crash.
 */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  tracesSampleRate: 0.1,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1,

  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: false,
})

// Required for the App Router `onRouterTransitionStart` hook — the browser
// wrapper uses this to instrument client-side navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
