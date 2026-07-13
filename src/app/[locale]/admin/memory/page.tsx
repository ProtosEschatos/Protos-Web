import { setRequestLocale } from 'next-intl/server'
import { BookOpen, ExternalLink } from 'lucide-react'
import AdminMemoryList, { memoryDocHref } from '@/components/features/admin/AdminMemoryList'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminSection from '@/components/features/admin/AdminSection'
import AdminLink from '@/components/features/admin/AdminLink'
import { adminGetMemorySnapshot } from '@/lib/queries/admin/memory'

type Props = { params: Promise<{ locale: string }> }

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('hr-HR', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default async function AdminMemoryPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const snapshot = await adminGetMemorySnapshot()

  if (!snapshot) {
    return (
      <AdminPageShell title="Agent memorija" description="Nije moguće učitati memoriju s GitHuba.">
        <p className="text-sm text-amber-400">
          Provjeri mrežu ili postavi GITHUB_TOKEN na Vercelu ako je Protos-Agent repo privatan.
        </p>
      </AdminPageShell>
    )
  }

  const statusLine = `${snapshot.sessionCount} sesija · ${snapshot.learningCount} learnings · ažurirano ${formatDate(snapshot.latestDate)}`

  return (
    <AdminPageShell
      title="Agent memorija"
      description="Trajno znanje o Protos-Web projektu iz Protos-Agent repozitorija (read-only)."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-[var(--light-muted)]">
          <BookOpen className="h-4 w-4 text-[var(--primary)]" />
          <span>{statusLine}</span>
        </div>
        <a
          href="https://github.com/ProtosEschatos/Protos-Agent/tree/main/memory"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
        >
          Protos-Agent repo
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <AdminSection title="Projekt">
        <AdminLink
          href={memoryDocHref(snapshot.projectDoc.path)}
          className="block rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-5 hover:border-[var(--primary)]/35 transition-colors"
        >
          <h3 className="font-semibold text-[var(--light)]">{snapshot.projectDoc.title}</h3>
          <p className="text-sm text-[var(--light-muted)] mt-1">
            Stack, admin CMS, tajne, poznati fix-evi — glavni project doc.
          </p>
        </AdminLink>
      </AdminSection>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminSection title="Sesije">
          <AdminMemoryList title="Dnevnik rada" items={snapshot.sessions} emptyLabel="Nema sesija u indexu." />
        </AdminSection>
        <AdminSection title="Learnings">
          <AdminMemoryList
            title="Obrasci i fix-evi"
            items={snapshot.learnings}
            emptyLabel="Nema learnings u indexu."
          />
        </AdminSection>
      </div>

      <p className="text-[10px] text-[var(--light-muted)] mt-6">
        Cache ~1h · izvor: Protos-Agent/memory/ · uređivanje ostaje u gitu
      </p>
    </AdminPageShell>
  )
}
