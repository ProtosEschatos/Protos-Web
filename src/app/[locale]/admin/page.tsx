import { setRequestLocale } from 'next-intl/server'
import { BookOpen, Bot, ExternalLink, FileText, LayoutGrid, Wrench } from 'lucide-react'
import AdminCommsInboxPanel from '@/components/admin/AdminCommsInboxPanel'
import AdminHubCard from '@/components/admin/AdminHubCard'
import AdminInsightGrid from '@/components/admin/AdminInsightGrid'
import AdminSection from '@/components/admin/AdminSection'
import AdminStatGrid from '@/components/admin/AdminStatGrid'
import { adminGetNotifications } from '@/actions/admin-notifications'
import { adminGetInsights } from '@/actions/admin-insights'
import { adminGetCommsChannels, adminGetSecurityInsights } from '@/actions/admin-ops-insights'
import { adminGetMemorySnapshot } from '@/lib/admin/memory-queries'
import { getAiProviderStatus } from '@/lib/ai/providers'
import { SITE_DOMAIN, SITE_URL } from '@/lib/site'

type Props = { params: { locale: string } }

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const notifications = await adminGetNotifications()
  const [marketing, security, comms, memory] = await Promise.all([
    adminGetInsights(),
    adminGetSecurityInsights(),
    adminGetCommsChannels(notifications),
    adminGetMemorySnapshot(),
  ])
  const aiStatus = getAiProviderStatus()

  return (
    <div className="py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)] mb-2">
            Protos Web
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--light)]">Admin pregled</h1>
          <p className="text-sm text-[var(--light-muted)] mt-2 max-w-xl">
            Inboxi, sigurnost i marketing na jednom mjestu — bez duplih linkova.
          </p>
        </header>

        <AdminStatGrid
          stats={[
            {
              value: notifications.recentActivityCount,
              label: 'Aktivnost (24h)',
              tone: notifications.recentActivityCount > 0 ? 'ok' : 'default',
            },
            {
              value: notifications.contactsLast24Hours,
              label: 'Kontakt (24h)',
            },
            {
              value: notifications.subscribersLast24Hours,
              label: 'Newsletter (24h)',
            },
            {
              value: notifications.subscriberCount,
              label: 'Pretplatnika ukupno',
            },
          ]}
        />

        <AdminSection title="Poruke & inboxi" className="mt-10">
          <AdminCommsInboxPanel channels={comms.channels} checkedAt={comms.checkedAt} />
        </AdminSection>

        <AdminSection title="Sigurnost & infrastruktura" className="mt-10">
          <AdminInsightGrid
            insights={security.insights}
            checkedAt={security.checkedAt}
            footnote={`Provjera: ${new Intl.DateTimeFormat('hr-HR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(security.checkedAt))} · DNS, admin auth, CMS`}
          />
        </AdminSection>

        <AdminSection title="Marketing & SEO" className="mt-10">
          <AdminInsightGrid insights={marketing.insights} checkedAt={marketing.checkedAt} />
        </AdminSection>

        <AdminSection title="Sadržaj & alati" className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AdminHubCard href="/admin/blog" label="Blog" description="Članci i objave" icon={FileText} />
            <AdminHubCard
              href="/admin/portfolio"
              label="Portfolio"
              description="Projekti i showcase"
              icon={LayoutGrid}
            />
            <AdminHubCard
              href="/admin/tools"
              label="Alati i platforme"
              description="Cloudflare, Vercel, DNS detalji"
              icon={Wrench}
            />
            <AdminHubCard
              href="/admin/memory"
              label="Agent memorija"
              description={
                memory
                  ? `${memory.sessionCount} sesija · ${memory.learningCount} learnings`
                  : 'Trajno znanje o projektu'
              }
              icon={BookOpen}
              badge={
                memory?.latestDate
                  ? new Intl.DateTimeFormat('hr-HR', { month: 'short', day: 'numeric' }).format(
                      new Date(memory.latestDate),
                    )
                  : undefined
              }
            />
            <AdminHubCard
              href="/admin/ai"
              label="AI asistent"
              description={aiStatus.deepseek ? 'DeepSeek spreman' : 'Dodaj DEEPSEEK_API_KEY'}
              icon={Bot}
              pending={!aiStatus.deepseek}
            />
            <AdminHubCard
              href={SITE_URL}
              label="Javna stranica"
              description={SITE_DOMAIN}
              icon={ExternalLink}
              external
            />
          </div>
        </AdminSection>
      </div>
    </div>
  )
}
