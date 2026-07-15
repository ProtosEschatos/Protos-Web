import { routing } from '@/routing'

const LOCALES = routing.locales.join('|')

/** Public 3D portfolio room — `/portfolio` only (not admin CMS). */
export function isPortfolioShowcasePath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0]

  if (path === '/admin/portfolio' || path.startsWith('/admin/portfolio/')) {
    return false
  }

  const prefixedAdminPortfolio = new RegExp(`^/(${LOCALES})/admin/portfolio(/|$)`)
  if (prefixedAdminPortfolio.test(path)) {
    return false
  }

  if (path === '/portfolio' || path === '/portfolio-showcase') {
    return true
  }

  const localePortfolio = new RegExp(`^/(${LOCALES})/portfolio$`)
  if (localePortfolio.test(path)) {
    return true
  }

  const localeLegacyShowcase = new RegExp(`^/(${LOCALES})/portfolio-showcase$`)
  return localeLegacyShowcase.test(path)
}
