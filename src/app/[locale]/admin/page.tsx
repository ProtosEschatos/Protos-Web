import { setRequestLocale } from 'next-intl/server'
import { ExternalLink, FileText, Inbox, LayoutGrid, Mail, Wrench } from 'lucide-react'
import AdminActivityFeed from '@/components/admin/AdminActivityFeed'
import AdminHubCard from '@/components/admin/AdminHubCard'
import AdminInsightGrid from '@/components/admin/AdminInsightGrid'
import AdminLink from '@/components/admin/AdminLink'
import AdminSection from '@/components/admin/AdminSection'
import AdminStatGrid from '@/components/admin/AdminStatGrid'
import { adminGetNotifications } from '@/actions/admin-notifications'
import { adminGetInsights } from '@/actions/admin-insights'
import { SITE_DOMAIN, SITE_URL } from '@/lib/site'

type Props = { params: { locale: string } }

const ACTIVITY_PREVIEW_LIMIT = 4

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const [notifications, insights] = await Promise.all([adminGetNotifications(), adminGetInsights()])
  const activityPreview = notifications.activityFeed.slice(0, ACTIVITY_PREVIEW_LIMIT)
  const hasMoreActivity = notifications.activityFeed.length > ACTIVITY_PREVIEW_LIMIT

  const contactBadge =
    notifications.contactsLast24Hours > 0 ? `${notifications.contactsLast24Hours} novo` : undefined
  const subscriberBadge =
    notifications.subscribersLast24Hours > 0 ? `${notifications.subscribersLast24Hours} novo` : undefined

  return (
    <div className="py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)] mb-2">
            Protos Web
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--light)]">Admin pregled</h1>
          <p className="text-sm text-[var(--light-muted)] mt-2 max-w-xl">
            Sažetak aktivnosti i brzi ulaz u sadržaj. Detalje vidi u odgovarajućem odjeljku iz navigacije.
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

        <AdminSection title="Marketing & SEO" className="mt-10">
          <AdminInsightGrid insights={insights.insights} checkedAt={insights.checkedAt} />
        </AdminSection>

        <AdminSection title="Brzi pristup" className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AdminHubCard
              href="/admin/inbox"
              label="Kontakt forma"
              description={`${notifications.contactsLast7Days} upita (7 dana)`}
              icon={Inbox}
              badge={contactBadge}
            />
            <AdminHubCard
              href="/admin/subscribers"
              label="Newsletter"
              description={`${notifications.subscriberCount} pretplatnika`}
              icon={Mail}
              badge={subscriberBadge}
            />
            <AdminHubCard
              href="/admin/blog"
              label="Blog"
              description="Članci i objave"
              icon={FileText}
            />
            <AdminHubCard
              href="/admin/portfolio"
              label="Portfolio"
              description="Projekti i showcase"
              icon={LayoutGrid}
            />
            <AdminHubCard
              href="/admin/tools"
              label="Alati i platforme"
              description="Hosting, email, DNS, linkovi"
              icon={Wrench}
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

        {activityPreview.length > 0 ? (
          <AdminSection
            title="Zadnja aktivnost"
            actionHref="/admin/inbox"
            actionLabel={hasMoreActivity ? 'Sve poruke →' : 'Inbox →'}
            className="mt-10"
          >
            <AdminActivityFeed items={activityPreview} />
          </AdminSection>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[var(--dark-card)]/40 px-4 py-3 text-xs">
          <span
            className={
              notifications.dnsIssues
                ? 'rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300'
                : 'rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300'
            }
          >
            DNS {notifications.dnsIssues ? `${notifications.dnsIssues} upozorenja` : 'OK'}
          </span>
          <span
            className={
              notifications.serviceRoleConfigured
                ? 'rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300'
                : 'rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300'
            }
          >
            CMS {notifications.serviceRoleConfigured ? 'OK' : 'provjeri service role'}
          </span>
          <AdminLink
            href="/admin/tools"
            className="ml-auto text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"
          >
            Alati i DNS →
          </AdminLink>
        </div>
      </div>
    </div>
  )
}
