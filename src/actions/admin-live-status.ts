'use server'

import { requireAdmin } from '@/lib/auth/require-admin'
import type { AdminInsight, AdminInsightsSnapshot } from '@/lib/admin-insight-types'
import type { IntegrationStatus } from '@/lib/integrations/types'
import { getGithubStatus } from '@/lib/integrations/github'
import { getCloudflareStatus } from '@/lib/integrations/cloudflare'
import { getSentryStatus } from '@/lib/integrations/sentry'
import { getVercelStatus } from '@/lib/integrations/vercel'

function toInsight(
  id: string,
  label: string,
  fallbackHref: string,
  status: IntegrationStatus,
): AdminInsight {
  if (!status.configured) {
    return {
      id,
      label,
      status: 'off',
      statusLabel: 'Nije podešeno',
      detail: status.hint,
      href: fallbackHref,
      external: true,
    }
  }
  return {
    id,
    label,
    status: status.ok ? 'ok' : 'warn',
    statusLabel: status.ok ? 'Aktivno' : 'Provjeri',
    detail: [status.summary, status.detail].filter(Boolean).join(' · '),
    href: status.href ?? fallbackHref,
    external: true,
  }
}

/** Live status cards for GitHub, Cloudflare, Sentry and Vercel — real API data where configured. */
export async function adminGetLiveServiceStatus(): Promise<AdminInsightsSnapshot> {
  await requireAdmin()

  const [github, cloudflare, sentry, vercel] = await Promise.all([
    getGithubStatus(),
    getCloudflareStatus(),
    getSentryStatus(),
    getVercelStatus(),
  ])

  const insights: AdminInsight[] = [
    toInsight('github', 'GitHub aktivnost', 'https://github.com/ProtosEschatos/Protos-Web', github),
    toInsight('cloudflare', 'Cloudflare zona', 'https://dash.cloudflare.com', cloudflare),
    toInsight('sentry', 'Sentry greške', 'https://sentry.io/', sentry),
    toInsight('vercel', 'Vercel deploy', 'https://vercel.com/dashboard', vercel),
  ]

  return { insights, checkedAt: new Date().toISOString() }
}
