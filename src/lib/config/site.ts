/** Single source of truth for site identity — update here + platform secrets when domain/email changes. */

export const SITE_DOMAIN = 'protosweb.eu'
export const SITE_URL = 'https://protosweb.eu'
/** Studio / Dario — Protos Web brand */
export const INSTAGRAM_URL = 'https://www.instagram.com/protos_eschatos/'
export const DARIO_INSTAGRAM_URL = INSTAGRAM_URL
export const MARTINA_INSTAGRAM_URL = 'https://www.instagram.com/everybodycries/'

/** Verified public social / freelance / publishing profiles (sameAs + presence). */
export const FACEBOOK_URL = 'https://www.facebook.com/imsirovicdario23/'
export const GITHUB_ORG_URL = 'https://github.com/ProtosEschatos'
export const SUBSTACK_URL = 'https://darioimsirovic.substack.com/'
export const SUBSTACK_FEATURED_POST_URL =
  'https://darioimsirovic.substack.com/p/protos-web-web-studio-iz-zagreba'
export const UPWORK_URL = 'https://www.upwork.com/freelancers/protos01eschatos'
/** Public goLance profile (not the private /freelancer/home dashboard). */
export const GOLANCE_URL = 'https://golance.com/freelancer/dario.imsirovic'
export const WHATSAPP_URL = 'https://wa.me/385976043941'

/** Publishing / author profiles — keep in sync with SEO sameAs. */
export const MEDIUM_URL = 'https://medium.com/@protoswebmark23'
export const MEDIUM_FEATURED_POST_URL =
  'https://medium.com/@protoswebmark23/zagreb-ima-web-studio-koji-malo-tko-zna-a-svi-bi-trebali-6b0ff8a4f376'
export const BLOGGER_URL = 'https://protoswebeu.blogspot.com/'
export const BLOGGER_FEATURED_POST_URL =
  'https://protoswebeu.blogspot.com/2026/07/mali-studio-iz-zagreba-koji-gradi-web.html'
export const TUMBLR_URL = 'https://www.tumblr.com/protoswebhr'
export const ABOUT_ME_URL = 'https://about.me/imsirovicdarioprotosweb'

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

/** Optional Google Business Profile / Maps share link when you have a listing.
 * Not required for the site. When you create one in Google Business Profile,
 * paste the public Maps URL into NEXT_PUBLIC_GOOGLE_BUSINESS_URL on Vercel. */
export const GOOGLE_BUSINESS_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL?.trim() || ''

/** GA4 measurement ID — override via NEXT_PUBLIC_GA_ID on Vercel. */
export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || 'G-LP29SJ3MM3'

/** Ko-fi page URL — kept for admin/tools; public donate CTA is Stripe Checkout. */
export const KO_FI_URL = 'https://ko-fi.com/protoswebmark23'
