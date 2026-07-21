/**
 * Sentry SDK — browser runtime. Next.js 15+ picks up this file at the repo
 * root automatically (mirrors `instrumentation.ts` for server code).
 *
 * Session Replay is wired so that we only record video for sessions that
 * hit an error — `replaysSessionSampleRate: 0` means no idle recording,
 * `replaysOnErrorSampleRate: 1` means every crash gets a replay. Cheap on
 * quota, invaluable when debugging a 3D configurator crash.
 *
 * Replay skips `<canvas>` elements and anything with `.no-replay` so the
 * React Three Fiber scene on `/admin/konfigurator` doesn't flood the
 * recorder with per-frame DOM mutations (WebGL state changes at 60fps).
 * `ignoreErrors` filters benign browser/network noise that isn't
 * actionable and would otherwise burn the free-tier quota.
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
      block: ['canvas', '.no-replay'],
    }),
  ],

  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1,

  ignoreErrors: [
    // Benign browser cosmetic — reported by every Chromium build, no real user impact.
    /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/,
    // User navigated away mid-fetch; not a bug.
    'AbortError',
    'The user aborted a request',
    // Stale deploy on the client — usually resolves on next reload; not actionable per-error.
    'ChunkLoadError',
    'Loading chunk',
    'Loading CSS chunk',
    // Network failures without any actionable stack (offline, DNS, CORS strip).
    'NetworkError when attempting to fetch resource',
    'Load failed', // Safari's rendition of "failed to fetch"
    // Unhandled promise rejection with a non-Error payload — nothing to symbolicate.
    'Non-Error promise rejection captured',
  ],

  denyUrls: [
    // Browser extensions inject scripts that occasionally throw inside our page context.
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],

  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  debug: false,
})

// Required for the App Router `onRouterTransitionStart` hook — the browser
// wrapper uses this to instrument client-side navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
