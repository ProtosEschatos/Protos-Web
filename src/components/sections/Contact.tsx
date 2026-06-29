'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const contactInfo = [
  { icon: 'fas fa-envelope', label: 'Email', value: 'contact@protos-design.net', color: 'bg-[var(--secondary)]/15 text-[var(--secondary)]' },
  { icon: 'fas fa-phone', label: 'Phone', value: '+385 97 604 39 41', color: 'bg-[var(--accent)]/15 text-[var(--accent)]' },
  { icon: 'fas fa-location-dot', label: 'Location', value: 'Zagreb, Croatia', color: 'bg-[var(--primary)]/15 text-[var(--primary)]' },
]

const serviceOptions = ['Custom Website', 'E-Commerce', 'Web Application', 'UI/UX Design', 'SEO & Marketing', 'Maintenance']

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          service: formData.get('service'),
          message: formData.get('message'),
        }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/[0.06] via-[var(--secondary)]/[0.06] to-[var(--accent)]/[0.06]" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">CONTACT</p>
            <h2 className="text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold leading-tight mb-10">
              Have a project?<br />Let&apos;s talk.
            </h2>
            <div className="space-y-7">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${c.color}`}>
                    <i className={c.icon} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--light-muted)] uppercase tracking-wider">{c.label}</div>
                    <div className="text-base font-semibold text-[var(--light)]">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-3xl p-10"
          >
            {!submitted ? (
              <>
                <h3 className="text-xl font-bold mb-7">Send an Inquiry</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input name="name" type="text" required placeholder="Your name" className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--light-muted)]" />
                    <input name="email" type="email" required placeholder="Email address" className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--light-muted)]" />
                  </div>
                  <div className="mb-4">
                    <select name="service" className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors appearance-none cursor-pointer [&>option]:bg-[var(--dark-card)]">
                      <option value="">Select a service</option>
                      {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="mb-6">
                    <textarea name="message" placeholder="Describe your project..." rows={4} className="w-full px-4 py-3.5 rounded-xl border border-[var(--border-card)] bg-white/[0.03] text-[var(--light)] text-sm outline-none focus:border-[var(--primary)] transition-colors resize-y min-h-[120px] placeholder:text-[var(--light-muted)]" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white text-sm font-semibold tracking-wider flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--secondary-glow)] transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : <>Send Message <i className="fas fa-arrow-right" /></>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">&#10003;</div>
                <p className="text-lg font-semibold text-[var(--light)]">Message sent!</p>
                <p className="text-sm text-[var(--light-muted)] mt-2">We&apos;ll get back to you within 24 hours.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
