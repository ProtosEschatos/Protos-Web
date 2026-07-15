/** Single source of truth for site identity — update here + platform secrets when domain/email changes. */

export const SITE_DOMAIN = 'protosweb.eu'
export const SITE_URL = 'https://protosweb.eu'
/** Studio / Dario — Protos Web brand */
export const INSTAGRAM_URL = 'https://www.instagram.com/protos_eschatos/'
export const DARIO_INSTAGRAM_URL = INSTAGRAM_URL
export const MARTINA_INSTAGRAM_URL = 'https://www.instagram.com/everybodycries/'

/** Public contact + Resend/Zoho mailbox on protosweb.eu */
export const CONTACT_EMAIL = 'dario.admin@protosweb.eu'
export const CONTACT_PHONE = '+385976043941'
export const CONTACT_PHONE_DISPLAY = '+385 97 604 39 41'

/** AirCash peer payment number (same as public contact phone). */
export const AIRCASH_PHONE = CONTACT_PHONE
export const AIRCASH_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY

/** Supabase project ref (laqnnzavwbojntfiqmxj) */
export const SUPABASE_PROJECT_REF = 'laqnnzavwbojntfiqmxj'

/** Legal / imprint — used in privacy policy and terms references */
export const LEGAL_OWNER = 'Dario Imsirović'
export const LEGAL_COLLABORATOR = 'Martina Markulin'
export const LEGAL_BRAND = 'Protos Web'
/** Obrt u procesu registracije */
export const LEGAL_BUSINESS_NAME = 'Protos Web Mark23'
export const LEGAL_OIB = '23732814520'
export const LEGAL_LOCATION = 'Zagreb, Republika Hrvatska'
export const LEGAL_LAST_UPDATED = '2026-07-11'
/** Bump when terms text changes — forces re-acceptance on next visit */
export const LEGAL_TERMS_VERSION = '2026-07-11-v3'
/** Google Search Console — HTML meta verification (DNS TXT also on Cloudflare). */
export const GOOGLE_SITE_VERIFICATION = '6SnN-0ojdBd99Wr_5Y5WmgDFSGUwtg-U0PgrDz7HL1A'

/** Google Business Profile (Maps) — set NEXT_PUBLIC_GOOGLE_BUSINESS_URL when live. */
export const GOOGLE_BUSINESS_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL?.trim() || ''

/** GA4 measurement ID — override via NEXT_PUBLIC_GA_ID on Vercel. */
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || 'G-LP29SJ3MM3'

/** Ko-fi page URL — kept for admin/tools; public donate CTA is Stripe Checkout. */
export const KO_FI_URL = 'https://ko-fi.com/protoswebmark23'
