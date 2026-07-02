import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { SOCIAL_EMAIL, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM } from '@/lib/social-links'

type SocialLinksProps = {
  className?: string
  iconClassName?: string
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.021 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.017 7.052.072 5.775.127 4.602.413 3.635 1.38 2.668 2.347 2.382 3.52 2.327 4.798 2.272 6.078 2.255 6.487 2.255 12c0 5.513.017 5.922.072 7.202.055 1.278.341 2.451 1.308 3.418.967.967 2.14 1.253 3.418 1.308 1.28.055 1.689.072 7.202.072s5.922-.017 7.202-.072c1.278-.055 2.451-.341 3.418-1.308.967-.967 1.253-2.14 1.308-3.418.055-1.28.072-1.689.072-7.202s-.017-5.922-.072-7.202c-.055-1.278-.341-2.451-1.308-3.418-.967-.967-2.14-1.253-3.418-1.308C17.678.017 17.269 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

type Item = {
  label: string
  href?: string
  icon: ReactNode
}

function SocialAnchor({
  item,
  className,
}: {
  item: Item
  className: string
}) {
  if (item.href) {
    return (
      <a
        href={item.href}
        aria-label={item.label}
        className={className}
        {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {item.icon}
      </a>
    )
  }

  return (
    <span aria-label={item.label} className={`${className} opacity-50 cursor-default`}>
      {item.icon}
    </span>
  )
}

export default function SocialLinks({ className = 'flex gap-3', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const boxClass =
    'w-10 h-10 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--light-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300'

  const items: Item[] = [
    {
      label: 'Facebook',
      href: SOCIAL_FACEBOOK || undefined,
      icon: <FacebookIcon className={iconClassName} />,
    },
    {
      label: 'Instagram',
      href: SOCIAL_INSTAGRAM || undefined,
      icon: <InstagramIcon className={iconClassName} />,
    },
    {
      label: 'Email',
      href: `mailto:${SOCIAL_EMAIL}`,
      icon: <Mail className={iconClassName} />,
    },
  ]

  return (
    <div className={className}>
      {items.map((item) => (
        <SocialAnchor key={item.label} item={item} className={boxClass} />
      ))}
    </div>
  )
}

export function SocialLinksInline({ className = 'flex gap-4', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const linkClass = 'text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors'

  const items: Item[] = [
    {
      label: 'Facebook',
      href: SOCIAL_FACEBOOK || undefined,
      icon: <FacebookIcon className={iconClassName} />,
    },
    {
      label: 'Instagram',
      href: SOCIAL_INSTAGRAM || undefined,
      icon: <InstagramIcon className={iconClassName} />,
    },
    {
      label: 'Email',
      href: `mailto:${SOCIAL_EMAIL}`,
      icon: <Mail className={iconClassName} />,
    },
  ]

  return (
    <div className={className}>
      {items.map((item) => (
        <SocialAnchor key={item.label} item={item} className={linkClass} />
      ))}
    </div>
  )
}
