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
} from '@/lib/site'

/** Verified public profiles — no unverified FB for Martina */
export const CREATOR_PROFILES = {
  dario: {
    id: `${SITE_URL}/#dario-imsirovic`,
    name: LEGAL_OWNER,
    givenName: 'Dario',
    familyName: 'Imsirović',
    jobTitle: {
      hr: 'Full Stack Developer i osnivač Protos Weba',
      en: 'Full Stack Developer and founder of Protos Web',
    },
    knowsAbout: [
      'Full stack web development',
      'Web design',
      '3D web experiences',
      'Cyber security',
      'SaaS platforms',
    ],
    sameAs: [
      'https://www.facebook.com/imsirovicdario23/',
      'https://www.instagram.com/protos_eschatos/',
    ],
    speaks: ['hr', 'en', 'de'],
  },
  martina: {
    id: `${SITE_URL}/#martina-markulin`,
    name: LEGAL_COLLABORATOR,
    givenName: 'Martina',
    familyName: 'Markulin',
    jobTitle: {
      hr: 'UI dizajnerica i kreativna suradnica',
      en: 'UI designer and creative collaborator',
    },
    knowsAbout: [
      'UI design',
      'UX design',
      'Visual identity',
      'Branding',
      'Creative direction',
    ],
    sameAs: ['https://www.instagram.com/everybodycries/'],
  },
} as const

export const CREATOR_ME_LINKS = [
  ...CREATOR_PROFILES.dario.sameAs,
  ...CREATOR_PROFILES.martina.sameAs,
] as const

const KEYWORDS: Record<'hr' | 'en', string> = {
  hr: [
    'Protos Web',
    'web dizajn Zagreb',
    'izrada web stranica',
    'Dario Imsirović',
    'Martina Markulin',
    'UI dizajn',
    'UX dizajn',
    'full stack developer',
    'web studio Hrvatska',
    'custom web rješenja',
    'SEO optimizacija',
    'Protos Web Mark23',
  ].join(', '),
  en: [
    'Protos Web',
    'web design Zagreb',
    'website development Croatia',
    'Dario Imsirović',
    'Martina Markulin',
    'UI design',
    'UX design',
    'full stack developer',
    'web studio Croatia',
    'custom web solutions',
    'SEO optimization',
    'Protos Web Mark23',
  ].join(', '),
}

function resolveLocale(locale: string): 'hr' | 'en' {
  return locale === 'hr' ? 'hr' : 'en'
}

export function getCreatorKeywords(locale: string): string {
  return KEYWORDS[resolveLocale(locale)]
}

export function getCreatorMetaDescription(locale: string): string {
  const loc = resolveLocale(locale)
  if (loc === 'hr') {
    return 'Protos Web — web studio iz Zagreba. Full stack razvoj: Dario Imsirović. UI/UX dizajn: Martina Markulin. Brze, moderne stranice s dušom.'
  }
  return 'Protos Web — web studio from Zagreb. Full stack development by Dario Imsirović. UI/UX design by Martina Markulin. Fast, modern websites with soul.'
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
        legalName: LEGAL_BUSINESS_NAME,
        url: SITE_URL,
        image: `${SITE_URL}/favicon.svg`,
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        taxID: LEGAL_OIB,
        description: getCreatorMetaDescription(locale),
        areaServed: [
          { '@type': 'Country', name: 'Croatia' },
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
          areaServed: ['HR', 'EU'],
          availableLanguage: ['Croatian', 'English', 'German'],
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
        knowsLanguage: ['hr', 'en', 'de', 'it', 'es'],
        makesOffer: { '@id': serviceId },
      },
      {
        '@type': 'Person',
        '@id': dario.id,
        name: dario.name,
        givenName: dario.givenName,
        familyName: dario.familyName,
        jobTitle: dario.jobTitle[loc],
        knowsAbout: dario.knowsAbout,
        knowsLanguage: ['Croatian', 'English', 'German'],
        worksFor: { '@id': orgId },
        sameAs: [...dario.sameAs],
        url: SITE_URL,
      },
      {
        '@type': 'Person',
        '@id': martina.id,
        name: martina.name,
        givenName: martina.givenName,
        familyName: martina.familyName,
        jobTitle: martina.jobTitle[loc],
        knowsAbout: martina.knowsAbout,
        worksFor: { '@id': orgId },
        colleague: { '@id': dario.id },
        sameAs: [...martina.sameAs],
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

export function buildBlogAuthorGraph(locale: string) {
  const loc = resolveLocale(locale)
  return [
    {
      '@type': 'Person',
      '@id': CREATOR_PROFILES.dario.id,
      name: CREATOR_PROFILES.dario.name,
      jobTitle: CREATOR_PROFILES.dario.jobTitle[loc],
    },
    {
      '@type': 'Person',
      '@id': CREATOR_PROFILES.martina.id,
      name: CREATOR_PROFILES.martina.name,
      jobTitle: CREATOR_PROFILES.martina.jobTitle[loc],
    },
  ]
}
