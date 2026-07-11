'use client'

import { useLocale } from 'next-intl'
import type { ReactNode } from 'react'
import { adminHref } from '@/lib/admin-path'

type Props = {
  href: string
  className?: string
  children: ReactNode
  target?: string
  rel?: string
}

/** Internal admin links with correct locale prefix. */
export default function AdminLink({ href, className, children, target, rel }: Props) {
  const locale = useLocale()
  const resolved = href.startsWith('http') ? href : adminHref(href, locale)

  return (
    <a href={resolved} className={className} target={target} rel={rel}>
      {children}
    </a>
  )
}
