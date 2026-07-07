/** Single source of truth for site identity — update here + platform secrets when domain/email changes. */

export const SITE_DOMAIN = 'protosweb.eu'
export const SITE_URL = 'https://www.protosweb.eu'

/** Display brand (site name, publisher, OG siteName) */
export const SITE_NAME = 'Protos Web'
export const SITE_NAME_ALT = 'ProtosWeb'
export const COMPANY_NAME = 'ProtosWeb Mark23'

/** Author / founder — used in meta tags and JSON-LD across all pages */
export const AUTHOR_NAME = 'Dario Imsirović'
export const AUTHOR_JOB_TITLE = 'Full Stack Developer & Web Designer'
export const AUTHOR_URL_PATH = '/o-meni'

export const INSTAGRAM_HANDLE = 'protos_eschatos'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

/**
 * Google-only mailbox (GA4, Search Console, site verification).
 * Never use in contact forms, Resend, Zoho, or public JSON-LD contact fields.
 */
export const SEO_GOOGLE_EMAIL = 'protoswebmark23@gmail.com'

/** Public contact + Resend/Zoho mailbox on protosweb.eu */
export const CONTACT_EMAIL = 'dario.admin@protosweb.eu'

/** Supabase project ref (laqnnzavwbojntfiqmxj) */
export const SUPABASE_PROJECT_REF = 'laqnnzavwbojntfiqmxj'
