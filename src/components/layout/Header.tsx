'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const languages = [
  { code: 'hr', flag: '\u{1F1ED}\u{1F1F7}', label: 'Hrvatski' },
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', label: 'Deutsch' },
  { code: 'it', flag: '\u{1F1EE}\u{1F1F9}', label: 'Italiano' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'Espanol' },
]

const themes = ['night', 'day', 'pro'] as const
type Theme = (typeof themes)[number]

const themeIcons: Record<Theme, string> = {
  night: '\u263E',
  day: '\u2600',
  pro: '\u25C9',
}

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/o-meni', label: 'ABOUT' },
  { href: '/proces', label: 'PROCESS' },
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/usluge', label: 'SERVICES' },
  { href: '/blog', label: 'BLOG' },
  { href: '/kontakt', label: 'CONTACT' },
]

export default function Header() {
  const [langOpen, setLangOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('EN')
  const [theme, setTheme] = useState<Theme>('night')
  const [scrolled, setScrolled] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close lang on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Restore saved lang + theme
  useEffect(() => {
    const savedLang = localStorage.getItem('protos-lang')
    const savedTheme = localStorage.getItem('protos-theme') as Theme | null
    if (savedLang) setCurrentLang(savedLang.toUpperCase())
    if (savedTheme && themes.includes(savedTheme)) setTheme(savedTheme)
  }, [])

  const handleLangSelect = (code: string) => {
    setCurrentLang(code.toUpperCase())
    localStorage.setItem('protos-lang', code)
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
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 ${
          scrolled ? 'backdrop-blur-md bg-[#0a0a1a]/80 border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-[var(--light)]">
              <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="17" fill="#0d0d1a" stroke="#FF8800" strokeWidth="1.5" />
                <path d="M18,1 A17,17 0 0,1 18,35 A17,17 0 0,0 18,1" fill="#FF6600" />
              </svg>
              <span className="hidden sm:block">Protos Web</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[var(--primary)] after:transition-all after:duration-300 ${
                    pathname === link.href
                      ? 'text-[var(--primary)] after:w-full'
                      : 'text-[var(--light-muted)] hover:text-[var(--primary)] after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Lang */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300"
                >
                  <i className="fas fa-globe text-[var(--primary)] text-sm" />
                  <span className="text-sm font-medium text-[var(--light)]">{currentLang}</span>
                  <i className={`fas fa-chevron-down text-xs text-[var(--light-muted)] transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full right-0 mt-2 w-40 bg-[var(--dark-card)] border border-[var(--primary)]/20 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 z-50 ${langOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary)]/10 transition-colors text-left text-sm ${
                        currentLang === lang.code.toUpperCase() ? 'text-[var(--primary)]' : 'text-[var(--light)]'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <button
                onClick={handleThemeCycle}
                className="w-[42px] h-[42px] rounded-xl bg-[var(--dark-card)]/50 hover:bg-[var(--dark-card)] border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 flex items-center justify-center transition-all duration-300 text-xl"
                aria-label="Cycle theme"
              >
                {themeIcons[theme]}
              </button>

              {/* CTA */}
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--primary-glow)] transition-all duration-300"
              >
                GET A QUOTE
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={handleThemeCycle} className="w-10 h-10 rounded-lg bg-[var(--dark-card)]/50 border border-[var(--primary)]/20 flex items-center justify-center text-lg" aria-label="Theme">
                {themeIcons[theme]}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-12 h-12 flex flex-col items-center justify-center gap-[6px] p-2"
                aria-label="Menu"
              >
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[2px] w-6 bg-[var(--light)] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[var(--dark)] z-40 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="max-w-lg mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-5xl sm:text-7xl font-extrabold text-[var(--light)] hover:text-[var(--primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setMobileOpen(false)}
              className="block text-5xl sm:text-7xl font-extrabold gradient-text"
            >
              Kontakt
            </Link>
          </nav>
          <div className="mt-16 text-[var(--light-muted)]">
            <p className="text-sm">contact@protos-design.net</p>
            <p className="text-sm">+385 97 604 39 41</p>
          </div>
        </div>
      </div>
    </>
  )
}
