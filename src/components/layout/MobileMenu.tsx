'use client'

import { useTranslations, useLocale } from 'next-intl'
import TransitionLink from '@/components/navigation/TransitionLink'
import { SocialLinksInline } from '@/components/ui/SocialLinks'
import KoFiButton from '@/components/ui/KoFiButton'
import { CONTACT_EMAIL } from '@/lib/config/site'
import { motion, AnimatePresence } from 'framer-motion'
import { MAIN_NAV_ITEMS, navPublicHref } from '@/lib/routes/main-nav'
import type { Locale } from '@/i18n'

const linkVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('nav')
  const th = useTranslations('header')
  const locale = useLocale() as Locale

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 bg-[var(--dark)] z-40 lg:hidden"
        >
          <div className="max-w-lg mx-auto px-6 h-full flex flex-col justify-center">
            <nav className="space-y-4">
              {MAIN_NAV_ITEMS.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={linkVariant}
                >
                  <TransitionLink
                    href={navPublicHref(link.key, locale)}
                    onClick={onClose}
                    className="block text-5xl sm:text-7xl font-extrabold text-[var(--light)] hover:text-[var(--primary)] transition-colors duration-300"
                  >
                    {t(link.key)}
                  </TransitionLink>
                </motion.div>
              ))}
              <motion.div
                custom={MAIN_NAV_ITEMS.length}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={linkVariant}
              >
                <TransitionLink
                  href="/kontakt"
                  onClick={onClose}
                  className="block text-5xl sm:text-7xl font-extrabold gradient-text"
                >
                  {t('contact')}
                </TransitionLink>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-[var(--light-muted)]"
            >
              <KoFiButton label={th('kofi')} variant="footer" className="mb-6" />
              <p className="text-sm">{CONTACT_EMAIL}</p>
              <p className="text-sm">+385 97 604 39 41</p>
              <SocialLinksInline className="flex gap-4 mt-6" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
