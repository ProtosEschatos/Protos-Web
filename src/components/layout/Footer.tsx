'use client'

import { useState, FormEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { MousePointer2, Heart } from 'lucide-react'
import { Link } from '@/routing'
import TransitionLink from '@/components/navigation/TransitionLink'
import SocialLinks from '@/components/ui/SocialLinks'

const footerLinks = [
  { href: '/', key: 'home' as const },
  { href: '/o-meni', key: 'about' as const },
  { href: '/usluge', key: 'services' as const },
  { href: '/portfolio', key: 'portfolio' as const },
  { href: '/proces', key: 'process' as const },
  { href: '/blog', key: 'blog' as const },
  { href: '/kontakt', key: 'contact' as const },
]

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const th = useTranslations('header')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const legalLinks = [
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
    { href: '/cookies', label: t('cookies') },
  ]

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: locale }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="cosmic-section border-t border-white/[0.06] pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_auto] gap-10 mb-12">
          <div>
            <TransitionLink href="/" className="inline-flex items-center gap-2.5 font-bold text-lg text-[var(--light)] mb-1">
              <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#8b5cf6" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontWeight="800" fontSize="18" fontFamily="Inter,sans-serif">P</text>
              </svg>
              <span>{th('brand')}</span>
            </TransitionLink>
            <p className="text-sm text-[var(--light-muted)] leading-7 mt-4 max-w-[340px]">
              {t('brand_desc')}
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-[340px]">
              <p className="text-sm font-semibold text-[var(--light)] mb-2">{t('newsletter_title')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status !== 'idle') setStatus('idle')
                  }}
                  placeholder={t('newsletter_placeholder')}
                  required
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] text-sm text-[var(--light)] placeholder:text-[var(--light-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold whitespace-nowrap hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
                >
                  {status === 'loading' ? '…' : t('newsletter_submit')}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-xs text-[var(--accent)] mt-2">{t('newsletter_success')}</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-400 mt-2">{t('newsletter_error')}</p>
              )}
            </form>

            <SocialLinks className="flex gap-3 mt-6" />
          </div>

          <div className="flex gap-10">
            <div>
              <h4 className="font-bold mb-5">{t('links')}</h4>
              <div className="flex flex-col gap-3">
                {footerLinks.map((l) => (
                  <TransitionLink key={l.href} href={l.href} className="text-sm text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors duration-300">
                    {tn(l.key)}
                  </TransitionLink>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-5">{t('legal')}</h4>
              <div className="flex flex-col gap-3">
                {legalLinks.map((l) => (
                  <Link key={l.label} href={l.href} className="text-sm text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors duration-300">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-5">{t('tools')}</h4>
            <a
              href="https://cursor.com/referral?code=1HM5DWZJCWXH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border-card)] bg-[var(--dark-card)] text-xs font-semibold text-[var(--light)] whitespace-nowrap hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <MousePointer2 className="w-3.5 h-3.5" />
              Try Cursor
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-[10px] font-bold uppercase tracking-wide">
                50% off 1st month
              </span>
            </a>
            <p className="text-xs text-[var(--light-muted)] leading-6 mt-3 max-w-[220px]">{t('tools_note')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t border-white/[0.06] text-xs text-[var(--light-muted)]">
          <span>&copy; {t('copyright')}</span>
          <span className="inline-flex items-center gap-2 text-lg sm:text-xl font-semibold text-[var(--light)]">
            {t('made_with')}
            <Heart className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
          </span>
        </div>
      </div>
    </footer>
  )
}
