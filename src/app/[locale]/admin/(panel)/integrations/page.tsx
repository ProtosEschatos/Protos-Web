import { setRequestLocale } from 'next-intl/server'
import { Plug, Shield } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminSection from '@/components/admin/AdminSection'
import AdminStatGrid from '@/components/admin/AdminStatGrid'
import DesignElementsManager from '@/components/admin/DesignElementsManager'
import { getIntegrationsOverview } from '@/lib/admin/integrations-status'
import { getAdminStatus } from '@/lib/admin/status'
import { adminPlatformLinks } from '@/lib/admin-hub-links'
import AdminHubCard from '@/components/admin/AdminHubCard'
import { Globe } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminIntegrationsPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const [overview, dnsStatus] = await Promise.all([getIntegrationsOverview(), getAdminStatus()])
  const dnsIssues = dnsStatus.dns.filter((d) => !d.ok).length

  const configuredCount = overview.services.filter((s) => s.configured).length

  return (
    <AdminPageShell
      title="Integracije"
      description="Status env varijabli, Supabase design library i vanjski servisi. API ključeve postavi na Vercel — ne u bazu."
    >
      <AdminSection title="Status servisa">
        <AdminStatGrid
          stats={[
            {
              value: `${configuredCount}/${overview.services.length}`,
              label: 'Servisi konfigurirani',
              tone: configuredCount === overview.services.length ? 'ok' : 'warn',
            },
            {
              value: overview.supabase.designElementsCount ?? '—',
              label: 'Design elemenata',
            },
            {
              value: overview.supabase.serviceRole ? 'OK' : '!',
              label: 'Service role',
              tone: overview.supabase.serviceRole ? 'ok' : 'warn',
            },
            {
              value: dnsIssues,
              label: 'DNS upozorenja',
              tone: dnsIssues ? 'warn' : 'ok',
            },
          ]}
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {overview.services.map((service) => (
            <div
              key={service.label}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[var(--dark-card)]/40 px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium text-[var(--light)]">{service.label}</div>
                <div className="text-xs text-[var(--light-muted)] mt-0.5">{service.detail}</div>
              </div>
              <span className={service.configured ? 'text-emerald-400 text-xs' : 'text-amber-400 text-xs'}>
                {service.configured ? 'OK' : 'Missing'}
              </span>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Design library (Supabase)">
        <DesignElementsManager />
      </AdminSection>

      <AdminSection title="Platforme">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {adminPlatformLinks.map((link) => (
            <AdminHubCard key={link.id} href={link.href} label={link.label} icon={Globe} external />
          ))}
        </div>
      </AdminSection>

      <AdminSection title="DNS">
        <div className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--light)]">Provjera zapisa</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {dnsStatus.dns.map((check) => (
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

      <AdminSection title="AI pomoć">
        <AdminHubCard
          href="/admin/ai"
          label="AI asistent"
          description="DeepSeek + Gemini — generiranje sadržaja za blog i portfolio"
          icon={Plug}
        />
      </AdminSection>
    </AdminPageShell>
  )
}
