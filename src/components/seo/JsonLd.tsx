import { serializeJsonLd } from '@/lib/seo/json-ld'

type Props = {
  data: Record<string, unknown> | Array<Record<string, unknown>> | null
}

/** Server-safe JSON-LD script — no visible UI. XSS-safe serializer. */
export default function JsonLd({ data }: Props) {
  if (!data) return null

  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
    </>
  )
}
