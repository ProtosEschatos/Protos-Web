import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import AdminMemoryViewer from '@/components/features/admin/AdminMemoryViewer'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import { adminGetMemoryDoc } from '@/lib/queries/admin/memory'
import { memoryPath } from '@/lib/agent-memory'

type Props = {
  params: { locale: string; path: string[] }
}

function resolveDocPath(segments: string[]): string {
  const joined = segments.join('/').replace(/^memory\//, '')
  const withMd = joined.endsWith('.md') ? joined : `${joined}.md`
  return memoryPath(...withMd.split('/'))
}

export default async function AdminMemoryDocPage({ params: { locale, path } }: Props) {
  setRequestLocale(locale)

  if (!path?.length) notFound()

  const docPath = resolveDocPath(path)
  const doc = await adminGetMemoryDoc(docPath)

  if (!doc) notFound()

  return (
    <AdminPageShell
      title={doc.title}
      description={doc.path.replace(/^memory\//, '')}
      backHref="/admin/memory"
      backLabel="Agent memorija"
    >
      <AdminMemoryViewer content={doc.content} />
      <p className="text-[10px] text-[var(--light-muted)] mt-4">
        Učitano:{' '}
        {new Intl.DateTimeFormat('hr-HR', { dateStyle: 'short', timeStyle: 'short' }).format(
          new Date(doc.fetchedAt),
        )}
      </p>
    </AdminPageShell>
  )
}
