'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BODULICA_STACK, PROTOS_WEB_STACK } from '@/lib/tech-stacks'
import GlowCard from '@/components/ui/GlowCard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

function StackCard({
  title,
  description,
  items,
  index,
  glowColor,
}: {
  title: string
  description: string
  items: string[]
  index: number
  glowColor: 'purple' | 'primary'
}) {
  return (
    <GlowCard className="h-full rounded-2xl" glowColor={glowColor}>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="cosmic-panel rounded-2xl p-8 h-full flex flex-col text-left transition-all duration-300"
      >
      <h3 className="text-xl font-extrabold text-[var(--light)] mb-3">{title}</h3>
      <p className="text-sm text-[var(--light-muted)] leading-7 mb-6 flex-1">{description}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="cosmic-panel px-4 py-2 rounded-full text-xs font-medium text-[var(--light)]"
          >
            {item}
          </span>
        ))}
      </div>
      </motion.div>
    </GlowCard>
  )
}

export default function DualStacksSection() {
  const t = useTranslations('aboutPage.dualStacks')

  return (
    <section id="tech-stacks" className="scroll-mt-28 py-20 border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
            {t('label')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-4">{t('title')}</h2>
          <p className="text-base text-[var(--light-muted)] leading-7">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StackCard
            title={t('protosTitle')}
            description={t('protosDescription')}
            items={PROTOS_WEB_STACK.items}
            index={0}
            glowColor="purple"
          />
          <StackCard
            title={t('bodulicaTitle')}
            description={t('bodulicaDescription')}
            items={BODULICA_STACK.items}
            index={1}
            glowColor="primary"
          />
        </div>
        <p className="text-center text-xs text-[var(--light-muted)] mt-6">{t('bodulicaNote')}</p>
      </div>
    </section>
  )
}
