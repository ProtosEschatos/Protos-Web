import { fetchWithTimeout, type IntegrationStatus } from './types'

const REPO = 'ProtosEschatos/Protos-Web'
const API = `https://api.github.com/repos/${REPO}`

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim()
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Live GitHub status for the public Protos-Web repo: latest commit + latest
 * CI run. Works with zero configuration (public repo, unauthenticated GitHub
 * API), and opportunistically uses `GITHUB_TOKEN` (already documented for
 * /admin/memory) for a higher rate limit and Dependabot alert count.
 */
export async function getGithubStatus(): Promise<IntegrationStatus> {
  try {
    const [commitRes, runsRes] = await Promise.all([
      fetchWithTimeout(`${API}/commits?per_page=1`, { headers: authHeaders() }),
      fetchWithTimeout(`${API}/actions/runs?per_page=1`, { headers: authHeaders() }),
    ])

    if (!commitRes.ok) {
      return {
        configured: true,
        ok: false,
        summary: `GitHub API ${commitRes.status}`,
        detail: commitRes.status === 403 ? 'Rate limit — postavi GITHUB_TOKEN' : 'Greška pri dohvatu',
      }
    }

    const commits = (await commitRes.json()) as Array<{
      sha: string
      commit: { message: string; author: { name: string; date: string } }
    }>
    const commit = commits[0]
    const shortSha = commit?.sha?.slice(0, 7) ?? '—'
    const message = commit?.commit.message.split('\n')[0] ?? ''

    let runSummary = ''
    if (runsRes.ok) {
      const runsData = (await runsRes.json()) as {
        workflow_runs: Array<{ status: string; conclusion: string | null; name: string }>
      }
      const run = runsData.workflow_runs?.[0]
      if (run) {
        const state = run.conclusion ?? run.status
        runSummary = ` · CI: ${state}`
      }
    }

    return {
      configured: true,
      ok: true,
      summary: `${shortSha} — ${message}`,
      detail: `Zadnji commit${runSummary}`,
      href: `https://github.com/${REPO}/commits/main`,
    }
  } catch {
    return { configured: true, ok: false, summary: 'Mrežna greška', detail: 'Ne mogu dohvatiti GitHub API' }
  }
}
