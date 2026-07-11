import { setRequestLocale } from 'next-intl/server'
import { FileText, Inbox, LayoutGrid, Mail } from 'lucide-react'
import AdminHubCard from '@/components/admin/AdminHubCard'
import AdminActivityFeed from '@/components/admin/AdminActivityFeed'
import AdminSection from '@/components/admin/AdminSection'
import AdminStatGrid from '@/components/admin/AdminStatGrid'
import { adminGetNotifications } from '@/lib/admin/notifications'
import { CONTACT_EMAIL } from '@/lib/site'
import { adminContentLinks } from '@/lib/admin-hub-links'

type Props = { params: { locale: string } }

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const notifications = await adminGetNotifications()

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--light)]">Pregled</h1>
          <p className="text-[var(--light-muted)] mt-2">
            Aktivnost s web stranice — kontakt forma, newsletter i brzi pristup sadržaju.
          </p>
        </div>

        <AdminSection title="Aktivnost (zadnjih 24h)">
          <div className="mb-6">
            <AdminStatGrid
              stats={[
                {
                  value: notifications.recentActivityCount,
                  label: 'Nova aktivnost (24h)',
                  tone: notifications.recentActivityCount > 0 ? 'ok' : 'default',
                },
                {
                  value: notifications.contactsLast24Hours,
                  label: 'Kontakt upiti (24h)',
                },
                {
                  value: notifications.subscribersLast24Hours,
                  label: 'Newsletter (24h)',
                },
                {
                  value: notifications.contactsLast7Days + notifications.subscribersLast7Days,
                  label: 'Ukupno (7 dana)',
                },
              ]}
            />
          </div>
          <AdminActivityFeed items={notifications.activityFeed} />
        </AdminSection>

        <AdminSection title="Poruke" actionHref="/admin/inbox" actionLabel="Sve poruke →">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminHubCard
              href="/admin/inbox"
              label="Kontakt forma"
              description={`${notifications.contactsLast7Days} upita u 7 dana · ${CONTACT_EMAIL}`}
              icon={Inbox}
              badge={notifications.contactsLast24Hours > 0 ? `${notifications.contactsLast24Hours} novo` : undefined}
            />
            <AdminHubCard
              href="/admin/subscribers"
              label="Newsletter pretplatnici"
              description={`${notifications.subscriberCount} ukupno · Brevo welcome mail`}
              icon={Mail}
              badge={
                notifications.subscribersLast24Hours > 0
                  ? `${notifications.subscribersLast24Hours} novo`
                  : undefined
              }
            />
          </div>
        </AdminSection>

        <AdminSection title="Sadržaj">
          <div className="grid gap-4 sm:grid-cols-2">
            {adminContentLinks.map((link) => (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                description={link.description}
                icon={link.id === 'blog' ? FileText : LayoutGrid}
              />
            ))}
          </div>
        </AdminSection>

        <AdminSection title="Sustav" actionHref="/admin/tools" actionLabel="Alati i platforme →">
          <AdminStatGrid
            stats={[
              {
                value: notifications.dnsIssues,
                label: 'DNS upozorenja',
                tone: notifications.dnsIssues ? 'warn' : 'ok',
              },
              {
                value: notifications.serviceRoleConfigured ? 'OK' : '!',
                label: 'CMS (service role)',
                tone: notifications.serviceRoleConfigured ? 'ok' : 'warn',
              },
              {
                value: notifications.subscriberCount,
                label: 'Pretplatnika ukupno',
              },
              {
                value: notifications.contactsLast7Days,
                label: 'Upita (7 dana)',
              },
            ]}
          />
        </AdminSection>
      </div>
    </div>
  )
}
