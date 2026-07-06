import { CONTACT_EMAIL, SITE_URL, SUPABASE_PROJECT_REF } from '@/lib/site'
import { platformItems, socialItems } from '@/lib/social-links'

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

export const adminInboxLinks: AdminHubLink[] = [
  {
    id: 'zoho',
    label: 'Zoho Mail inbox',
    href: 'https://mail.zoho.eu',
    description: CONTACT_EMAIL,
    external: true,
  },
  {
    id: 'inbox-site',
    label: 'Upiti s web stranice',
    href: '/admin/inbox',
    description: 'Kontakt forma → baza contacts',
  },
]

export const adminMarketingLinks: AdminHubLink[] = [
  {
    id: 'brevo-campaigns',
    label: 'Brevo kampanje',
    href: 'https://app.brevo.com/marketing/campaign',
    description: 'Email marketing i newsletter kampanje',
    external: true,
  },
  {
    id: 'brevo-contacts',
    label: 'Brevo kontakti',
    href: 'https://app.brevo.com/contact/list',
    description: 'Pretplatnici, liste i segmenti',
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
  { id: 'resend', label: 'Resend', href: 'https://resend.com/domains', external: true },
  { id: 'brevo', label: 'Brevo', href: 'https://app.brevo.com/marketing/campaign', external: true },
  { id: 'github', label: 'GitHub Repo', href: 'https://github.com/ProtosEschatos/Protos-Web', external: true },
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
