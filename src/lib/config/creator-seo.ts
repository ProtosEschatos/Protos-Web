import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  GOOGLE_BUSINESS_PROFILE_URL,
  INSTAGRAM_URL,
  LEGAL_BRAND,
  LEGAL_BUSINESS_NAME,
  LEGAL_COLLABORATOR,
  LEGAL_OIB,
  LEGAL_OWNER,
  SITE_URL,
} from '@/lib/config/site'
import { getLiveProfileUrls, darioSocialItems, martinaSocialItems } from '@/lib/config/team-profiles'
import { buildLocalePath } from '@/lib/config/seo'
import { formatKeywords, getServiceTypesForLocale } from '@/lib/config/seo-keywords'
import { aboutPathForLocale } from '@/lib/routes/localized-paths'
import type { Locale } from '@/i18n'

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
    familyName: 'Imsirović',
    alternateName: ['Dario Imsirovic'],
    jobTitle: {
      hr: 'AI inženjer & Full Stack Cross-Web Developer',
      en: 'AI Engineer & Full Stack Cross-Web Developer',
    },
    knowsAbout: [
      'AI engineering',
      'Full stack web development',
      'Web design',
      'Website development',
      '3D web experiences',
      'SEO optimization',
      'E-commerce development',
      'Cyber security',
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
      'Web design',
      'Shop design',
      'UI design',
      'UX design',
      '3D visuals',
      'Branding',
      'Website design',
    ],
    sameAs: getLiveProfileUrls(martinaSocialItems),
    knowsLanguage: ['Croatian', 'English'],
  },
} as const

export const CREATOR_ME_LINKS = [
  ...CREATOR_PROFILES.dario.sameAs,
  ...CREATOR_PROFILES.martina.sameAs,
] as const

const KEYWORDS: Record<Locale, string> = {
  hr: formatKeywords('hr'),
  sr: formatKeywords('sr'),
  en: formatKeywords('en'),
  de: formatKeywords('de'),
  it: formatKeywords('it'),
  es: formatKeywords('es'),
}

function resolveLocale(locale: string): Locale {
  const supported: Locale[] = ['hr', 'en', 'de', 'it', 'es', 'sr']
  return supported.includes(locale as Locale) ? (locale as Locale) : 'en'
}

export function getCreatorKeywords(locale: string): string {
  return KEYWORDS[resolveLocale(locale)]
}

export function getCreatorMetaDescription(locale: string): string {
  const loc = resolveLocale(locale)
  const descriptions: Record<Locale, string> = {
    hr: 'Protos Web — web studio iz Zagreba. Izrada web stranica, UI/UX dizajn i SEO za Hrvatsku, Sloveniju, Srbiju, Bosnu, regiju i EU. Dario Imsirović (razvoj) i Martina Markulin (dizajn).',
    sr: 'Protos Web — веб студио из Загреба. Израда веб страница, UI/UX дизајн и SEO за Хрватску, Словенију, Србију, Босну, регион и ЕУ. Дарио Имсировић (развој) и Мартина Маркулин (дизајн).',
    en: 'Protos Web — web studio from Zagreb. Custom websites, UI/UX design and SEO for Croatia, Slovenia, Serbia, Bosnia, the Balkans and EU. Dario Imsirović (dev) and Martina Markulin (design).',
    de: 'Protos Web — Webstudio aus Zagreb. Websites, UI/UX-Design und SEO für Kroatien, Slowenien, Serbien, Bosnien, die Region und EU. Dario Imsirović & Martina Markulin.',
    it: 'Protos Web — studio web da Zagabria. Siti su misura, UI/UX e SEO per Croazia, Slovenia, Serbia, Bosnia, Balcani e UE. Dario Imsirović e Martina Markulin.',
    es: 'Protos Web — estudio web de Zagreb. Webs a medida, UI/UX y SEO para Croacia, Eslovenia, Serbia, Bosnia, Balcanes y UE. Dario Imsirović y Martina Markulin.',
  }
  return descriptions[loc]
}

export function buildCreatorSeoGraph(locale: string) {
  const loc = resolveLocale(locale)
  const orgId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`
  const creativeWorkId = `${SITE_URL}/#website-creative-work`
  const serviceId = `${SITE_URL}/#professional-service`

  const dario = CREATOR_PROFILES.dario
  const martina = CREATOR_PROFILES.martina

  const serviceTypes = getServiceTypesForLocale(loc)
  const graphLocale: 'hr' | 'en' = loc === 'hr' || loc === 'sr' ? 'hr' : 'en'
  const businessSameAs = [
    INSTAGRAM_URL,
    ...(GOOGLE_BUSINESS_PROFILE_URL ? [GOOGLE_BUSINESS_PROFILE_URL] : []),
  ]

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
            graphLocale === 'hr'
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
        sameAs: businessSameAs,
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
        sameAs: businessSameAs,
      },
      {
        '@type': 'Person',
        '@id': dario.id,
        name: dario.name,
        givenName: dario.givenName,
        familyName: dario.familyName,
        alternateName: [...dario.alternateName],
        jobTitle: dario.jobTitle[graphLocale],
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
        jobTitle: martina.jobTitle[graphLocale],
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
        name: `${LEGAL_BRAND} — ${graphLocale === 'hr' ? 'web stranica i digitalni identitet' : 'website and digital identity'}`,
        url: SITE_URL,
        inLanguage: locale,
        creator: [{ '@id': dario.id }],
        contributor: [{ '@id': martina.id }],
        copyrightHolder: [{ '@id': dario.id }, { '@id': martina.id }, { '@id': orgId }],
        copyrightNotice:
          graphLocale === 'hr'
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
  const graphLocale: 'hr' | 'en' = loc === 'hr' || loc === 'sr' ? 'hr' : 'en'
  const authors = []
  if (authorSlug === 'dario' || authorSlug === 'both') {
    authors.push({
      '@type': 'Person',
      '@id': CREATOR_PROFILES.dario.id,
      name: CREATOR_PROFILES.dario.name,
      jobTitle: CREATOR_PROFILES.dario.jobTitle[graphLocale],
      url: personAboutUrl(locale, 'dario-imsirovic'),
    })
  }
  if (authorSlug === 'martina' || authorSlug === 'both') {
    authors.push({
      '@type': 'Person',
      '@id': CREATOR_PROFILES.martina.id,
      name: CREATOR_PROFILES.martina.name,
      jobTitle: CREATOR_PROFILES.martina.jobTitle[graphLocale],
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
