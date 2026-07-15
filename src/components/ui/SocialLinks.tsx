import type { ReactNode } from 'react'
import { Heart, Mail } from 'lucide-react'
import { SOCIAL_EMAIL } from '@/lib/config/social-links'
import { KO_FI_URL } from '@/lib/config/site'

type SocialLinksProps = {
  className?: string
  iconClassName?: string
}

type Item = {
  label: string
  href: string
  icon: ReactNode
  external?: boolean
}

function SocialAnchor({
  item,
  className,
}: {
  item: Item
  className: string
}) {
  return (
    <a
      href={item.href}
      aria-label={item.label}
      className={className}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {item.icon}
    </a>
  )
}

function buildItems(iconClassName: string): Item[] {
  return [
    {
      label: 'Email',
      href: `mailto:${SOCIAL_EMAIL}`,
      icon: <Mail className={iconClassName} />,
    },
    {
      label: 'Ko-fi',
      href: KO_FI_URL,
      external: true,
      icon: <Heart className={`${iconClassName} fill-current`} />,
    },
  ]
}

export default function SocialLinks({ className = 'flex gap-3', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const boxClass =
    'w-10 h-10 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--light-muted)] hover:border-[#ff5e5b] hover:text-[#ff5e5b] transition-all duration-300'

  return (
    <div className={className}>
      {buildItems(iconClassName).map((item) => (
        <SocialAnchor key={item.label} item={item} className={boxClass} />
      ))}
    </div>
  )
}

export function SocialLinksInline({ className = 'flex gap-4', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  const linkClass = 'text-[var(--light-muted)] hover:text-[#ff5e5b] transition-colors'

  return (
    <div className={className}>
      {buildItems(iconClassName).map((item) => (
        <SocialAnchor key={item.label} item={item} className={linkClass} />
      ))}
    </div>
  )
}
