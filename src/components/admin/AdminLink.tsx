import type { ReactNode } from 'react'

type Props = {
  href: string
  className?: string
  children: ReactNode
}

/** Internal admin links — avoids next-intl routing bundle on server pages. */
export default function AdminLink({ href, className, children }: Props) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
