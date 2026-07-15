import { CONTACT_EMAIL, SITE_URL, SUPABASE_PROJECT_REF } from '@/lib/config/site'
import { platformItems, socialItems } from '@/lib/config/social-links'

/** Single source for email/comms service roles — used by admin dashboard + detail pages. */
export const ADMIN_COMMS_SERVICES = {
  zoho: {
    id: 'zoho',
    label: 'Inbox mail',
    role: 'Svi dolazni mailovi na dario.admin@protosweb.eu — čitaju se u admin panelu (IMAP).',
    href: '/admin/inbox',
    external: false,
    dnsLabels: ['Zoho MX', 'Zoho SPF (apex)'],
  },
  webInbox: {
    id: 'web-inbox',
    label: 'Kontakt forma',
    role: 'Upiti s /kontakt spremljeni u bazu + email obavijest na dario.admin@protosweb.eu.',
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

export type AdminHubLink = {
  id: string
  label: string
  href: string
  description?: string
  external?: boolean
  pending?: boolean
}

export const adminContentLinks: AdminHubLink[] = [
  {
    id: 'blog',
    label: 'Blog',
    href: '/admin/blog',
    description: 'Dodaj i uredi članke (Supabase blog_posts)',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '/admin/portfolio',
    description: 'Upravljaj projektima (Supabase portfolio_items)',
  },
]

export const adminCommsLinks: AdminHubLink[] = [
  {
    id: 'inbox-site',
    label: 'Inbox (mail + web forma)',
    href: '/admin/inbox',
    description: CONTACT_EMAIL,
  },
  {
    id: 'resend',
    label: 'Resend',
    href: 'https://resend.com/domains',
    description: 'Transakcijsko slanje — kontakt forma',
    external: true,
  },
  {
    id: 'brevo-contacts',
    label: 'Brevo kontakti',
    href: 'https://app.brevo.com/contact/list',
    description: 'Newsletter liste i kampanje',
    external: true,
  },
  {
    id: 'brevo-campaigns',
    label: 'Brevo kampanje',
    href: 'https://app.brevo.com/marketing/campaign',
    description: 'Email marketing kampanje',
    external: true,
  },
]

export const adminInboxLinks: AdminHubLink[] = adminCommsLinks.filter((l) =>
  ['inbox-site'].includes(l.id),
)

export const adminMarketingLinks: AdminHubLink[] = [
  {
    id: 'google-analytics',
    label: 'Google Analytics 4',
    href: 'https://analytics.google.com/analytics/web/#/p/G-HR9HK4SR7Q/reports/intelligenthome',
    description: 'Posjete, izvori prometa, konverzije',
    external: true,
  },
  {
    id: 'google-business',
    label: 'Google Business Profile',
    href: 'https://business.google.com/',
    description: 'Google Maps, recenzije, lokalni SEO',
    external: true,
  },
  {
    id: 'search-console',
    label: 'Google Search Console',
    href: 'https://search.google.com/search-console?resource_id=sc-domain%3Aprotosweb.eu',
    description: 'Indeks, pretraga, Core Web Vitals',
    external: true,
  },
  {
    id: 'vercel-speed',
    label: 'Vercel Speed Insights',
    href: 'https://vercel.com/protoseschatos-projects/protos-web/speed-insights',
    description: 'Core Web Vitals iz produkcije',
    external: true,
  },
]

export const adminPlatformLinks: AdminHubLink[] = [
  { id: 'cloudflare', label: 'Cloudflare', href: 'https://dash.cloudflare.com', external: true },
  { id: 'vercel', label: 'Vercel', href: 'https://vercel.com/dashboard', external: true },
  {
    id: 'supabase',
    label: 'Supabase',
    href: `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}`,
    external: true,
  },
  { id: 'github', label: 'GitHub Repo', href: 'https://github.com/ProtosEschatos/Protos-Web', external: true },
  { id: 'stripe', label: 'Stripe', href: 'https://dashboard.stripe.com', external: true },
  { id: 'sentry', label: 'Sentry', href: 'https://sentry.io/', external: true },
  { id: 'zoho-admin', label: 'Zoho Mail', href: 'https://mail.zoho.eu', external: true },
  { id: 'live', label: 'Javna stranica', href: SITE_URL, external: true },
]

export const adminSocialLinks: AdminHubLink[] = socialItems.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
  external: true,
  pending: item.pending,
}))

export const adminFreelanceLinks: AdminHubLink[] = platformItems.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
  external: true,
  pending: item.pending,
}))
