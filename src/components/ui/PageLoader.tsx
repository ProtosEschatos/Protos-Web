'use client'

import { useState, useLayoutEffect, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SiteConsentModal from '@/components/legal/SiteConsentModal'
import BootScreen from '@/components/ui/BootScreen'
import {
  BOOT_SESSION_KEY,
  BOOT_COMPLETE_EVENT,
  clearBootPending,
  setBootPending,
  removeBootSsrVeil,
  isBootComplete,
} from '@/lib/boot-gate'

export { BOOT_SESSION_KEY, BOOT_COMPLETE_EVENT } from '@/lib/boot-gate'

export default function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [readyToEnter, setReadyToEnter] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)

  useLayoutEffect(() => {
    if (isBootComplete()) {
      setLoading(false)
    } else {
      removeBootSsrVeil()
    }
  }, [])

  useEffect(() => {
    if (loading) setBootPending()
    else clearBootPending()
  }, [loading])

  const finishBoot = useCallback(() => {
    sessionStorage.setItem(BOOT_SESSION_KEY, '1')
    clearBootPending()
    window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT))
    setShowConsentModal(false)
    setLoading(false)
  }, [])

  const handleEnter = useCallback(() => {
    if (!readyToEnter) return
    setShowConsentModal(true)
  }, [readyToEnter])

  useEffect(() => {
    if (!loading || !readyToEnter || showConsentModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleEnter()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loading, readyToEnter, showConsentModal, handleEnter])

  return (
    <>
      <AnimatePresence>
        {loading && !showConsentModal && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            data-boot-layer
          >
            <BootScreen onEnter={handleEnter} onEnterReady={() => setReadyToEnter(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <SiteConsentModal open={loading && showConsentModal} onAccepted={finishBoot} />
    </>
  )
}
