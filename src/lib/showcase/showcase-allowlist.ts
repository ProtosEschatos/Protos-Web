/**
 * Single source of truth for 3D showcase wall frames and public portfolio grid.
 * Only repos/projects explicitly approved by the studio owner belong here.
 * System Boost is the back-wall poklon — see featured-demo.ts, not this list.
 */
export type ShowcaseAllowlistEntry = {
  slug: string
  title: string
  tag: string
  description: string
  projectUrl: string
  repoUrl: string
  sortOrder: number
}

export const SHOWCASE_ALLOWLIST: readonly ShowcaseAllowlistEntry[] = [
  {
    slug: 'bodulica',
    title: 'Bodulica Shop',
    tag: 'E-Commerce',
    description: 'E-commerce handmade proizvodi — plaćanje, CMS, custom dizajn.',
    projectUrl: 'https://bodulica.shop',
    repoUrl: 'https://github.com/ProtosEschatos/Bodulica',
    sortOrder: 1,
  },
  {
    slug: 'auto-moto',
    title: 'Auto Moto Zagreb',
    tag: 'Automotive',
    description: 'Auto servis landing — moderan UI, kontakt i usluge.',
    projectUrl: 'https://auto-moto.vercel.app',
    repoUrl: 'https://github.com/ProtosEschatos/Auto-Moto',
    sortOrder: 2,
  },
  {
    slug: 'golden-pawn',
    title: 'Golden Pawn',
    tag: 'Demo',
    description: 'Pawn shop & auction demo — Next.js, i18n, Radix UI.',
    projectUrl: 'https://golden-pawn.vercel.app',
    repoUrl: 'https://github.com/ProtosEschatos/Golden-Pawn',
    sortOrder: 3,
  },
  {
    slug: 'dentalna-ordinacija',
    title: 'LuminaDent',
    tag: 'Healthcare',
    description: 'Dentalna ordinacija — višejezična landing stranica, kontakt forma.',
    projectUrl: 'https://lumina-dent.vercel.app',
    repoUrl: 'https://github.com/ProtosEschatos/Dentalna-Ordinacija',
    sortOrder: 4,
  },
] as const

const ALLOWED_URLS = new Set(SHOWCASE_ALLOWLIST.map((entry) => normalizePortfolioUrl(entry.projectUrl)))

export function normalizePortfolioUrl(url: string): string {
  try {
    const parsed = new URL(url.trim())
    parsed.hash = ''
    parsed.search = ''
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    return `${parsed.protocol}//${host}${parsed.pathname.replace(/\/$/, '') || ''}`
  } catch {
    return url.trim().toLowerCase()
  }
}

export function isAllowedPortfolioUrl(projectUrl: string | null | undefined): boolean {
  if (!projectUrl) return false
  return ALLOWED_URLS.has(normalizePortfolioUrl(projectUrl))
}

export function getAllowlistSlugs(): Set<string> {
  return new Set(SHOWCASE_ALLOWLIST.map((entry) => entry.slug))
}
