'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePageTransition } from '@/components/navigation/PageTransitionProvider'

export default function PageTransitionOverlay() {
  const t = useTranslations('transition')
  const { phase, destinationKey, isTransitioning } = usePageTransition()

  const labelKey = destinationKey
    ? (`to${destinationKey.charAt(0).toUpperCase()}${destinationKey.slice(1)}` as
        | 'toHome'
        | 'toAbout'
        | 'toProcess'
        | 'toPortfolio'
        | 'toServices'
        | 'toBlog'
        | 'toContact')
    : 'loading'

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[#0a0a1a]"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' || phase === 'loading' ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,102,0,0.18) 0%, transparent 45%), radial-gradient(circle at 30% 70%, rgba(139,92,246,0.15) 0%, transparent 40%)',
            }}
          />

          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-px w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'left center',
                rotate: `${i * 15}deg`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'exit' || phase === 'loading' ? 1.8 : 0,
                opacity: phase === 'enter' ? 0 : 0.5,
              }}
              transition={{ duration: 0.8, delay: i * 0.015 }}
            />
          ))}

          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: phase === 'enter' ? 1.15 : 1,
              opacity: phase === 'enter' ? 0 : 1,
            }}
            transition={{ duration: phase === 'enter' ? 0.9 : 0.7, ease: 'easeInOut' }}
          >
            <div className="relative mb-8 h-28 w-28">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
                animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                transition={{ rotate: { duration: 3, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-[var(--secondary)] border-t-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
                animate={{ scale: [0.85, 1.05, 0.85] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--light-muted)]">
              {t('loading')}
            </p>
            <h2 className="text-2xl font-bold gradient-text md:text-3xl">
              {destinationKey ? t(labelKey) : t('loading')}
            </h2>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-[#0a0a1a]"
            initial={{ scale: 0, borderRadius: '100%' }}
            animate={{
              scale: phase === 'enter' ? 3 : 0,
              opacity: phase === 'enter' ? 1 : 0,
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center center' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
