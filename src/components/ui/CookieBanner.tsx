'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('protos-cookies')
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('protos-cookies', 'accepted')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-[200] bg-[var(--dark-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-2xl"
        >
          <p className="text-sm text-[var(--light-muted)] mb-4 leading-relaxed">
            We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold hover:-translate-y-0.5 transition-all duration-300"
            >
              Accept
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-6 py-2.5 rounded-full border border-[var(--border-card)] text-sm text-[var(--light-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
