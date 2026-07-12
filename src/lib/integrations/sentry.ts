import { fetchWithTimeout, type IntegrationStatus } from './types'

/** Live unresolved-issue count from Sentry — needs an internal integration token. */
export async function getSentryStatus(): Promise<IntegrationStatus> {
  const token = process.env.SENTRY_AUTH_TOKEN?.trim()
  const org = process.env.SENTRY_ORG_SLUG?.trim()
  const project = process.env.SENTRY_PROJECT_SLUG?.trim()

  if (!token || !org || !project) {
    return {
      configured: false,
      hint: 'Postavi SENTRY_AUTH_TOKEN, SENTRY_ORG_SLUG i SENTRY_PROJECT_SLUG na Vercelu',
    }
  }

  try {
    const res = await fetchWithTimeout(
      `https://sentry.io/api/0/projects/${org}/${project}/issues/?query=is:unresolved&statsPeriod=24h`,
      { headers: { Authorization: `Bearer ${token}` } },
    )

    if (!res.ok) {
      return {
        configured: true,
        ok: false,
        summary: `Sentry API ${res.status}`,
        detail: res.status === 401 ? 'Provjeri SENTRY_AUTH_TOKEN' : 'Greška pri dohvatu',
      }
    }

    const issues = (await res.json()) as Array<{ id: string }>
    const count = issues.length

    return {
      configured: true,
      ok: count === 0,
      summary: count === 0 ? 'Nema nerješenih grešaka' : `${count} nerješena issue-a (24h)`,
      detail: `${org}/${project}`,
      href: `https://sentry.io/organizations/${org}/issues/?project=${project}`,
    }
  } catch {
    return { configured: true, ok: false, summary: 'Mrežna greška', detail: 'Ne mogu dohvatiti Sentry API' }
  }
}
