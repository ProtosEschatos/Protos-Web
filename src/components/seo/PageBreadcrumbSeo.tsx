import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbListJsonLd } from '@/lib/seo'

type Props = {
  locale: string
  path: string
  pageTitle: string
  homeLabel?: string
}

export default function PageBreadcrumbSeo({
  locale,
  path,
  pageTitle,
  homeLabel = 'Protos Web',
}: Props) {
  const data = breadcrumbListJsonLd(
    [
      { name: homeLabel, path: '' },
      { name: pageTitle, path },
    ],
    locale,
  )

  return <JsonLd data={data} />
}
