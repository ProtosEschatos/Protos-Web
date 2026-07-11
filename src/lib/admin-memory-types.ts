export type MemoryEntry = {
  date: string
  project: string
  session: string | null
  project_doc: string
  learnings?: string[]
  commits?: string[]
  topics?: string[]
}

export type MemoryDocKind = 'project' | 'session' | 'learning'

export type MemoryDocRef = {
  path: string
  kind: MemoryDocKind
  title: string
  date?: string
  topics?: string[]
}

export type MemoryDoc = {
  path: string
  kind: MemoryDocKind
  title: string
  content: string
  fetchedAt: string
}

export type MemorySnapshot = {
  project: string
  projectDoc: MemoryDocRef
  sessions: MemoryDocRef[]
  learnings: MemoryDocRef[]
  sessionCount: number
  learningCount: number
  latestDate: string | null
  checkedAt: string
}
