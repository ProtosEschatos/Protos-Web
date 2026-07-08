import { setRequestLocale } from 'next-intl/server'
import ComingSoon from '@/components/sections/ComingSoon'

type Props = { params: { locale: string } }

export default async function PortfolioShowcasePage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return <ComingSoon standalone />
}
