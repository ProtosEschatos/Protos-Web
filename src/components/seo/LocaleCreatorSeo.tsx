import { buildCreatorSeoGraph, CREATOR_ME_LINKS, getCreatorKeywords } from '@/lib/creator-seo'
import { LEGAL_COLLABORATOR, LEGAL_OWNER } from '@/lib/site'

type Props = { locale: string }

/** Per-locale invisible SEO — rel=me, meta, JSON-LD @graph. No visible UI. */
export default function LocaleCreatorSeo({ locale }: Props) {
  const graph = buildCreatorSeoGraph(locale)

  return (
    <>
      {CREATOR_ME_LINKS.map((href) => (
        <link key={href} rel="me" href={href} />
      ))}
      <meta name="keywords" content={getCreatorKeywords(locale)} />
      <meta name="author" content={`${LEGAL_OWNER}, ${LEGAL_COLLABORATOR}`} />
      <meta name="designer" content={LEGAL_COLLABORATOR} />
      <meta name="creator" content={LEGAL_OWNER} />
      <meta name="publisher" content="Protos Web" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    </>
  )
}
