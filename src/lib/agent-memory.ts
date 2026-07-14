const DEFAULT_REPO = 'ProtosEschatos/Protos-Agent'
const DEFAULT_BRANCH = 'main'
const MEMORY_PREFIX = 'memory'
const REVALIDATE_SECONDS = 3600

function getRepo(): string {
  return process.env.AGENT_MEMORY_REPO?.trim() || DEFAULT_REPO
}

function getBranch(): string {
  return process.env.AGENT_MEMORY_BRANCH?.trim() || DEFAULT_BRANCH
}

function rawUrl(relativePath: string): string {
  const repo = getRepo()
  const branch = getBranch()
  const normalized = relativePath.replace(/^\/+/, '')
  return `https://raw.githubusercontent.com/${repo}/${branch}/${normalized}`
}

function githubApiUrl(relativePath: string): string {
  const repo = getRepo()
  const branch = getBranch()
  const normalized = relativePath.replace(/^\/+/, '')
  return `https://api.github.com/repos/${repo}/contents/${normalized}?ref=${branch}`
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim()
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.raw',
  }
}

async function fetchFromGitHub(relativePath: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN?.trim()
  const fetchOpts = { next: { revalidate: REVALIDATE_SECONDS } } as const

  if (token) {
    try {
      const res = await fetch(githubApiUrl(relativePath), {
        headers: authHeaders(),
        ...fetchOpts,
      })
      if (res.ok) return await res.text()
    } catch {
      // fall through to raw URL
    }
  }

  try {
    const res = await fetch(rawUrl(relativePath), fetchOpts)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function fetchAgentMemoryText(relativePath: string): Promise<string | null> {
  const normalized = relativePath.startsWith(MEMORY_PREFIX)
    ? relativePath
    : `${MEMORY_PREFIX}/${relativePath}`

  return fetchFromGitHub(normalized)
}

export function memoryPath(...segments: string[]): string {
  return [MEMORY_PREFIX, ...segments].join('/')
}

export function titleFromMemoryPath(path: string): string {
  const base = path.split('/').pop()?.replace(/\.md$/, '') ?? path
  return base
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function isSafeMemoryPath(path: string): boolean {
  if (!path || path.includes('..') || path.startsWith('/')) return false
  const normalized = path.replace(/^memory\//, '')
  return (
    normalized === 'index.jsonl' ||
    normalized.startsWith('projects/') ||
    normalized.startsWith('sessions/') ||
    normalized.startsWith('learnings/')
  )
}
