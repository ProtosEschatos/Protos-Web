'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { brandGlyph } from '@/components/ui/BrandIcons'
import type { PresenceItem } from '@/lib/config/social-links'
import {
  darioSocialItems,
  freelancePlatformItems,
  martinaSocialItems,
  partnerReferralItems,
  studioSocialItems,
} from '@/lib/config/team-profiles'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
}

function PresenceTile({
  item,
  index,
  pendingLabel,
}: {
  item: PresenceItem
  index: number
  pendingLabel: string
}) {
  const isPending = item.pending || item.href === '#'
  const className =
    'group/tile flex items-center gap-3 rounded-2xl border border-[var(--border-card)] bg-[var(--dark-card)] px-4 py-3.5 transition-all duration-300' +
    (isPending ? ' opacity-60 cursor-not-allowed' : ' hover:-translate-y-0.5')

  const inner = (
    <>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
        style={{ backgroundColor: `${item.brand}1f`, color: item.brand }}
      >
        {brandGlyph(item.id, 'w-5 h-5')}
      </span>
      <span className="text-sm font-semibold text-[var(--light)] transition-colors duration-300 group-hover/tile:text-[color:var(--brand)]">
        {item.label}
        {isPending ? (
          <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-[var(--light-muted)]">
            {pendingLabel}
          </span>
        ) : null}
      </span>
    </>
  )

  if (isPending) {
    return (
      <motion.div
        role="link"
        aria-label={`${item.label} — ${pendingLabel}`}
        aria-disabled="true"
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className={className}
        style={{ ['--brand' as string]: item.brand }}
      >
        {inner}
      </motion.div>
    )
  }

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.label}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className={className}
      style={{ ['--brand' as string]: item.brand }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = item.brand
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
      }}
    >
      {inner}
    </motion.a>
  )
}

function PresenceGroup({
  title,
  items,
  startIndex,
  pendingLabel,
}: {
  title: string
  items: PresenceItem[]
  startIndex: number
  pendingLabel: string
}) {
  return (
    <div className="mb-10">
      <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--light-muted)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <PresenceTile
            key={`${title}-${item.id}`}
            item={item}
            index={startIndex + i}
            pendingLabel={pendingLabel}
          />
        ))}
      </div>
    </div>
  )
}

export default function OnlinePresence() {
  const t = useTranslations('onlinePresence')
  const pendingLabel = t('pendingLabel')

  return (
    <section id="online-presence" className="scroll-mt-28 py-20 border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">
            {t('label')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-4">{t('title')}</h2>
          <p className="text-base text-[var(--light-muted)] max-w-[620px] mx-auto leading-7">{t('subtitle')}</p>
        </div>

        <PresenceGroup
          title={t('studioTitle')}
          items={studioSocialItems}
          startIndex={0}
          pendingLabel={pendingLabel}
        />
        <PresenceGroup
          title={t('darioTitle')}
          items={darioSocialItems}
          startIndex={10}
          pendingLabel={pendingLabel}
        />
        <PresenceGroup
          title={t('martinaTitle')}
          items={martinaSocialItems}
          startIndex={20}
          pendingLabel={pendingLabel}
        />

        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--light-muted)] mb-4">
            {t('platformsTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {freelancePlatformItems.map((item, i) => (
              <PresenceTile
                key={item.id}
                item={item}
                index={30 + i}
                pendingLabel={pendingLabel}
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--light-muted)] mb-4">
            {t('referralsTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {partnerReferralItems.map((item, i) => (
              <PresenceTile
                key={item.id}
                item={item}
                index={40 + i}
                pendingLabel={pendingLabel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
