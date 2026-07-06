'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { brandGlyph } from '@/components/ui/BrandIcons'
import { socialItems, type PresenceItem } from '@/lib/social-links'

const CONTACT_IDS = ['whatsapp', 'instagram'] as const

type Props = {
  className?: string
  boxClassName?: string
  iconClassName?: string
  variant?: 'boxed' | 'inline'
  pendingLabel?: string
}

function ChannelTile({
  item,
  boxClassName,
  iconClassName,
  variant,
  pendingLabel,
}: {
  item: PresenceItem
  boxClassName: string
  iconClassName: string
  variant: 'boxed' | 'inline'
  pendingLabel: string
}) {
  const isPending = item.pending || item.href === '#'
  const icon = brandGlyph(item.id, iconClassName)
  const style = { color: item.brand, ['--brand' as string]: item.brand } as const

  if (variant === 'inline') {
    if (isPending) {
      return (
        <span
          className="inline-flex items-center gap-2 text-[var(--light-muted)] opacity-60 cursor-not-allowed"
          aria-label={`${item.label} — ${pendingLabel}`}
          title={pendingLabel}
        >
          {icon}
          <span className="text-sm font-semibold">{item.label}</span>
        </span>
      )
    }
    return (
      <a
        href={item.href}
        target={item.id === 'whatsapp' ? undefined : '_blank'}
        rel={item.id === 'whatsapp' ? undefined : 'noopener noreferrer'}
        aria-label={item.label}
        className="inline-flex items-center gap-2 text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"
        style={style}
      >
        {icon}
        <span className="text-sm font-semibold">{item.label}</span>
      </a>
    )
  }

  if (isPending) {
    return (
      <span
        className={`${boxClassName} opacity-60 cursor-not-allowed`}
        aria-label={`${item.label} — ${pendingLabel}`}
        title={pendingLabel}
        style={style}
      >
        {icon}
      </span>
    )
  }

  return (
    <a
      href={item.href}
      target={item.id === 'whatsapp' ? undefined : '_blank'}
      rel={item.id === 'whatsapp' ? undefined : 'noopener noreferrer'}
      aria-label={item.label}
      className={boxClassName}
      style={style}
    >
      {icon}
    </a>
  )
}

export default function ContactChannels({
  className = 'flex gap-3',
  boxClassName = 'w-10 h-10 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--light-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300',
  iconClassName = 'w-4 h-4',
  variant = 'boxed',
  pendingLabel,
}: Props) {
  const t = useTranslations('onlinePresence')
  const label = pendingLabel ?? t('pending')
  const items = socialItems.filter((item) =>
    (CONTACT_IDS as readonly string[]).includes(item.id),
  )

  return (
    <div className={className}>
      {items.map((item) => (
        <ChannelTile
          key={item.id}
          item={item}
          boxClassName={boxClassName}
          iconClassName={iconClassName}
          variant={variant}
          pendingLabel={label}
        />
      ))}
    </div>
  )
}

export function ContactChannelsRow(props: Props & { label?: ReactNode }) {
  return (
    <div>
      {props.label ? (
        <div className="text-xs text-[var(--light-muted)] uppercase tracking-wider mb-2">{props.label}</div>
      ) : null}
      <ContactChannels {...props} variant="inline" className={props.className ?? 'flex flex-wrap gap-4'} />
    </div>
  )
}
