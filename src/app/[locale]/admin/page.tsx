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
import { adminGetLiveServiceStatus } from '@/actions/admin-live-status'
import { adminGetMemorySnapshot } from '@/lib/queries/admin/memory'
import { getUltimatePanelStats } from '@/lib/queries/admin/panel-stats'
import { getAiProviderStatus } from '@/lib/ai/providers'
import { ADMIN_NAV_SECTIONS } from '@/lib/admin-nav'
import { adminNavIcon } from '@/lib/admin-nav-icons'
import { SITE_DOMAIN, SITE_URL } from '@/lib/config/site'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  const notifications = await adminGetNotifications()
  const [marketing, security, comms, liveServices, memoryResult, panelStats] = await Promise.all([
    adminGetInsights(),
    adminGetSecurityInsights(),
    adminGetCommsChannels(notifications),
    adminGetLiveServiceStatus(),
    adminGetMemorySnapshot().catch(() => null),
    getUltimatePanelStats().catch(() => null),
  ])
  const memory = memoryResult
  const aiStatus = getAiProviderStatus()
  const pageSection = ADMIN_NAV_SECTIONS.find((s) => s.id === 'pages')
  const studioSection = ADMIN_NAV_SECTIONS.find((s) => s.id === 'studio')
  const systemSection = ADMIN_NAV_SECTIONS.find((s) => s.id === 'system')

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-bold tracking-tight text-slate-100">Korisnički nadzorni panel</h2>
        <p className="admin-mono mt-1 text-xs text-slate-400">
          Statistike, inboxi, sigurnost i marketing — Console v3.0 layout.
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

        <AdminSection title="Živi status servisa" className="mt-10">
          <AdminInsightGrid
            insights={liveServices.insights}
            checkedAt={liveServices.checkedAt}
            footnote="GitHub, Cloudflare i Vercel — pravi podaci gdje je token postavljen, inače 'Nije podešeno'."
          />
        </AdminSection>

        <AdminSection title="Marketing & SEO" className="mt-10">
          <AdminInsightGrid insights={marketing.insights} checkedAt={marketing.checkedAt} />
        </AdminSection>

        {panelStats ? (
          <AdminSection title="Ultimate panel" className="mt-10">
            <AdminStatGrid
              stats={[
                {
                  value: panelStats.apiKeys.active,
                  label: `Aktivnih API ključeva${panelStats.apiKeys.total ? ` / ${panelStats.apiKeys.total} ukupno` : ''}`,
                  tone: panelStats.apiKeys.cryptoConfigured
                    ? panelStats.apiKeys.active > 0
                      ? 'ok'
                      : 'default'
                    : 'warn',
                },
                {
                  value: panelStats.automations.enabled,
                  label: `Aktivnih webhookova${panelStats.automations.total ? ` / ${panelStats.automations.total} ukupno` : ''}`,
                  tone: panelStats.automations.enabled > 0 ? 'ok' : 'default',
                },
                {
                  value: panelStats.automations.totalFires,
                  label: 'Ukupno okidanja webhookova',
                },
                {
                  value:
                    panelStats.automations.lastStatusCode == null
                      ? '—'
                      : String(panelStats.automations.lastStatusCode),
                  label: panelStats.automations.lastFiredAt
                    ? `Zadnji fire: ${new Intl.DateTimeFormat('hr-HR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(panelStats.automations.lastFiredAt))}`
                    : 'Zadnji fire: —',
                  tone:
                    panelStats.automations.lastStatusOk == null
                      ? 'default'
                      : panelStats.automations.lastStatusOk
                        ? 'ok'
                        : 'warn',
                },
              ]}
            />
            {!panelStats.apiKeys.cryptoConfigured ? (
              <p className="admin-mono mt-3 text-[11px] text-amber-300">
                Postavi <code>ADMIN_KEYS_ENCRYPTION_KEY</code> u Vercel env-u da bi vault i webhook auth radili.
              </p>
            ) : null}
          </AdminSection>
        ) : null}

        {studioSection ? (
          <AdminSection title="Studio" className="mt-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {studioSection.items.map((item) => (
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
                    ? aiStatus.gptOss
                      ? 'GPT-OSS-120B spreman'
                      : aiStatus.deepseek
                        ? 'DeepSeek spreman'
                        : aiStatus.gemini
                          ? 'Gemini spreman'
                          : 'Dodaj GPT_OSS_API_KEY, DEEPSEEK_API_KEY ili GEMINI_API_KEY'
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
  )
}
