'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Linkedin, Facebook, Link2, Check } from 'lucide-react'

type Props = {
  url: string
  title: string
}

/** Share button set (X / LinkedIn / Facebook / copy link) — the share-button-set board asset in code. */
export default function ShareButtons({ url, title }: Props) {
  const t = useTranslations('blog')
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    {
      key: 'x',
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook className="h-4 w-4" />,
    },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--light-muted)]">
        {t('share')}
      </span>
      {targets.map((target) => (
        <a
          key={target.key}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('share')} — ${target.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--dark-card)]/70 text-[var(--light-muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
        >
          {target.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? t('linkCopied') : t('copyLink')}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-card)] bg-[var(--dark-card)]/70 text-[var(--light-muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
      >
        {copied ? <Check className="h-4 w-4 text-[var(--primary)]" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
