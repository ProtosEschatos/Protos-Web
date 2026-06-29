'use client'

import { motion } from 'framer-motion'

const posts = [
  { title: 'Email Marketing — Why Your Subscriber List is Worth More Than Instagram Followers', date: 'June 15, 2026', excerpt: '1,000 email subscribers are worth more than 10,000 Instagram followers. Email is direct, algorithm-free.' },
  { title: 'Web Analytics — How Do You Know Who Visits Your Site?', date: 'June 15, 2026', excerpt: 'Web analytics shows who visits your site, where they come from, and what they do.' },
  { title: 'What is a Landing Page and When to Use It for Maximum Impact?', date: 'June 17, 2026', excerpt: 'A landing page is a page with one goal — turning visitors into customers.' },
  { title: "SEO — Why Isn't Your Site on Google's First Page?", date: 'June 17, 2026', excerpt: 'SEO is the process of optimizing your website to rank higher in Google results.' },
  { title: 'How Much Does a Website Cost? Real Price Ranges for 2024', date: 'June 18, 2026', excerpt: "Website costs range from 300 to 10,000+. The difference isn't random." },
  { title: "SSL Certificate — What the Browser Lock Means and Why It's Mandatory", date: 'June 18, 2026', excerpt: 'An SSL certificate is a digital security confirmation for your website.' },
  { title: 'Responsive Design — Why Mobile Must Be Your Priority', date: 'June 15, 2026', excerpt: '70%+ of web traffic comes from mobile devices. A site that looks bad on mobile loses most customers.' },
  { title: 'Online Payments — How to Accept Payments Through Your Website', date: 'June 13, 2026', excerpt: 'Payment processing lets you accept card or PayPal payments directly through your website.' },
  { title: 'Social Media vs Website — Why You Need Both', date: 'June 14, 2026', excerpt: 'An Instagram profile is not a substitute for a website. Algorithms change, profiles get deleted.' },
  { title: 'Booking Form — How to Automate Reservations and Save Time', date: 'June 14, 2026', excerpt: 'A booking form lets clients reserve appointments 24/7 without a phone call.' },
  { title: 'What is a CMS and Do I Need One for My Website?', date: 'June 13, 2026', excerpt: 'A CMS lets you edit website content yourself without technical knowledge.' },
  { title: 'Contact Form vs Email — Why a Form Protects Your Business', date: 'June 13, 2026', excerpt: 'Posting your email address directly on your website invites spam bots.' },
  { title: 'Website vs Web Application — Which Does Your Business Need?', date: 'June 15, 2026', excerpt: 'A website displays information. A web app lets users do things.' },
  { title: 'Web Hosting — Where Your Website Lives and Why It Matters', date: 'June 13, 2026', excerpt: 'Hosting is like renting space for your website. Bad hosting means a slow or unavailable site.' },
  { title: 'What is a Website and Does Your Business Even Need One?', date: 'June 15, 2026', excerpt: 'Many business owners wonder if they need a website. Short answer: yes.' },
  { title: 'What is a Domain and Why Does Every Business Need One?', date: 'June 17, 2026', excerpt: "A domain is your business's address on the Internet." },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
}

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,102,0,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate]" style={{ backgroundImage: `radial-gradient(1px 1px at 10% 20%,rgba(255,255,255,0.4),transparent),radial-gradient(1px 1px at 50% 10%,rgba(255,255,255,0.5),transparent),radial-gradient(1px 1px at 90% 80%,rgba(255,255,255,0.4),transparent)` }} />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--primary)] mb-3">BLOG</p>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-tight mb-5">Web Academy</h1>
          <p className="text-base text-[var(--light-muted)] max-w-[600px] mx-auto leading-7">
            Free guides on web presence for entrepreneurs
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp}
                className="bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-7 flex flex-col hover:border-[var(--primary)]/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mb-3">
                  <i className="fas fa-calendar" /> {p.date}
                </div>
                <h3 className="text-base font-bold text-[var(--light)] mb-2.5 leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="text-sm text-[var(--light-muted)] leading-relaxed flex-1">{p.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
