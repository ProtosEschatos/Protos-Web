import { buildCreatorSeoGraph, CREATOR_ME_LINKS } from '@/lib/config/creator-seo'
import { LEGAL_COLLABORATOR, LEGAL_OWNER } from '@/lib/config/site'

type Props = { locale: string }

/** Per-locale invisible SEO — rel=me, geo, JSON-LD @graph. No visible UI.
 *  keywords / author come only from Next Metadata API (single source). */
export default function LocaleCreatorSeo({ locale }: Props) {
  const graph = buildCreatorSeoGraph(locale)

  return (
    <>
      {CREATOR_ME_LINKS.map((href) => (
        <link key={href} rel="me" href={href} />
      ))}
      <meta name="geo.region" content="HR-21" />
      <meta name="geo.placename" content="Zagreb" />
      <meta name="geo.position" content="45.8150;15.9819" />
      <meta name="ICBM" content="45.8150, 15.9819" />
      <meta name="coverage" content="Croatia, Slovenia, Serbia, Bosnia and Herzegovina, Montenegro, North Macedonia, Balkans, European Union" />
      <meta name="designer" content={LEGAL_COLLABORATOR} />
      <meta name="creator" content={LEGAL_OWNER} />
      <meta name="publisher" content="Protos Web" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    </>
  )
}
