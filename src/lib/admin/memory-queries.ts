import { fetchAgentMemoryText, isSafeMemoryPath, memoryPath, titleFromMemoryPath } from '@/lib/agent-memory'
import type {
  MemoryDoc,
  MemoryDocKind,
  MemoryDocRef,
  MemoryEntry,
  MemorySnapshot,
} from '@/lib/admin-memory-types'
import { requireAdmin } from '@/lib/require-admin'

const DEFAULT_PROJECT = 'Protos-Web'
const PROJECT_DOC_PATH = memoryPath('projects', 'protos-web.md')

function parseIndexLine(line: string): MemoryEntry | null {
  const trimmed = line.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed) as MemoryEntry
  } catch {
    return null
  }
}

function kindFromPath(path: string): MemoryDocKind {
  if (path.includes('/projects/')) return 'project'
  if (path.includes('/sessions/')) return 'session'
  return 'learning'
}

function refFromPath(path: string, entry?: MemoryEntry): MemoryDocRef {
  const normalized = path.replace(/^memory\//, '')
  const fullPath = path.startsWith('memory/') ? path : memoryPath(normalized)
  return {
    path: fullPath,
    kind: kindFromPath(fullPath),
    title: titleFromMemoryPath(fullPath),
    date: entry?.date,
    topics: entry?.topics,
  }
}

function uniquePaths(paths: (string | null | undefined)[]): MemoryDocRef[] {
  const seen = new Set<string>()
  const refs: MemoryDocRef[] = []

  for (const p of paths) {
    if (!p) continue
    const full = p.startsWith('memory/') ? p : memoryPath(p.replace(/^memory\//, ''))
    if (seen.has(full)) continue
    seen.add(full)
    refs.push(refFromPath(full))
  }

  return refs
}

async function loadIndex(project: string): Promise<MemoryEntry[]> {
  const raw = await fetchAgentMemoryText(memoryPath('index.jsonl'))
  if (!raw) return []

  return raw
    .split('\n')
    .map(parseIndexLine)
    .filter((e): e is MemoryEntry => e !== null && e.project === project)
}

export async function adminGetMemorySnapshot(
  project = DEFAULT_PROJECT,
): Promise<MemorySnapshot | null> {
  await requireAdmin()

  const entries = await loadIndex(project)
  const sessions = uniquePaths(entries.map((e) => e.session))
  const learnings = uniquePaths(entries.flatMap((e) => e.learnings ?? []))

  const dates = entries.map((e) => e.date).filter(Boolean)
  const latestDate = dates.length > 0 ? dates.sort().reverse()[0]! : null

  return {
    project,
    projectDoc: refFromPath(PROJECT_DOC_PATH),
    sessions,
    learnings,
    sessionCount: sessions.length,
    learningCount: learnings.length,
    latestDate,
    checkedAt: new Date().toISOString(),
  }
}

export async function adminGetMemoryDoc(path: string): Promise<MemoryDoc | null> {
  await requireAdmin()

  const normalized = path.startsWith('memory/') ? path : memoryPath(path)
  if (!isSafeMemoryPath(normalized)) return null

  const content = await fetchAgentMemoryText(normalized)
  if (content === null) return null

  return {
    path: normalized,
    kind: kindFromPath(normalized),
    title: titleFromMemoryPath(normalized),
    content,
    fetchedAt: new Date().toISOString(),
  }
}
