import type { ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { SOCIAL_EMAIL } from '@/lib/config/team-profiles'

type SocialLinksProps = {
  className?: string
  iconClassName?: string
}

type Item = {
  label: string
  href: string
  icon: ReactNode
}

function SocialAnchor({
  item,
  className,
}: {
  item: Item
  className: string
}) {
  return (
    <a href={item.href} aria-label={item.label} className={className}>
      {item.icon}
    </a>
  )
}

export default function SocialLinks({ className = 'flex gap-3', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const boxClass =
    'w-10 h-10 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--light-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300'

  const item: Item = {
    label: 'Email',
    href: `mailto:${SOCIAL_EMAIL}`,
    icon: <Mail className={iconClassName} />,
  }

  return (
    <div className={className}>
      <SocialAnchor item={item} className={boxClass} />
    </div>
  )
}

export function SocialLinksInline({ className = 'flex gap-4', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const linkClass = 'text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors'

  const item: Item = {
    label: 'Email',
    href: `mailto:${SOCIAL_EMAIL}`,
    icon: <Mail className={iconClassName} />,
  }

  return (
    <div className={className}>
      <SocialAnchor item={item} className={linkClass} />
    </div>
  )
}
