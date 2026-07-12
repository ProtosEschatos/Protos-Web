'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import type { TestimonialRow } from '@/lib/queries/testimonials'

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

const avatarColors = [
  'bg-[var(--primary)]/20 text-[var(--primary)]',
  'bg-[var(--secondary)]/20 text-[var(--secondary)]',
  'bg-[var(--accent)]/20 text-[var(--accent)]',
]

type Props = {
  testimonials: TestimonialRow[]
}

export default function Testimonials({ testimonials }: Props) {
  const t = useTranslations('testimonials')

  if (testimonials.length === 0) return null

  return (
    <section className="cosmic-section py-24 border-t border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
          {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
        </h2>
        <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7 mb-12">{t('subtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariant}
              className="cosmic-panel rounded-2xl p-7 hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300"
            >
              {item.rating ? (
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-4 h-4 ${
                        starIndex < item.rating!
                          ? 'fill-[var(--primary)] text-[var(--primary)]'
                          : 'text-[var(--light-muted)]/30'
                      }`}
                    />
                  ))}
                </div>
              ) : null}
              <p className="text-sm text-[var(--light-muted)] leading-relaxed mb-5">&ldquo;{item.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                {item.avatar_url ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={item.avatar_url} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[i % avatarColors.length]}`}
                  >
                    {getInitials(item.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-[var(--light)]">{item.name}</div>
                  {item.role ? (
                    <div className="text-xs text-[var(--light-muted)]">{item.role}</div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
