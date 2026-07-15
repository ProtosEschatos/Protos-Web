import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Legacy URL — 3D room lives at /portfolio. */
export default async function PortfolioShowcaseRedirectPage({ searchParams }: Props) {
  const query = await searchParams
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const entry of value) params.append(key, entry)
    } else {
      params.set(key, value)
    }
  }

  const qs = params.toString()
  redirect(qs ? `/portfolio?${qs}` : '/portfolio')
}
