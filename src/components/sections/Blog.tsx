'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'

const posts = [
  { title: 'Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', date: 'June 15, 2026', excerpt: '1,000 email subscribers are worth more than 10,000 Instagram followers. Email is direct, algorithm-free.' },
  { title: 'Web Analytics — How Do You Know Who Visits Your Site?', date: 'June 15, 2026', excerpt: 'Web analytics shows who visits your site, where they come from, and what they do.' },
  { title: 'What is a Landing Page and When to Use It for Maximum Impact?', date: 'June 17, 2026', excerpt: 'A landing page is a page with one goal — turning visitors into customers.' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
}

export default function Blog() {
  const t = useTranslations('blog')

  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">{t('title')}</h2>
        <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto mb-12 leading-7">{t('subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={cardVariant} className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-7 text-left flex flex-col hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-3">
                <i className="fas fa-calendar" />
                {p.date}
              </div>
              <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">{p.title}</h3>
              <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">{p.excerpt}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/blog" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--border-card)] text-[var(--light)] text-xs font-semibold uppercase tracking-wider hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300">
            {t('viewAll')} <i className="fas fa-arrow-right text-[0.75rem]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
