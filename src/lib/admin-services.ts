import { CONTACT_EMAIL } from '@/lib/site'

/** Single source for email/comms service roles — used by admin dashboard + detail pages. */
export const ADMIN_COMMS_SERVICES = {
  zoho: {
    id: 'zoho',
    label: 'Zoho Mail',
    role: 'Primanje svih dolaznih mailova na tvoj pravi inbox.',
    href: 'https://mail.zoho.eu',
    external: true,
    dnsLabels: ['Zoho MX', 'Zoho SPF (apex)'],
  },
  webInbox: {
    id: 'web-inbox',
    label: 'Upiti s web stranice',
    role: 'Kontakt forma spremljena u bazu; isti upit stiže i mailom u Zoho.',
    href: '/admin/inbox',
    external: false,
    dnsLabels: [] as string[],
  },
  resend: {
    id: 'resend',
    label: 'Resend',
    role: 'Slanje transakcijskih mailova: kontakt forma → tebi + auto-odgovor posjetitelju.',
    href: 'https://resend.com/domains',
    external: true,
    dnsLabels: ['Resend SPF (send)'],
  },
  brevo: {
    id: 'brevo',
    label: 'Brevo',
    role: 'Newsletter dobrodošlica, backup slanje i upravljanje kampanjama/listama.',
    href: 'https://app.brevo.com/contact/list',
    external: true,
    dnsLabels: ['Brevo SPF (apex)', 'Brevo code'],
  },
} as const

export const ADMIN_COMMS_EMAIL = CONTACT_EMAIL
