import { fetchWithTimeout, type IntegrationStatus } from './types'

/** Live latest-deployment status from Vercel — needs a personal/project access token. */
export async function getVercelStatus(): Promise<IntegrationStatus> {
  const token = process.env.VERCEL_TOKEN?.trim()
  const projectId = process.env.VERCEL_PROJECT_ID?.trim()
  const teamId = process.env.VERCEL_TEAM_ID?.trim()

  if (!token || !projectId) {
    return {
      configured: false,
      hint: 'Postavi VERCEL_TOKEN i VERCEL_PROJECT_ID na Vercelu (VERCEL_TEAM_ID opcionalno za team projekte)',
    }
  }

  try {
    const params = new URLSearchParams({ projectId, limit: '1' })
    if (teamId) params.set('teamId', teamId)

    const res = await fetchWithTimeout(`https://api.vercel.com/v6/deployments?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      return {
        configured: true,
        ok: false,
        summary: `Vercel API ${res.status}`,
        detail: res.status === 403 ? 'Provjeri VERCEL_TOKEN' : 'Greška pri dohvatu',
      }
    }

    const data = (await res.json()) as {
      deployments: Array<{ state: string; target: string | null; created: number; url: string }>
    }
    const deploy = data.deployments?.[0]
    if (!deploy) {
      return { configured: true, ok: false, summary: 'Nema deploya', detail: projectId }
    }

    return {
      configured: true,
      ok: deploy.state === 'READY',
      summary: `Deploy: ${deploy.state}`,
      detail: `${deploy.target ?? 'preview'} · ${new Date(deploy.created).toLocaleString('hr-HR')}`,
      href: 'https://vercel.com/dashboard',
    }
  } catch {
    return { configured: true, ok: false, summary: 'Mrežna greška', detail: 'Ne mogu dohvatiti Vercel API' }
  }
}
