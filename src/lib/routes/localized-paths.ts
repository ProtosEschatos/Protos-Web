export type SiteLocale = 'hr' | 'en' | 'de' | 'it' | 'es' | 'sr'

/** Internal app route key → localized public path per locale */
export const LOCALIZED_PATHS = {
  about: {
    hr: '/o-nama',
    en: '/about',
    de: '/ueber-uns',
    it: '/chi-siamo',
    es: '/sobre-nosotros',
    sr: '/o-nama',
  },
} as const satisfies Record<string, Record<SiteLocale, string>>

export const ABOUT_INTERNAL_HREF = '/o-nama'

/** Legacy Croatian slug — permanently redirected to /o-nama via next.config.js
 *  and Middleware. Kept here for reference / redirect matchers. */
export const ABOUT_LEGACY_HREF = '/o-meni'

const ABOUT_PATH_SET = new Set(Object.values(LOCALIZED_PATHS.about))

export function aboutPathForLocale(locale: string): string {
  const paths = LOCALIZED_PATHS.about
  return paths[locale as SiteLocale] ?? paths.hr
}

/** Public URL path including locale prefix (e.g. `/en/about`, `/o-nama`). */
export function aboutPublicPathForLocale(locale: string): string {
  const about = aboutPathForLocale(locale)
  if (locale === 'hr') return about
  return `/${locale}${about}`
}

export function isAboutPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]
  return (
    (ABOUT_PATH_SET as Set<string>).has(path) ||
    path.startsWith(`${ABOUT_INTERNAL_HREF}/`) ||
    path === ABOUT_LEGACY_HREF ||
    path.startsWith(`${ABOUT_LEGACY_HREF}/`)
  )
}
