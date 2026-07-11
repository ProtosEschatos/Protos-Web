'use client'

import { useState, useLayoutEffect, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SiteConsentModal from '@/components/legal/SiteConsentModal'
import BootScreen from '@/components/ui/BootScreen'
import {
  BOOT_SESSION_KEY,
  BOOT_COMPLETE_EVENT,
  BOOT_VIDEO,
  BOOT_BG,
  clearBootPending,
  setBootPending,
  removeBootSsrVeil,
  isBootComplete,
} from '@/lib/boot-gate'

export { BOOT_SESSION_KEY, BOOT_COMPLETE_EVENT } from '@/lib/boot-gate'

function BootVideoBackground({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!active) return
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.loop = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const play = () => {
      void video.play().catch(() => {})
    }

    if (video.readyState >= 2) play()
    else video.addEventListener('canplay', play, { once: true })

    return () => {
      video.removeEventListener('canplay', play)
      video.pause()
    }
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: BOOT_BG }} aria-hidden>
      <video
        ref={videoRef}
        src={BOOT_VIDEO}
        className="absolute inset-0 h-full w-full object-cover object-center [transform:translateZ(0)_scale(1.02)]"
        preload="auto"
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020818]/30 pointer-events-none" />
    </div>
  )
}

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
            className="fixed inset-0 z-[99999] overflow-hidden touch-none overscroll-none [min-height:100dvh] [min-width:100dvw]"
            style={{ backgroundColor: BOOT_BG }}
            data-boot-layer
          >
            <BootVideoBackground active={loading} />

            <div
              className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
              aria-hidden
            >
              <motion.div
                className="absolute h-[min(70vh,520px)] w-[min(92vw,440px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.45)_0%,rgba(125,211,252,0.22)_42%,transparent_72%)] blur-3xl"
                animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute h-[min(55vh,380px)] w-[min(78vw,360px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(224,242,254,0.35)_0%,rgba(147,197,253,0.15)_50%,transparent_75%)] blur-2xl"
                animate={{ scale: [1.04, 0.96, 1.04], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,rgba(2,8,24,0.25)_0%,rgba(2,8,24,0.75)_68%)]"
              aria-hidden
            />

            <div className="relative z-[3] h-full w-full">
              <BootScreen embedded onEnter={handleEnter} onEnterReady={() => setReadyToEnter(true)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteConsentModal open={loading && showConsentModal} onAccepted={finishBoot} />
    </>
  )
}
