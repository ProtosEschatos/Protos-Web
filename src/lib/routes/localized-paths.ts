export type SiteLocale = 'hr' | 'en' | 'de' | 'it' | 'es'

/** Internal app route key → localized public path per locale */
export const LOCALIZED_PATHS = {
  about: {
    hr: '/o-meni',
    en: '/about',
    de: '/ueber-uns',
    it: '/chi-siamo',
    es: '/sobre-nosotros',
  },
} as const satisfies Record<string, Record<SiteLocale, string>>

export const ABOUT_INTERNAL_HREF = '/o-meni'

const ABOUT_PATH_SET = new Set(Object.values(LOCALIZED_PATHS.about))

export function aboutPathForLocale(locale: string): string {
  const paths = LOCALIZED_PATHS.about
  return paths[locale as SiteLocale] ?? paths.hr
}

export function isAboutPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]
  return (ABOUT_PATH_SET as Set<string>).has(path) || path.startsWith(`${ABOUT_INTERNAL_HREF}/`)
}
