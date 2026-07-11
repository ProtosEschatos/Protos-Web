'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/routing'
import TransitionLink from '@/components/navigation/TransitionLink'
import { localeLabels, localeFlags, locales, type Locale } from '@/i18n'
import MobileMenu from './MobileMenu'
import { ChevronDown, Globe, MousePointer2 } from 'lucide-react'
import ProtosLogo from '@/components/ui/ProtosLogo'
import AdminNavLink from '@/components/features/admin/AdminNavLink'
import { MAIN_NAV_ITEMS } from '@/lib/routes/main-nav'

export default function Header() {
  const t = useTranslations('nav')
  const th = useTranslations('header')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLangSelect = (code: Locale) => {
    router.replace(pathname, { locale: code })
    setLangOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 ${
          scrolled ? 'backdrop-blur-md bg-[#0a0a1a]/80 border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <TransitionLink href="/" className="group/logo flex items-center gap-2.5 font-bold text-lg text-[var(--light)]">
              <ProtosLogo size={36} className="group-hover/logo:drop-shadow-[0_0_10px_rgba(255,136,0,0.55)]" />
              <span className="hidden sm:block transition-colors duration-300 group-hover/logo:text-[#ffb347]">
                {th('brand')}
              </span>
            </TransitionLink>

            <nav className="hidden lg:flex items-center gap-9">
              {MAIN_NAV_ITEMS.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[var(--primary)] after:transition-all after:duration-300 ${
                    pathname === link.href
                      ? 'text-[var(--primary)] after:w-full'
                      : 'text-[var(--light-muted)] hover:text-[var(--primary)] after:w-0 hover:after:w-full'
                  }`}
                >
                  {t(link.key)}
                </TransitionLink>
              ))}
              <AdminNavLink />
            </nav>

            <div className="hidden lg:flex items-center gap-2.5">
              <a
                href="https://cursor.com/referral?code=1HM5DWZJCWXH"
                target="_blank"
                rel="noopener noreferrer"
                title="Try Cursor — 50% off your first month"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300"
              >
                <MousePointer2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--light)]">Cursor</span>
                <span className="text-[10px] font-bold text-[var(--primary)]">-50%</span>
              </a>

              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--light)]">{locale.toUpperCase()}</span>
                  <ChevronDown className={`w-3 h-3 text-[var(--light-muted)] transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full right-0 mt-2 w-40 bg-[var(--dark-card)] border border-[var(--primary)]/20 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 z-50 ${langOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {locales.map((code) => (
                    <button
                      key={code}
                      onClick={() => handleLangSelect(code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary)]/10 transition-colors text-left text-sm ${
                        locale === code ? 'text-[var(--primary)]' : 'text-[var(--light)]'
                      }`}
                    >
                      <span className="text-lg">{localeFlags[code]}</span>
                      <span>{localeLabels[code]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <TransitionLink
                href="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--primary-glow)] transition-all duration-300"
              >
                {th('cta')}
              </TransitionLink>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="https://cursor.com/referral?code=1HM5DWZJCWXH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Try Cursor — 50% off your first month"
                className="inline-flex items-center gap-1.5 px-2.5 h-10 rounded-xl bg-[var(--dark-card)]/50 border border-[var(--primary)]/20 text-[var(--primary)] text-[11px] font-bold"
              >
                <MousePointer2 className="w-4 h-4" />
                <span>-50%</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-12 h-12 flex flex-col items-center justify-center gap-[6px] p-2"
                aria-label={th('menu')}
              >
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
