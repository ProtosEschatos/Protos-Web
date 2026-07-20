import { findAllowlistEntryByUrl } from './showcase-allowlist'

/** Map portfolio project_url → showcase storage slug (Supabase projects/*.jpg). */
export function portfolioUrlToShowcaseSlug(projectUrl: string): string {
  // Allowlist match wins — handles GitHub-repo-only entries where the host
  // ("github.com") tells us nothing about which project it is.
  const entry = findAllowlistEntryByUrl(projectUrl)
  if (entry) return entry.slug

  try {
    const host = new URL(projectUrl).hostname.replace(/^www\./, '').toLowerCase()
    if (host.includes('bodulica')) return 'bodulica'
    if (host.includes('golden-pawn')) return 'golden-pawn'
    if (host.includes('auto-moto')) return 'auto-moto'
    if (host.includes('lumina-dent')) return 'dentalna-ordinacija'
    if (host.includes('protosweb')) return 'protosweb'
    const base = host.split('.')[0]
    return base.replace(/[^a-z0-9-]/g, '-') || 'project'
  } catch {
    return 'project'
  }
}

export function isPoklonPortfolioUrl(projectUrl: string | null | undefined): boolean {
  if (!projectUrl) return false
  const lower = projectUrl.toLowerCase()
  return lower.includes('system-boost') || lower.includes('protos-system-boost.pages.dev')
}
