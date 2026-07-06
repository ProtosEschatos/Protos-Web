import { setRequestLocale } from 'next-intl/server'
import { getAdminStatus } from '@/actions/admin-status'
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_URL } from '@/lib/site'
import { ExternalLink, Mail, Server, Shield } from 'lucide-react'

type Props = { params: { locale: string } }

export default async function AdminPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const status = await getAdminStatus()

  return (
    <div className="py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--light)]">Ops panel</h1>
          <p className="text-[var(--light-muted)] mt-2">
            Email, DNS i brzi linkovi za {SITE_DOMAIN}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-[var(--light)]">Email stack</h2>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-[var(--light-muted)]">Inbox (Zoho)</span>
                <span className="text-[var(--light)]">{CONTACT_EMAIL}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[var(--light-muted)]">Send (Resend + Brevo)</span>
                <span className="text-[var(--light)]">{CONTACT_EMAIL}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[var(--light-muted)]">Kontakt forma</span>
                <span className="text-[var(--light)]">Supabase → edge fn</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[var(--light-muted)]">Newsletter</span>
                <span className="text-[var(--light)]">subscribe edge fn</span>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-[var(--light)]">Konfiguracija</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {(
                [
                  ['ADMIN_SECRET (Vercel)', status.config.adminSecret],
                  ['NEXT_PUBLIC_SUPABASE_URL', status.config.supabaseUrl],
                  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', status.config.supabaseAnon],
                ] as const
              ).map(([label, ok]) => (
                <li key={label} className="flex items-center justify-between gap-4">
                  <span className="text-[var(--light-muted)]">{label}</span>
                  <span className={ok ? 'text-emerald-400' : 'text-amber-400'}>{ok ? 'OK' : 'Nedostaje'}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                <span className="text-[var(--light-muted)]">Site URL</span>
                <a href={SITE_URL} className="text-[var(--primary)] hover:underline">{SITE_URL}</a>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold text-[var(--light)]">DNS status (live)</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {status.dns.map((check) => (
                <div
                  key={check.label}
                  className="rounded-xl border border-white/5 bg-[var(--dark)]/50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm text-[var(--light)]">{check.label}</span>
                    <span className={`text-xs font-semibold ${check.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {check.ok ? 'OK' : 'Provjeri'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--light-muted)] break-all">{check.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--light-muted)] mt-4">
              Detaljni checklist: <code className="text-[var(--primary)]">docs/cloudflare-dns.md</code> u repou.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--light)] mb-4">Brzi linkovi</h2>
            <div className="flex flex-wrap gap-3">
              {status.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-[var(--light)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors"
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
