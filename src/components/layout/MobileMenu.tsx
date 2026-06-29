'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/o-meni', label: 'About' },
  { href: '/proces', label: 'Process' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/usluge', label: 'Services' },
  { href: '/blog', label: 'Blog' },
]

const linkVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={linkVariant}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block text-5xl sm:text-7xl font-extrabold text-[var(--light)] hover:text-[var(--primary)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={linkVariant}
              >
                <Link
                  href="/kontakt"
                  onClick={onClose}
                  className="block text-5xl sm:text-7xl font-extrabold gradient-text"
                >
                  Kontakt
                </Link>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-[var(--light-muted)]"
            >
              <p className="text-sm">contact@protos-design.net</p>
              <p className="text-sm">+385 97 604 39 41</p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"><i className="fab fa-facebook-f" /></a>
                <a href="#" className="text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"><i className="fab fa-instagram" /></a>
                <a href="#" className="text-[var(--light-muted)] hover:text-[var(--primary)] transition-colors"><i className="fas fa-envelope" /></a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
