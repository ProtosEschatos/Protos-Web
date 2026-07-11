'use client'

import Link from 'next/link'
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

/** Internal admin links — client-side navigation (no full page reload). */
export default function AdminLink({ href, className, children, target, rel }: Props) {
  const locale = useLocale()
  const resolved = href.startsWith('http') ? href : adminHref(href, locale)

  if (href.startsWith('http') || target === '_blank') {
    return (
      <a href={resolved} className={className} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  return (
    <Link href={resolved} className={className} prefetch>
      {children}
    </Link>
  )
}
