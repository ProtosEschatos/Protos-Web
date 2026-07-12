import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LEGAL_BRAND,
  LEGAL_BUSINESS_NAME,
  LEGAL_COLLABORATOR,
  LEGAL_LOCATION,
  LEGAL_OIB,
  LEGAL_OWNER,
  SITE_URL,
} from '@/lib/config/site'
import { getLiveProfileUrls, darioSocialItems, martinaSocialItems } from '@/lib/config/team-profiles'
import { buildLocalePath } from '@/lib/config/seo'
import { aboutPathForLocale } from '@/lib/routes/localized-paths'

const DARIO_PERSON_ID = `${SITE_URL}/#dario-imsirovic`
const MARTINA_PERSON_ID = `${SITE_URL}/#martina-markulin`

function personAboutUrl(locale: string, fragment: 'dario-imsirovic' | 'martina-markulin') {
  return `${SITE_URL}${buildLocalePath(locale, aboutPathForLocale(locale))}#${fragment}`
}
/** Verified public profiles — live sameAs URLs only */
export const CREATOR_PROFILES = {
  dario: {
    id: DARIO_PERSON_ID,
    name: LEGAL_OWNER,
    givenName: 'Dario',
    familyName: 'Imširović',
    // English/international keyboards can't type š/ć — cover both the fully
    // ASCII spelling and the older partial-diacritic spelling that was live
    // on the site before, so search matches regardless of how it's typed.
    alternateName: ['Dario Imsirovic', 'Dario Imsirović'],
    jobTitle: {
      hr: 'AI inženjer & Full Stack Cross-Web Developer',
      en: 'AI Engineer & Full Stack Cross-Web Developer',
    },
    knowsAbout: [
      'AI engineering',
      'Full stack web development',
      '3D web experiences',
      'Cyber security',
      'Cross-web development',
    ],
    sameAs: getLiveProfileUrls(darioSocialItems),
    speaks: ['hr', 'en', 'de'],
  },
  martina: {
    id: MARTINA_PERSON_ID,
    name: LEGAL_COLLABORATOR,
    givenName: 'Martina',
    familyName: 'Markulin',
    alternateName: ['Martina Markulin'],
    jobTitle: {
      hr: 'Frontend ekspert & vrhunska shop/UI dizajnerica',
      en: 'Frontend expert & top-tier shop/UI designer',
    },
    knowsAbout: [
      'Frontend development',
      'Shop design',
      'UI design',
      'UX design',
      '3D visuals',
      'Branding',
    ],
    sameAs: getLiveProfileUrls(martinaSocialItems),
    knowsLanguage: ['Croatian', 'English'],
  },
} as const

export const CREATOR_ME_LINKS = [
  ...CREATOR_PROFILES.dario.sameAs,
  ...CREATOR_PROFILES.martina.sameAs,
] as const

const KEYWORDS: Record<'hr' | 'en', string> = {
  hr: [
    'Protos',
    'Protos Web',
    'protosweb',
    'protos web studio',
    'web dizajn Zagreb',
    'izrada web stranica',
    'Dario Imširović',
    'Dario Imsirovic',
    'Dario Imsirović',
    'Martina Markulin',
    'AI inženjer',
    'full stack developer Zagreb',
    'UI dizajn',
    'UX dizajn',
    'web studio Hrvatska',
    'SEO optimizacija',
    'Protos Web Mark23',
    'izrada web stranica Srbija',
    'izrada sajtova Beograd',
    'web dizajn Bosna i Hercegovina',
    'izrada web stranica Sarajevo',
    'veb dizajn Crna Gora',
    'izrada web stranica Podgorica',
    'izrada web stranica region',
    'izrada web stranica Balkan',
  ].join(', '),
  en: [
    'Protos',
    'Protos Web',
    'protosweb',
    'protos web studio',
    'web design Zagreb',
    'website development Croatia',
    'Dario Imširović',
    'Dario Imsirovic',
    'Dario Imsirović',
    'Martina Markulin',
    'AI engineer',
    'full stack developer Zagreb',
    'UI design',
    'UX design',
    'web studio Croatia',
    'SEO optimization',
    'Protos Web Mark23',
  ].join(', '),
}

function resolveLocale(locale: string): 'hr' | 'en' {
  // Serbian reuses the Croatian (regionally closest) keywords/description —
  // still far more relevant to sr readers than falling back to English.
  return locale === 'hr' || locale === 'sr' ? 'hr' : 'en'
}

export function getCreatorKeywords(locale: string): string {
  return KEYWORDS[resolveLocale(locale)]
}

export function getCreatorMetaDescription(locale: string): string {
  const loc = resolveLocale(locale)
  if (loc === 'hr') {
    return 'Protos Web — web studio iz Zagreba. AI inženjer Dario Imširović (full stack, 3D). Frontend/shop dizajn: Martina Markulin.'
  }
  return 'Protos Web — web studio from Zagreb. AI engineer Dario Imširović (full stack, 3D). Frontend/shop design: Martina Markulin.'
}

type GraphLocale = 'hr' | 'en'

export function buildCreatorSeoGraph(locale: string) {
  const loc: GraphLocale = resolveLocale(locale)
  const orgId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`
  const creativeWorkId = `${SITE_URL}/#website-creative-work`
  const serviceId = `${SITE_URL}/#professional-service`

  const dario = CREATOR_PROFILES.dario
  const martina = CREATOR_PROFILES.martina

  const serviceTypes =
    loc === 'hr'
      ? ['Izrada web stranica', 'Web dizajn', 'UI/UX dizajn', 'SEO optimizacija']
      : ['Web Development', 'Web Design', 'UI/UX Design', 'SEO Optimization']

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: LEGAL_BRAND,
        alternateName: ['Protos Web Mark23', 'protosweb', 'Protos'],
        description: getCreatorMetaDescription(locale),
        inLanguage: locale,
        publisher: { '@id': orgId },
        creator: [{ '@id': dario.id }, { '@id': martina.id }],
        potentialAction: {
          '@type': 'ContactAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/kontakt`,
          },
          description:
            loc === 'hr'
              ? 'Kontaktirajte Protos Web za ponudu'
              : 'Contact Protos Web for a quote',
        },
      },
      {
        '@type': 'ProfessionalService',
        '@id': serviceId,
        name: LEGAL_BRAND,
        alternateName: ['Protos Web Mark23', 'protosweb', 'Protos'],
        legalName: LEGAL_BUSINESS_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/favicon.svg`,
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        taxID: LEGAL_OIB,
        description: getCreatorMetaDescription(locale),
        areaServed: [
          { '@type': 'Country', name: 'Croatia' },
          { '@type': 'Country', name: 'Serbia' },
          { '@type': 'Country', name: 'Bosnia and Herzegovina' },
          { '@type': 'Country', name: 'Montenegro' },
          { '@type': 'Country', name: 'North Macedonia' },
          { '@type': 'Country', name: 'Slovenia' },
          { '@type': 'Place', name: 'European Union' },
        ],
        serviceType: serviceTypes,
        priceRange: '$$',
        founder: { '@id': dario.id },
        employee: [{ '@id': martina.id }],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: CONTACT_PHONE,
          email: CONTACT_EMAIL,
          contactType: 'customer service',
          areaServed: ['HR', 'RS', 'BA', 'ME', 'MK', 'SI', 'EU'],
          availableLanguage: ['Croatian', 'Serbian', 'English', 'German'],
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Zagreb',
          addressCountry: 'HR',
        },
      },
      {
        '@type': 'Organization',
        '@id': orgId,
        name: LEGAL_BRAND,
        alternateName: ['Protos Web Mark23', 'protosweb', 'Protos'],
        legalName: LEGAL_BUSINESS_NAME,
        url: SITE_URL,
        email: CONTACT_EMAIL,
        taxID: LEGAL_OIB,
        description: getCreatorMetaDescription(locale),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Zagreb',
          addressCountry: 'HR',
        },
        founder: { '@id': dario.id },
        employee: [{ '@id': martina.id }],
        knowsLanguage: ['hr', 'en', 'de', 'it', 'es', 'sr'],
        makesOffer: { '@id': serviceId },
      },
      {
        '@type': 'Person',
        '@id': dario.id,
        name: dario.name,
        givenName: dario.givenName,
        familyName: dario.familyName,
        alternateName: [...dario.alternateName],
        jobTitle: dario.jobTitle[loc],
        knowsAbout: dario.knowsAbout,
        knowsLanguage: ['Croatian', 'English', 'German'],
        worksFor: { '@id': orgId },
        colleague: { '@id': martina.id },
        sameAs: [...dario.sameAs],
        url: personAboutUrl(locale, 'dario-imsirovic'),
      },
      {
        '@type': 'Person',
        '@id': martina.id,
        name: martina.name,
        givenName: martina.givenName,
        familyName: martina.familyName,
        alternateName: [...martina.alternateName],
        jobTitle: martina.jobTitle[loc],
        knowsAbout: martina.knowsAbout,
        knowsLanguage: martina.knowsLanguage,
        worksFor: { '@id': orgId },
        colleague: { '@id': dario.id },
        sameAs: [...martina.sameAs],
        url: personAboutUrl(locale, 'martina-markulin'),
      },
      {
        '@type': 'CreativeWork',
        '@id': creativeWorkId,
        name: `${LEGAL_BRAND} — ${loc === 'hr' ? 'web stranica i digitalni identitet' : 'website and digital identity'}`,
        url: SITE_URL,
        inLanguage: locale,
        creator: [{ '@id': dario.id }],
        contributor: [{ '@id': martina.id }],
        copyrightHolder: [{ '@id': dario.id }, { '@id': martina.id }, { '@id': orgId }],
        copyrightNotice:
          loc === 'hr'
            ? `© ${new Date().getFullYear()} ${LEGAL_OWNER}, ${LEGAL_COLLABORATOR} / ${LEGAL_BRAND}. Sva prava pridržana.`
            : `© ${new Date().getFullYear()} ${LEGAL_OWNER}, ${LEGAL_COLLABORATOR} / ${LEGAL_BRAND}. All rights reserved.`,
      },
    ],
  }
}

/** Legacy export — prefer buildCreatorSeoGraph */
export function buildOrganizationJsonLd(locale: string) {
  return buildCreatorSeoGraph(locale)
}

export function buildBlogAuthorGraph(
  locale: string,
  authorSlug: 'dario' | 'martina' | 'both' = 'dario',
) {
  const loc = resolveLocale(locale)
  const authors = []
  if (authorSlug === 'dario' || authorSlug === 'both') {
    authors.push({
      '@type': 'Person',
      '@id': CREATOR_PROFILES.dario.id,
      name: CREATOR_PROFILES.dario.name,
      jobTitle: CREATOR_PROFILES.dario.jobTitle[loc],
      url: personAboutUrl(locale, 'dario-imsirovic'),
    })
  }
  if (authorSlug === 'martina' || authorSlug === 'both') {
    authors.push({
      '@type': 'Person',
      '@id': CREATOR_PROFILES.martina.id,
      name: CREATOR_PROFILES.martina.name,
      jobTitle: CREATOR_PROFILES.martina.jobTitle[loc],
      url: personAboutUrl(locale, 'martina-markulin'),
    })
  }
  return authors
}

export function buildAboutPageJsonLd(locale: string, title: string, description: string) {
  const url = `${SITE_URL}${buildLocalePath(locale, aboutPathForLocale(locale))}`
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#aboutpage`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: [{ '@id': CREATOR_PROFILES.dario.id }, { '@id': CREATOR_PROFILES.martina.id }],
  }
}
