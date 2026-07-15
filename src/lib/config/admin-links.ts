import { CONTACT_EMAIL, SITE_URL, SUPABASE_PROJECT_REF } from '@/lib/config/site'
import { SEO_TOOL_URLS } from '@/lib/config/marketing'
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

/** SEO / marketing checklist from paper — links + setup hints. Live status in /admin insights. */
export const adminMarketingLinks: AdminHubLink[] = [
  {
    id: 'search-console',
    label: 'Google Search Console',
    href: SEO_TOOL_URLS.searchConsole,
    description: 'Indeks, pretraga, submit sitemap.xml',
    external: true,
  },
  {
    id: 'bing-webmaster',
    label: 'Bing Webmaster Tools',
    href: SEO_TOOL_URLS.bingWebmaster,
    description: 'Verify site → NEXT_PUBLIC_BING_SITE_VERIFICATION na Vercel',
    external: true,
  },
  {
    id: 'google-analytics',
    label: 'Google Analytics 4',
    href: SEO_TOOL_URLS.ga4,
    description: 'Property G-HR9HK4SR7Q · brojke nakon pristanka korisnika',
    external: true,
  },
  {
    id: 'tag-manager',
    label: 'Google Tag Manager',
    href: SEO_TOOL_URLS.tagManager,
    description: 'Kreiraj container → GTM-XXXX → NEXT_PUBLIC_GTM_ID',
    external: true,
  },
  {
    id: 'plausible',
    label: 'Plausible Analytics',
    href: SEO_TOOL_URLS.plausible,
    description: 'Opcionalno · NEXT_PUBLIC_PLAUSIBLE_DOMAIN=protosweb.eu',
    external: true,
  },
  {
    id: 'facebook-pixel',
    label: 'Facebook Pixel',
    href: SEO_TOOL_URLS.facebookEvents,
    description: 'Events Manager → Pixel ID → NEXT_PUBLIC_FB_PIXEL_ID',
    external: true,
  },
  {
    id: 'google-business',
    label: 'Google Business Profile',
    href: SEO_TOOL_URLS.businessProfile,
    description: 'Maps listing · NEXT_PUBLIC_GOOGLE_BUSINESS_URL kad je live',
    external: true,
  },
  {
    id: 'keyword-planner',
    label: 'Keyword Planner',
    href: SEO_TOOL_URLS.keywordPlanner,
    description: 'Google Ads research alat (vanjski)',
    external: true,
  },
  {
    id: 'trends',
    label: 'Google Trends',
    href: SEO_TOOL_URLS.trends,
    description: 'Trend research (vanjski)',
    external: true,
  },
  {
    id: 'seranking',
    label: 'SE Ranking',
    href: SEO_TOOL_URLS.seRanking,
    description: 'SEO SaaS monitoring (pretplata)',
    external: true,
  },
  {
    id: 'semrush',
    label: 'SEMrush',
    href: SEO_TOOL_URLS.semrush,
    description: 'SEO SaaS audit (pretplata)',
    external: true,
  },
  {
    id: 'rich-results',
    label: 'Rich Results Test',
    href: SEO_TOOL_URLS.richResultsTest,
    description: 'Test structured data na live URL-u',
    external: true,
  },
  {
    id: 'page-speed',
    label: 'PageSpeed Insights',
    href: SEO_TOOL_URLS.pageSpeedInsights,
    description: 'Lighthouse score na produkciji',
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
