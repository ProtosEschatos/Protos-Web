'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SESSION_KEY = 'protos-page-loaded'

export default function PageLoader() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            sessionStorage.setItem(SESSION_KEY, '1')
            setLoading(false)
          }, 400)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[var(--dark)] flex flex-col items-center justify-center"
        >
          <div className="relative w-24 h-24 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[var(--primary)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-[var(--secondary)] border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <h2 className="text-2xl font-bold gradient-text mb-2">Protos Web</h2>
          <p className="text-sm text-[var(--light-muted)] tracking-[0.2em] uppercase mb-6">Loading experience</p>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
