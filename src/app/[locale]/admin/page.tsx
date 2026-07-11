import { setRequestLocale } from 'next-intl/server'
import { ExternalLink } from 'lucide-react'
import AdminCommsInboxPanel from '@/components/features/admin/AdminCommsInboxPanel'
import AdminHubCard from '@/components/features/admin/AdminHubCard'
import AdminInsightGrid from '@/components/features/admin/AdminInsightGrid'
import AdminSection from '@/components/features/admin/AdminSection'
import AdminStatGrid from '@/components/features/admin/AdminStatGrid'
import { adminGetNotifications } from '@/actions/admin-notifications'
import { adminGetInsights } from '@/actions/admin-insights'
import { adminGetCommsChannels, adminGetSecurityInsights } from '@/actions/admin-ops-insights'
import { adminGetMemorySnapshot } from '@/lib/queries/admin/memory'
import { getAiProviderStatus } from '@/lib/ai/providers'
import { ADMIN_NAV_SECTIONS } from '@/lib/admin-nav'
import { adminNavIcon } from '@/lib/admin-nav-icons'
import { SITE_DOMAIN, SITE_URL } from '@/lib/config/site'

type Props = { params: { locale: string } }

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const notifications = await adminGetNotifications()
  const [marketing, security, comms, memoryResult] = await Promise.all([
    adminGetInsights(),
    adminGetSecurityInsights(),
    adminGetCommsChannels(notifications),
    adminGetMemorySnapshot().catch(() => null),
  ])
  const memory = memoryResult
  const aiStatus = getAiProviderStatus()
  const pageSection = ADMIN_NAV_SECTIONS.find((s) => s.id === 'pages')
  const systemSection = ADMIN_NAV_SECTIONS.find((s) => s.id === 'system')

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
            Protos Web Admin
          </p>
          <h1 className="text-2xl font-bold text-[var(--light)] md:text-3xl">Pregled</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--light-muted)]">
            Ista struktura kao javni navbar — plus sustav alati s lijeve strane.
          </p>
        </header>

        <AdminStatGrid
          stats={[
            {
              value: notifications.recentActivityCount,
              label: 'Aktivnost (24h)',
              tone: notifications.recentActivityCount > 0 ? 'ok' : 'default',
            },
            { value: notifications.contactsLast24Hours, label: 'Kontakt (24h)' },
            { value: notifications.subscribersLast24Hours, label: 'Newsletter (24h)' },
            { value: notifications.subscriberCount, label: 'Pretplatnika ukupno' },
          ]}
        />

        {pageSection ? (
          <AdminSection title="Stranice (kao na protosweb.eu)" className="mt-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pageSection.items.map((item) => (
                <AdminHubCard
                  key={item.id}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={adminNavIcon(item.id)}
                />
              ))}
            </div>
          </AdminSection>
        ) : null}

        <AdminSection title="Poruke & inboxi" className="mt-10">
          <AdminCommsInboxPanel channels={comms.channels} checkedAt={comms.checkedAt} />
        </AdminSection>

        <AdminSection title="Sigurnost & infrastruktura" className="mt-10">
          <AdminInsightGrid
            insights={security.insights}
            checkedAt={security.checkedAt}
            footnote={`Provjera: ${new Intl.DateTimeFormat('hr-HR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(security.checkedAt))}`}
          />
        </AdminSection>

        <AdminSection title="Marketing & SEO" className="mt-10">
          <AdminInsightGrid insights={marketing.insights} checkedAt={marketing.checkedAt} />
        </AdminSection>

        {systemSection ? (
          <AdminSection title="Sustav" className="mt-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {systemSection.items.map((item) => {
                const pending =
                  item.id === 'ai' ? !aiStatus.deepseek : item.id === 'memory' ? !memory : false
                const badge =
                  item.id === 'memory' && memory?.latestDate
                    ? new Intl.DateTimeFormat('hr-HR', { month: 'short', day: 'numeric' }).format(
                        new Date(memory.latestDate),
                      )
                    : undefined
                const description =
                  item.id === 'ai'
                    ? aiStatus.deepseek
                      ? 'DeepSeek spreman'
                      : 'Dodaj DEEPSEEK_API_KEY'
                    : item.description
                return (
                  <AdminHubCard
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    description={description}
                    icon={adminNavIcon(item.id)}
                    pending={pending}
                    badge={badge}
                  />
                )
              })}
              <AdminHubCard
                href={SITE_URL}
                label="Javna stranica"
                description={SITE_DOMAIN}
                icon={ExternalLink}
                external
              />
            </div>
          </AdminSection>
        ) : null}
      </div>
    </div>
  )
}
