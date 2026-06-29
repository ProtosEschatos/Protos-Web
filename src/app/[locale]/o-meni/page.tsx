'use client'

import { motion } from 'framer-motion'

const infoItems = [
  { label: 'NAME', value: 'Dario Imsilovic' },
  { label: 'LOCATION', value: 'Zagreb, Hrvatska' },
  { label: 'EXPERIENCE', value: '5 years' },
  { label: 'EMAIL', value: 'contact@protos-design.net', isLink: true },
  { label: 'PHONE', value: '+385 97 604 39 41' },
  { label: 'LANGUAGES', value: 'Croatian, English, Deutsch (basic)' },
]

const goals = [
  { emoji: '\u{1F30E}', title: 'European market', text: 'Actively expanding to EU clients through multilingual offerings and knowledge of European standards — GDPR, accessibility, localization.' },
  { emoji: '\u{1F4BB}', title: 'Custom platforms', text: 'Building SaaS and custom CRM solutions for niches that still lack a good digital solution in the local market.' },
  { emoji: '\u{1F510}', title: 'Cyber security', text: 'Integrating security standards into every project — ensure every website handling data must be protected.' },
]

const supportCards = [
  { emoji: '\u{1F6E1}', title: 'Cyber Security Education Equipment', text: 'Help us acquire a server, laptop and software for free online cyber security education — for everyone who wants to learn how to protect themselves online.', target: '10,000', btnText: 'Support education', btnColor: 'bg-red-500 hover:bg-red-600', progress: 5 },
  { emoji: '\u{1F4DA}', title: 'Free Digital Education', text: 'Fund free HR video tutorials and guides on web development, AI tools and digital security.', target: '10,000', btnText: 'Support education', btnColor: 'bg-green-500 hover:bg-green-600', progress: 3 },
  { emoji: '\u{1F310}', title: 'Regional Digital Platforms', text: 'Building open source alternatives to global platforms — made for the Balkans, by the Balkans.', target: '20,000', btnText: 'Invest in the region', btnColor: 'bg-green-500 hover:bg-green-600', progress: 2 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[var(--primary)]/[0.08] to-transparent border-b border-[var(--primary)]/10" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">ABOUT ME</p>
          <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-tight mb-5">
            Gradimo digitalna<br /><span className="gradient-text">rjesenja koja rastu</span><br />zajedno sa Vama.
          </h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            Full Stack Developer &amp; Web Designer from Zagreb. I create modern, fast and visually stunning websites that turn visitors into customers.
          </p>
        </div>
      </section>

      {/* Bio + Info */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h3 className="text-xl font-bold mb-5">Who I am</h3>
              <div className="space-y-4 text-sm text-[var(--light-muted)] leading-7">
                <p>Full Stack Developer from Zagreb with 5 years of experience building modern web solutions. I work with entrepreneurs and companies across Croatia and Europe — from fast landing pages to complex custom platforms, web shops, and CRM systems.</p>
                <p>Everything I build is custom — no pre-made themes, no compromises on quality. Every project starts from scratch, tailored exactly to your needs and goals.</p>
                <p>Interests: Full stack development, Cross platform web, 3D web experiences, Platform building, Web design, Cyber security.</p>
                <p>Goal: Help local and European businesses find the right web solution — without unnecessary complexity, with a modern interface.</p>
                <p><a href="#" className="text-[var(--primary)] underline inline-flex items-center gap-1.5"><i className="fas fa-book text-xs" /> Free web presence guides for entrepreneurs &rarr;</a></p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
              <h3 className="text-xl font-bold mb-6">Info</h3>
              <div className="flex flex-col gap-5">
                {infoItems.map((item) => (
                  <div key={item.label}>
                    <div className="text-[0.7rem] text-[var(--light-muted)] uppercase tracking-[0.15em] mb-1">{item.label}</div>
                    {item.isLink ? (
                      <a href={`mailto:${item.value}`} className="text-base font-semibold text-[var(--primary)]">{item.value}</a>
                    ) : (
                      <div className="text-base font-semibold text-[var(--light)]">{item.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-10">Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((g, i) => (
              <motion.div key={g.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-4">{g.emoji}</div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2">{g.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed">{g.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Balkans */}
      <section className="py-24 bg-[var(--dark-surface)] border-t border-b border-white/[0.06] text-center">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">SUPPORT</p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold leading-tight mb-5">
            Projects that change <span className="gradient-text">the digital Balkans</span>
          </h2>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7 mb-12">
            Every donation contributes to developing a platform for protection against internet fraud and building a freer digital space for our region.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportCards.map((c, i) => (
              <motion.div key={c.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-7 flex flex-col text-left">
                <div className="text-3xl mb-4">{c.emoji}</div>
                <h3 className="text-base font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1 mb-5">{c.text}</p>
                <div className="flex justify-between text-xs text-[var(--light-muted)] mb-3">
                  <span>0 &euro;</span><span>of {c.target} &euro;</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden mb-5">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800]" style={{ width: `${c.progress}%` }} />
                </div>
                <a href="#" className={`inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 ${c.btnColor}`}>
                  {c.btnText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
