'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  const t = useTranslations('contact')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const serviceOptions = t.raw('serviceOptions') as string[]

  const contactInfo = [
    { icon: Mail, label: t('email'), value: 'contact@protos-design.net', color: 'bg-[var(--secondary)]/15 text-[var(--secondary)]' },
    { icon: Phone, label: t('phone'), value: '+385 97 604 39 41', color: 'bg-[var(--accent)]/15 text-[var(--accent)]' },
    { icon: MapPin, label: t('location'), value: t('locationValue'), color: 'bg-[var(--primary)]/15 text-[var(--primary)]' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          service: formData.get('service'),
          message: formData.get('message'),
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      alert(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 relative overflow-hidden cosmic-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/[0.06] via-[var(--secondary)]/[0.06] to-[var(--accent)]/[0.06]" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">{t('label')}</p>
            <h2 className="text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold leading-tight mb-10">
              {t('title')}<br />{t('titleLine2')}
            </h2>
            <div className="space-y-7">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--light-muted)] uppercase tracking-wider">{c.label}</div>
                    <div className="text-base font-semibold text-[var(--light)]">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="cosmic-panel rounded-3xl p-10">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input name="name" type="text" required placeholder={t('namePlaceholder')} className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--light-muted)]" />
                  <input name="email" type="email" required placeholder={t('emailPlaceholder')} className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--light-muted)]" />
                </div>
                <div className="mb-4">
                  <select name="service" className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer [&>option]:bg-[var(--dark-card)]">
                    <option value="">{t('servicePlaceholder')}</option>
                    {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mb-6">
                  <textarea name="message" required placeholder={t('messagePlaceholder')} rows={4} className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors resize-y min-h-[120px] placeholder:text-[var(--light-muted)]" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white text-sm font-semibold tracking-wider flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--secondary-glow)] transition-all duration-300 disabled:opacity-50">
                  {loading ? t('sending') : <>{t('submit')} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 text-[var(--primary)]">&#10003;</div>
                <p className="text-lg font-semibold text-[var(--light)]">{t('success')}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
