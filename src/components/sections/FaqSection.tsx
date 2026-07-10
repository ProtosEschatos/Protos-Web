'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqPageJsonLd, buildLocaleUrl } from '@/lib/seo'

type FaqItem = { question: string; answer: string }

type Props = {
  title: string
  subtitle: string
  items: FaqItem[]
  locale: string
  pagePath?: string
}

export default function FaqSection({ title, subtitle, items, locale, pagePath = '/usluge' }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const jsonLd = faqPageJsonLd(items, buildLocaleUrl(locale, pagePath))

  return (
    <section className="py-16 border-t border-white/[0.06]" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[800px] mx-auto px-6">
        <h2 id="faq-heading" className="text-2xl font-extrabold text-center mb-3">
          {title}
        </h2>
        <p className="text-sm text-[var(--light-muted)] text-center mb-10 leading-relaxed">{subtitle}</p>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.question}
                className="cosmic-panel rounded-xl overflow-hidden border border-white/[0.06]"
              >
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-sm font-semibold text-[var(--light)]">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[var(--primary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${index}`}
                      role="region"
                      aria-labelledby={`faq-q-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-[var(--light-muted)] leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
