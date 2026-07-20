/**
 * Single source of truth for 3D showcase wall frames.
 * Only repos/projects explicitly approved by the studio owner belong here.
 * System Boost is the back-wall poklon — see featured-demo.ts, not this list.
 */
export type ShowcaseAllowlistEntry = {
  slug: string
  title: string
  tag: string
  description: string
  /**
   * Primary CTA link on the card + 3D frame click target. Usually the live
   * URL; falls back to the GitHub repo when the project isn't deployed yet.
   */
  projectUrl: string
  repoUrl: string
  /**
   * Optional local (or absolute) poster image. When set, this wins over the
   * Supabase Storage lookup keyed by slug — useful for repo-only entries
   * where no production screenshot has been uploaded yet.
   */
  posterImage?: string
  /**
   * Marks the entry as repo-only (no live deploy). The public card labels
   * the CTA "GitHub repo" instead of "Live". Optional; defaults to false.
   */
  repoOnly?: boolean
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
  {
    slug: 'apartman-mihael',
    title: 'Apartman Mihael',
    tag: 'Hospitality',
    description: 'Booking landing za apartman — galerija, dostupnost, kontakt (Cloudflare Pages).',
    projectUrl: 'https://github.com/ProtosEschatos/Apartman-Mihael',
    repoUrl: 'https://github.com/ProtosEschatos/Apartman-Mihael',
    posterImage: '/images/portfolio/apartman-mihael.svg',
    repoOnly: true,
    sortOrder: 5,
  },
  {
    slug: 'auto-precision',
    title: 'Auto Precision',
    tag: 'Automotive',
    description: 'Landing za auto servis — usluge, tim, dijagnostika, rezervacije.',
    projectUrl: 'https://github.com/ProtosEschatos/Auto-Precision',
    repoUrl: 'https://github.com/ProtosEschatos/Auto-Precision',
    posterImage: '/images/portfolio/auto-precision.svg',
    repoOnly: true,
    sortOrder: 6,
  },
  {
    slug: 'protos-admin-console',
    title: 'Protos Admin Console',
    tag: 'Admin Console',
    description: 'CRM / admin konzola — React + TS, Gemini AI Studio kao osnova, spremna za integraciju s bilo kojim backendom.',
    projectUrl: 'https://github.com/ProtosEschatos/Protos-Admin-Console',
    repoUrl: 'https://github.com/ProtosEschatos/Protos-Admin-Console',
    posterImage: '/images/portfolio/protos-admin-console.svg',
    repoOnly: true,
    sortOrder: 7,
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

/**
 * Resolve the allowlist entry for a given project URL (or null if not on the
 * allowlist). Used to look up posterImage overrides without duplicating the
 * URL normalization logic.
 */
export function findAllowlistEntryByUrl(
  projectUrl: string | null | undefined,
): ShowcaseAllowlistEntry | null {
  if (!projectUrl) return null
  const key = normalizePortfolioUrl(projectUrl)
  return SHOWCASE_ALLOWLIST.find((e) => normalizePortfolioUrl(e.projectUrl) === key) ?? null
}
