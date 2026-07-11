'use server'

import { getAdminStatus } from '@/actions/admin-status'
import type { AdminNotifications } from '@/actions/admin-notifications'
import { requireAdmin } from '@/lib/auth/require-admin'
import type {
  AdminCommsChannel,
  AdminCommsSnapshot,
  AdminInsight,
  AdminInsightsSnapshot,
  InsightStatus,
} from '@/lib/admin-insight-types'
import { ADMIN_COMMS_EMAIL, ADMIN_COMMS_SERVICES } from '@/lib/config/admin-links'
import { SITE_DOMAIN, SITE_URL } from '@/lib/config/site'

const NOTIFICATION_PREVIEW = 3

function dnsStatusForLabels(
  dns: Awaited<ReturnType<typeof getAdminStatus>>['dns'],
  labels: readonly string[],
): { status: InsightStatus; statusLabel: string; detail: string } {
  if (labels.length === 0) {
    return { status: 'info', statusLabel: 'Baza', detail: 'Podaci iz Supabase contacts tablice' }
  }

  const checks = dns.filter((d) => labels.includes(d.label))
  const failed = checks.filter((c) => !c.ok)
  if (checks.length === 0) {
    return { status: 'warn', statusLabel: 'Provjeri', detail: 'DNS provjera nije dostupna' }
  }
  if (failed.length === 0) {
    return { status: 'ok', statusLabel: 'DNS OK', detail: `${checks.length}/${checks.length} zapisa ispravno` }
  }
  return {
    status: 'warn',
    statusLabel: `${failed.length} upozorenja`,
    detail: failed.map((f) => f.label).join(', '),
  }
}

export async function adminGetSecurityInsights(): Promise<AdminInsightsSnapshot> {
  await requireAdmin()
  const status = await getAdminStatus()
  const dnsOk = status.dns.filter((d) => d.ok).length
  const dnsTotal = status.dns.length
  const emailDns = status.dns.filter((d) =>
    ['Zoho MX', 'Zoho SPF (apex)', 'Brevo SPF (apex)', 'Brevo code', 'Resend SPF (send)', 'DMARC rua'].includes(
      d.label,
    ),
  )
  const emailDnsOk = emailDns.filter((d) => d.ok).length

  const sentryConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN)

  const insights: AdminInsight[] = [
    {
      id: 'admin-auth',
      label: 'Admin pristup',
      status: status.config.adminSecret ? 'ok' : 'warn',
      statusLabel: status.config.adminSecret ? 'Zaštićeno' : 'Nema lozinke',
      detail: status.config.adminSecret
        ? 'ADMIN_SECRET postavljen · /admin zahtijeva login'
        : 'Postavi ADMIN_SECRET na Vercelu',
      href: '/admin/login',
    },
    {
      id: 'cms',
      label: 'Supabase CMS',
      status: status.config.supabaseUrl && status.config.supabaseAnon ? 'ok' : 'warn',
      statusLabel:
        status.config.supabaseUrl && status.config.supabaseAnon ? 'Povezan' : 'Provjeri env',
      detail: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? 'Anon + service role · blog, portfolio, inbox'
        : 'Service role nedostaje — admin inbox možda prazan',
      href: `https://supabase.com/dashboard/project/${status.supabaseProject}`,
      external: true,
    },
    {
      id: 'email-dns',
      label: 'Email DNS (Zoho · Resend · Brevo)',
      status: emailDnsOk === emailDns.length ? 'ok' : 'warn',
      statusLabel: `${emailDnsOk}/${emailDns.length} OK`,
      detail: emailDnsOk === emailDns.length
        ? 'MX, SPF, DKIM, DMARC — Cloudflare zapisi'
        : 'Provjeri DNS u Alati → detalj',
      href: '/admin/tools',
    },
    {
      id: 'dns-all',
      label: 'DNS ukupno',
      status: dnsOk === dnsTotal ? 'ok' : 'warn',
      statusLabel: `${dnsOk}/${dnsTotal} OK`,
      detail: `${SITE_DOMAIN} · MX, SPF, DMARC provjera`,
      href: 'https://dash.cloudflare.com',
      external: true,
    },
    {
      id: 'https',
      label: 'HTTPS & domena',
      status: 'ok',
      statusLabel: 'Aktivno',
      detail: `${SITE_URL} · Vercel + Cloudflare`,
      href: SITE_URL,
      external: true,
    },
    {
      id: 'sentry',
      label: 'Sentry (greške)',
      status: sentryConfigured ? 'ok' : 'off',
      statusLabel: sentryConfigured ? 'Aktivan' : 'Opcionalno',
      detail: sentryConfigured
        ? 'Production error monitoring'
        : 'Nije konfiguriran — postavi SENTRY_DSN ako želiš',
      href: 'https://sentry.io/',
      external: true,
    },
  ]

  return { insights, checkedAt: new Date().toISOString() }
}

export async function adminGetCommsChannels(
  notifications: AdminNotifications,
): Promise<AdminCommsSnapshot> {
  await requireAdmin()
  const status = await getAdminStatus()

  const contactNotes: AdminCommsChannel['notifications'] = notifications.recentContacts
    .slice(0, NOTIFICATION_PREVIEW)
    .map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: c.email,
      detail: c.service ?? c.message,
      created_at: c.created_at ?? new Date(0).toISOString(),
      href: '/admin/inbox',
    }))

  const subscriberNotes: AdminCommsChannel['notifications'] = notifications.recentSubscribers
    .slice(0, NOTIFICATION_PREVIEW)
    .map((s) => ({
      id: s.id,
      title: 'Nova pretplata',
      subtitle: s.email,
      detail: [s.source, s.language].filter(Boolean).join(' · ') || null,
      created_at: s.created_at ?? new Date(0).toISOString(),
      href: '/admin/subscribers',
    }))

  const zohoDns = dnsStatusForLabels(status.dns, ADMIN_COMMS_SERVICES.zoho.dnsLabels)
  const resendDns = dnsStatusForLabels(status.dns, ADMIN_COMMS_SERVICES.resend.dnsLabels)
  const brevoDns = dnsStatusForLabels(status.dns, ADMIN_COMMS_SERVICES.brevo.dnsLabels)

  const channels: AdminCommsChannel[] = [
    {
      ...ADMIN_COMMS_SERVICES.zoho,
      ...zohoDns,
      detail: `${ADMIN_COMMS_EMAIL} · ${zohoDns.detail}`,
      badge: undefined,
      notifications: [],
    },
    {
      ...ADMIN_COMMS_SERVICES.webInbox,
      status: notifications.serviceRoleConfigured ? 'ok' : 'warn',
      statusLabel:
        notifications.contactsLast24Hours > 0
          ? `${notifications.contactsLast24Hours} novo (24h)`
          : 'Nema novih',
      detail: `${notifications.contactsLast7Days} upita (7 dana) u bazi`,
      badge:
        notifications.contactsLast24Hours > 0 ? `${notifications.contactsLast24Hours} novo` : undefined,
      notifications: contactNotes,
    },
    {
      ...ADMIN_COMMS_SERVICES.resend,
      ...resendDns,
      detail: `${ADMIN_COMMS_SERVICES.resend.role} · ${resendDns.detail}`,
      notifications: [],
    },
    {
      ...ADMIN_COMMS_SERVICES.brevo,
      ...brevoDns,
      detail: `${brevoDns.detail} · ${notifications.subscriberCount} pretplatnika u bazi`,
      badge:
        notifications.subscribersLast24Hours > 0
          ? `${notifications.subscribersLast24Hours} novo`
          : undefined,
      notifications: subscriberNotes,
    },
  ]

  return { channels, checkedAt: new Date().toISOString() }
}
