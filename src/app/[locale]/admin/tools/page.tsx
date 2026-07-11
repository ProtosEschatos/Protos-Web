import { setRequestLocale } from 'next-intl/server'
import { Bell, Globe, Share2, Shield } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminHubCard from '@/components/admin/AdminHubCard'
import AdminSection from '@/components/admin/AdminSection'
import { getAdminStatus } from '@/actions/admin-status'
import {
  adminCommsLinks,
  adminFreelanceLinks,
  adminMarketingLinks,
  adminPlatformLinks,
  adminSocialLinks,
} from '@/lib/admin-hub-links'
import { Inbox, Mail, Megaphone, Send } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminToolsPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const status = await getAdminStatus()

  return (
    <AdminPageShell title="Alati i platforme" description="Hosting, email, DNS i vanjski servisi.">
      <AdminSection title="Platforme">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {adminPlatformLinks.map((link) => (
            <AdminHubCard key={link.id} href={link.href} label={link.label} icon={Globe} external />
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Email & inboxi">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminCommsLinks.map((link) => {
            const icon =
              link.id === 'zoho' || link.id === 'inbox-site'
                ? Inbox
                : link.id === 'resend'
                  ? Send
                  : link.id.startsWith('brevo')
                    ? Megaphone
                    : Mail
            return (
              <AdminHubCard
                key={link.id}
                href={link.href}
                label={link.label}
                description={link.description}
                icon={icon}
                external={link.external}
              />
            )
          })}
        </div>
      </AdminSection>

      <AdminSection title="Marketing & SEO">
        <div className="grid gap-3 sm:grid-cols-2">
          {adminMarketingLinks.map((link) => (
            <AdminHubCard
              key={link.id}
              href={link.href}
              label={link.label}
              description={link.description}
              icon={Globe}
              external
            />
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Društvene mreže">
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
      </AdminSection>

      <AdminSection title="Freelance platforme">
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
      </AdminSection>

      <AdminSection title="DNS status">
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--light)]">Provjera zapisa</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {status.dns.map((check) => (
              <div key={check.label} className="flex justify-between gap-2 text-sm">
                <span className="text-[var(--light-muted)]">{check.label}</span>
                <span className={check.ok ? 'text-emerald-400' : 'text-amber-400'}>
                  {check.ok ? 'OK' : 'Provjeri'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AdminSection>
    </AdminPageShell>
  )
}
