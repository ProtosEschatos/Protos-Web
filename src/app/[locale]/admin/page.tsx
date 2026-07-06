import { setRequestLocale } from 'next-intl/server'
import {
  Bell,
  FileText,
  Globe,
  Inbox,
  LayoutGrid,
  Plus,
  Share2,
  Shield,
} from 'lucide-react'
import AdminHubCard from '@/components/admin/AdminHubCard'
import { adminGetNotifications } from '@/actions/admin-notifications'
import { getAdminStatus } from '@/actions/admin-status'
import { CONTACT_EMAIL } from '@/lib/site'
import {
  adminFreelanceLinks,
  adminInboxLinks,
  adminPlatformLinks,
  adminSocialLinks,
} from '@/lib/admin-hub-links'
import AdminLink from '@/components/admin/AdminLink'

type Props = { params: { locale: string } }

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const [notifications, status] = await Promise.all([adminGetNotifications(), getAdminStatus()])

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--light)]">Kontrolna ploča</h1>
          <p className="text-[var(--light-muted)] mt-2">
            Sadržaj, inbox, notifikacije i brzi pristup platformama — {CONTACT_EMAIL}
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Sadržaj</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminHubCard href="/admin/blog" label="Blog" description="Dodaj i uredi članke (Supabase)" icon={FileText} />
            <AdminHubCard
              href="/admin/portfolio"
              label="Portfolio"
              description="Upravljaj projektima na stranici"
              icon={LayoutGrid}
            />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Inbox</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminInboxLinks.map((link) => (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                description={link.description}
                icon={Inbox}
                external={link.external}
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Notifikacije</h2>
            <AdminLink href="/admin/inbox" className="text-xs text-[var(--light-muted)] hover:text-[var(--primary)]">
              Svi upiti →
            </AdminLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <div className="rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3">
              <p className="text-2xl font-bold text-[var(--light)]">{notifications.contactsLast7Days}</p>
              <p className="text-xs text-[var(--light-muted)]">Upita (7 dana)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3">
              <p className="text-2xl font-bold text-[var(--light)]">{notifications.subscriberCount}</p>
              <p className="text-xs text-[var(--light-muted)]">Newsletter pretplatnika</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3">
              <p className={`text-2xl font-bold ${notifications.dnsIssues ? 'text-amber-400' : 'text-emerald-400'}`}>
                {notifications.dnsIssues}
              </p>
              <p className="text-xs text-[var(--light-muted)]">DNS upozorenja</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[var(--dark-card)]/50 px-4 py-3">
              <p className={`text-2xl font-bold ${notifications.serviceRoleConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {notifications.serviceRoleConfigured ? 'OK' : '!'}
              </p>
              <p className="text-xs text-[var(--light-muted)]">CMS (service role)</p>
            </div>
          </div>
          {notifications.recentContacts.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/40 divide-y divide-white/5">
              {notifications.recentContacts.slice(0, 4).map((c) => (
                <div key={c.id} className="px-4 py-3 flex flex-wrap justify-between gap-2 text-sm">
                  <div>
                    <p className="text-[var(--light)] font-medium">{c.name}</p>
                    <p className="text-[var(--light-muted)]">{c.email}</p>
                  </div>
                  <p className="text-xs text-[var(--light-muted)] max-w-md truncate">{c.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--light-muted)]">Nema novih upita s kontakt forme.</p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Platforme</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {adminPlatformLinks.map((link) => (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                icon={Globe}
                external
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Društvene mreže</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {adminSocialLinks.map((link) => (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                icon={Share2}
                external
                pending={link.pending}
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Freelance platforme</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {adminFreelanceLinks.map((link) => (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                icon={Bell}
                external
                pending={link.pending}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--primary)] mb-4">Ops / DNS</h2>
          <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-semibold text-[var(--light)]">DNS status</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {status.dns.map((check) => (
                <div key={check.label} className="flex justify-between gap-2 text-sm">
                  <span className="text-[var(--light-muted)]">{check.label}</span>
                  <span className={check.ok ? 'text-emerald-400' : 'text-amber-400'}>{check.ok ? 'OK' : 'Provjeri'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
