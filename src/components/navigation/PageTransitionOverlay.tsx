'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePageTransition } from '@/components/navigation/PageTransitionProvider'
import TransitionVisual from '@/components/navigation/TransitionVisual'
import { getTransitionVariant } from '@/lib/transition-variants'

export default function PageTransitionOverlay() {
  const t = useTranslations('transition')
  const { phase, destinationKey, isTransitioning } = usePageTransition()
  const variant = getTransitionVariant(destinationKey)

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

  const exitScale = variant.exitMotion === 'zoom-in' ? 1.08 : variant.exitMotion === 'fold-up' ? 0.96 : 1.02
  const enterOrigin =
    variant.enterMotion === 'slide-right'
      ? 'left center'
      : variant.enterMotion === 'orbit-out'
        ? 'center center'
        : 'center center'

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[#0a0a1a]"
          aria-live="polite"
          aria-busy="true"
        >
          <TransitionVisual destinationKey={destinationKey} phase={phase} />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: phase === 'enter' ? 1.1 : 1,
              opacity: phase === 'enter' ? 0 : 1,
              y: phase === 'loading' ? -6 : 0,
            }}
            transition={{ duration: phase === 'enter' ? 0.85 : 0.65, ease: 'easeInOut' }}
          >
            <div className="relative mb-8 h-24 w-24">
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: variant.primary }}
                animate={{ rotate: 360, scale: [1, 1.06, 1] }}
                transition={{ rotate: { duration: 2.5, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.6, repeat: Infinity } }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-t-transparent"
                style={{ borderColor: variant.secondary }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-6 rounded-full"
                style={{ background: `linear-gradient(135deg, ${variant.primary}, ${variant.secondary})` }}
                animate={{ scale: [0.88, 1.04, 0.88] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--light-muted)]">
              {t('loading')}
            </p>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: variant.primary }}>
              {destinationKey ? t(labelKey) : t('loading')}
            </h2>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-[#0a0a1a]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'enter' ? exitScale + 1.5 : 0,
              opacity: phase === 'enter' ? 1 : 0,
            }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: enterOrigin }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
