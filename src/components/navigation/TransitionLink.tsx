'use client'

import type { ComponentProps, MouseEvent } from 'react'
import { Link, usePathname } from '@/routing'
import { usePageTransition } from '@/components/navigation/PageTransitionProvider'
import { isMainNavHref, normalizeHref } from '@/lib/main-nav-routes'

type TransitionLinkProps = ComponentProps<typeof Link>

function hrefToString(href: TransitionLinkProps['href']): string {
  if (typeof href === 'string') return href
  if (href && typeof href === 'object' && 'pathname' in href && href.pathname) {
    return href.pathname
  }
  return '/'
}

export default function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const pathname = usePathname()
  const { startTransition, isTransitioning } = usePageTransition()

  const hrefString = hrefToString(href)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    if (!isMainNavHref(hrefString)) return
    if (isTransitioning) {
      event.preventDefault()
      return
    }

    const target = normalizeHref(hrefString)
    const current = normalizeHref(pathname)
    if (target === current) {
      event.preventDefault()
      return
    }

    event.preventDefault()
    startTransition(hrefString)
  }

  return <Link href={href} onClick={handleClick} {...rest} />
}
