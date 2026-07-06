import type { ReactNode } from 'react'
import ContactChannels from '@/components/ui/ContactChannels'

type SocialLinksProps = {
  className?: string
  iconClassName?: string
}

export default function SocialLinks({ className = 'flex gap-3', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  return <ContactChannels className={className} iconClassName={iconClassName} />
}

export function SocialLinksInline({ className = 'flex gap-4', iconClassName = 'w-4 h-4' }: SocialLinksProps) {
  return (
    <ContactChannels
      className={className}
      iconClassName={iconClassName}
      variant="inline"
      boxClassName=""
    />
  )
}
