'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

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

  const legalLinks = [
    { href: '#', label: t('privacy') },
    { href: '#', label: t('terms') },
    { href: '#', label: t('cookies') },
  ]

  const causes = [
    { label: t('cause_antiScam'), color: 'bg-[var(--secondary)]' },
    { label: t('cause_education'), color: 'bg-[var(--primary)]' },
    { label: t('cause_platforms'), color: 'bg-[var(--accent)]' },
  ]

  return (
    <footer className="cosmic-section border-t border-white/[0.06] pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-lg text-[var(--light)] mb-1">
              <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#8b5cf6" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontWeight="800" fontSize="18" fontFamily="Inter,sans-serif">P</text>
              </svg>
              <span>{th('brand')}</span>
            </Link>
            <p className="text-sm text-[var(--light-muted)] leading-7 mt-4 max-w-[340px]">
              {t('brand_desc')}
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: 'fab fa-facebook-f', label: 'Facebook' },
                { icon: 'fab fa-instagram', label: 'Instagram' },
                { icon: 'fas fa-envelope', label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-[var(--dark-card)] border border-[var(--border-card)] flex items-center justify-center text-[var(--light-muted)] text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-5">{t('links')}</h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors duration-300">
                  {tn(l.key)}
                </Link>
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

        <div className="text-center py-8 border-t border-white/[0.06] mt-4">
          <p className="text-sm text-[var(--light-muted)] mb-3">{t('causes_title')}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {causes.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[var(--border-card)] text-xs text-[var(--light-muted)]">
                <span className={`w-2 h-2 rounded-full ${c.color}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-white/[0.06] text-xs text-[var(--light-muted)]">
          <span>&copy; {t('copyright')}</span>
          <span>{t('made_with')}</span>
        </div>
      </div>
    </footer>
  )
}
