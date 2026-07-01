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

  const exitVariants = {
    'zoom-in': { scale: 1.12, filter: 'blur(6px)' },
    'slide-left': { x: '-8%', scale: 1.05, filter: 'blur(4px)' },
    shatter: { scale: 1.08, rotate: 2, filter: 'blur(5px)' },
    'fold-up': { y: '-6%', scale: 0.94, filter: 'blur(4px)' },
    'stream-up': { y: '-10%', scale: 1.06, filter: 'blur(6px)' },
    'radar-in': { scale: 1.15, filter: 'blur(3px)' },
    'orbit-in': { scale: 1.1, rotate: -3, filter: 'blur(4px)' },
  } as const

  const exitStyle = exitVariants[variant.exitMotion]

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[#050510]"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={
              phase === 'exit'
                ? exitStyle
                : phase === 'enter'
                  ? { scale: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)', opacity: 0 }
                  : { scale: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)', opacity: 1 }
            }
            transition={{ duration: phase === 'exit' ? 1.1 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <TransitionVisual destinationKey={destinationKey} phase={phase} />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-white mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' ? [0, 0.35, 0] : 0 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{
              scale: phase === 'enter' ? 1.2 : 1,
              opacity: phase === 'enter' ? 0 : 1,
              y: phase === 'loading' ? -8 : 0,
            }}
            transition={{ duration: phase === 'enter' ? 0.9 : 0.7, ease: 'easeInOut' }}
          >
            <div className="relative mb-8 h-28 w-28">
              <motion.div
                className="absolute inset-0 rounded-full border-[3px]"
                style={{ borderColor: variant.primary, boxShadow: `0 0 40px ${variant.primary}88` }}
                animate={{ rotate: 360, scale: [1, 1.12, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.2, repeat: Infinity } }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-[3px] border-t-transparent"
                style={{ borderColor: variant.secondary }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-6 rounded-full"
                style={{ background: `linear-gradient(135deg, ${variant.primary}, ${variant.secondary})`, boxShadow: `0 0 30px ${variant.accent}` }}
                animate={{ scale: [0.85, 1.08, 0.85] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--light-muted)]">
              {t('loading')}
            </p>
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ color: variant.primary, textShadow: `0 0 30px ${variant.primary}88` }}
            >
              {destinationKey ? t(labelKey) : t('loading')}
            </h2>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-[#050510]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'enter' ? 2.5 : 0,
              opacity: phase === 'enter' ? 1 : 0,
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center center', borderRadius: '100%' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
