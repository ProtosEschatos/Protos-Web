'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/routing'
import TransitionLink from '@/components/navigation/TransitionLink'
import { localeLabels, localeFlags, locales, type Locale } from '@/i18n'
import MobileMenu from './MobileMenu'
import ProtosEclipseLogo from '@/components/ui/ProtosEclipseLogo'

const themes = ['night', 'day', 'pro'] as const
type Theme = (typeof themes)[number]

const themeIcons: Record<Theme, string> = {
  night: '\u263E',
  day: '\u2600',
  pro: '\u25C9',
}

const navLinks = [
  { href: '/', key: 'home' as const },
  { href: '/o-meni', key: 'about' as const },
  { href: '/proces', key: 'process' as const },
  { href: '/portfolio', key: 'portfolio' as const },
  { href: '/usluge', key: 'services' as const },
  { href: '/blog', key: 'blog' as const },
  { href: '/kontakt', key: 'contact' as const },
]

export default function Header() {
  const t = useTranslations('nav')
  const th = useTranslations('header')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('night')
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('protos-theme') as Theme | null
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const handleLangSelect = (code: Locale) => {
    router.replace(pathname, { locale: code })
    setLangOpen(false)
  }

  const handleThemeCycle = () => {
    const idx = themes.indexOf(theme)
    const next = themes[(idx + 1) % themes.length]
    setTheme(next)
    localStorage.setItem('protos-theme', next)
    document.documentElement.setAttribute('data-theme', next)
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
              <ProtosEclipseLogo size={36} className="group-hover/logo:drop-shadow-[0_0_10px_rgba(255,136,0,0.55)]" />
              <span className="hidden sm:block transition-colors duration-300 group-hover/logo:text-[#ffb347]">
                {th('brand')}
              </span>
            </TransitionLink>

            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => (
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
            </nav>

            <div className="hidden lg:flex items-center gap-2.5">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300"
                >
                  <i className="fas fa-globe text-[var(--primary)] text-sm" />
                  <span className="text-sm font-medium text-[var(--light)]">{locale.toUpperCase()}</span>
                  <i className={`fas fa-chevron-down text-xs text-[var(--light-muted)] transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
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

              <button
                onClick={handleThemeCycle}
                className="w-[42px] h-[42px] rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 flex items-center justify-center transition-all duration-300 text-xl"
                aria-label={th('cycleTheme')}
              >
                {themeIcons[theme]}
              </button>

              <TransitionLink
                href="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--primary-glow)] transition-all duration-300"
              >
                {th('cta')}
              </TransitionLink>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={handleThemeCycle} className="w-10 h-10 rounded-lg bg-[var(--dark-card)]/50 border border-[var(--primary)]/20 flex items-center justify-center text-lg" aria-label={th('cycleTheme')}>
                {themeIcons[theme]}
              </button>
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
