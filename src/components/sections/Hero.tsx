'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const HeroCanvas = dynamic(() => import('../three/HeroCanvas'), { ssr: false })

const stats = [
  { value: '50', suffix: '+', label: 'Projects delivered', orange: true },
  { value: '98', suffix: '%', label: 'Client satisfaction', orange: true },
  { value: '5', suffix: ' jezika', label: 'Multilingual support', orange: false },
  { value: '3D & WebGL', suffix: '', label: 'Interactive experiences', orange: false },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' },
  }),
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,102,0,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,rgba(6,182,212,0.04)_0%,transparent_50%)]" />

      {/* Stars */}
      <div
        className="absolute inset-0 animate-[twinkle_8s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1.5px 1.5px at 15% 85%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.35), transparent),
            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 60% 75%, rgba(255,255,255,0.3), transparent)
          `
        }}
      />

      {/* 3D Canvas (background) */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-[1200px]">
        <div className="max-w-[700px]">
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-[var(--light-muted)] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-px before:bg-[var(--primary)]"
          >
            FAST. FOR YOUR BUSINESS
          </motion.p>

          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[1.05] mb-6"
          >
            We Turn<br />visitors into<br />
            <span className="gradient-text">customers.</span>
          </motion.h1>

          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-base text-[var(--light-muted)] mb-9 leading-7 max-w-[520px]"
          >
            Fast, lightweight, and robust websites that work for you. All in one place.
          </motion.p>

          <motion.div
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex gap-4 flex-wrap mb-16"
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-xs font-semibold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_var(--primary-glow)] transition-all duration-300"
            >
              Start build <i className="fas fa-arrow-right text-[0.75rem]" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--border-card)] text-[var(--light)] text-xs font-semibold uppercase tracking-wider hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
            >
              View Portfolio <i className="fas fa-arrow-right text-[0.75rem]" />
            </Link>
          </motion.div>

          <motion.div
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="flex gap-10 flex-wrap"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-[var(--light)] mb-1">
                  {s.orange ? <span className="text-[var(--primary)]">{s.value}</span> : s.value}
                  {s.suffix && <span className={s.orange ? '' : 'text-sm text-[var(--light-muted)] ml-1'}>{s.suffix}</span>}
                </div>
                <div className="text-[0.75rem] text-[var(--light-muted)] tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
