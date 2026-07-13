'use server'

import { promises as dns } from 'dns'
import { requireAdmin } from '@/lib/auth/require-admin'
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_URL, SUPABASE_PROJECT_REF } from '@/lib/config/site'

export type DnsCheck = {
  label: string
  ok: boolean
  detail: string
}

export type AdminStatus = {
  domain: string
  contactEmail: string
  siteUrl: string
  supabaseProject: string
  dns: DnsCheck[]
  config: {
    adminSecret: boolean
    supabaseUrl: boolean
    supabaseAnon: boolean
  }
  links: { label: string; href: string }[]
}

async function txtRecords(name: string): Promise<string[]> {
  try {
    const records = await dns.resolveTxt(name)
    return records.map((chunks) => chunks.join(''))
  } catch {
    return []
  }
}

async function mxRecords(name: string): Promise<string[]> {
  try {
    const records = await dns.resolveMx(name)
    return records.map((r) => `${r.priority} ${r.exchange}`)
  } catch {
    return []
  }
}

export async function getAdminStatus(): Promise<AdminStatus> {
  await requireAdmin()

  const apexTxt = await txtRecords(SITE_DOMAIN)
  const dmarcTxt = await txtRecords(`_dmarc.${SITE_DOMAIN}`)
  const sendTxt = await txtRecords(`send.${SITE_DOMAIN}`)
  const mx = await mxRecords(SITE_DOMAIN)

  const hasBrevoCode = apexTxt.some((t) => t.startsWith('brevo-code:360956'))
  const hasOldBrevo = apexTxt.some((t) => t.startsWith('brevo-code:c2e6097'))
  const spf = apexTxt.find((t) => t.startsWith('v=spf1')) ?? ''
  const hasZohoMx = mx.some((m) => m.includes('zoho.eu'))
  const hasBrevoSpf = spf.includes('spf.brevo.com')
  const hasZohoSpf = spf.includes('zohomail.eu') || spf.includes('zoho.eu')
  const hasResendSpf = sendTxt.some((t) => t.includes('amazonses.com'))
  const dmarcOk = dmarcTxt.some((t) => t.includes('dario.admin@protosweb.eu'))

  return {
    domain: SITE_DOMAIN,
    contactEmail: CONTACT_EMAIL,
    siteUrl: SITE_URL,
    supabaseProject: SUPABASE_PROJECT_REF,
    dns: [
      { label: 'Zoho MX', ok: hasZohoMx, detail: mx.join(', ') || 'missing' },
      { label: 'Zoho SPF (apex)', ok: hasZohoSpf, detail: spf || 'missing' },
      { label: 'Brevo SPF (apex)', ok: hasBrevoSpf, detail: hasBrevoSpf ? spf : 'add include:spf.brevo.com' },
      { label: 'Brevo code', ok: hasBrevoCode && !hasOldBrevo, detail: hasOldBrevo ? 'remove old brevo-code duplicate' : hasBrevoCode ? 'ok' : 'missing' },
      { label: 'Resend SPF (send)', ok: hasResendSpf, detail: sendTxt.join(' ') || 'missing' },
      { label: 'DMARC rua', ok: dmarcOk, detail: dmarcTxt.join(' ') || 'missing' },
    ],
    config: {
      adminSecret: Boolean(process.env.ADMIN_SECRET),
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    links: [
      { label: 'Cloudflare DNS', href: 'https://dash.cloudflare.com' },
      { label: 'Admin Inbox', href: '/admin/inbox' },
      { label: 'Resend', href: 'https://resend.com/domains' },
      { label: 'Brevo', href: 'https://app.brevo.com/senders/domain' },
      { label: 'Supabase', href: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}` },
      { label: 'Vercel', href: 'https://vercel.com/dashboard' },
      { label: 'GitHub Repo', href: 'https://github.com/ProtosEschatos/Protos-Web' },
      { label: 'Live site', href: SITE_URL },
    ],
  }
}
