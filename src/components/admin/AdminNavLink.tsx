'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/routing'
import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/navigation/TransitionLink'

export default function AdminNavLink({
  className = '',
  variant = 'desktop',
  onClick,
}: {
  className?: string
  variant?: 'desktop' | 'mobile'
  onClick?: () => void
}) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) setAuthenticated(Boolean(data.authenticated))
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false)
      })
    return () => {
      cancelled = true
    }
  }, [pathname])

  if (!authenticated) return null

  const active = pathname === '/admin'

  if (variant === 'mobile') {
    return (
      <TransitionLink
        href="/admin"
        onClick={onClick}
        className={`block text-5xl sm:text-7xl font-extrabold transition-colors duration-300 ${
          active ? 'gradient-text' : 'text-[var(--light)] hover:text-[var(--primary)]'
        } ${className}`}
      >
        {t('admin')}
      </TransitionLink>
    )
  }

  return (
    <TransitionLink
      href="/admin"
      onClick={onClick}
      className={`text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[var(--primary)] after:transition-all after:duration-300 ${
        active
          ? 'text-[var(--primary)] after:w-full'
          : 'text-[var(--light-muted)] hover:text-[var(--primary)] after:w-0 hover:after:w-full'
      } ${className}`}
    >
      {t('admin')}
    </TransitionLink>
  )
}
