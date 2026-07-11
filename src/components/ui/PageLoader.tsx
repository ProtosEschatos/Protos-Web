'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import SiteConsentModal from '@/components/legal/SiteConsentModal'
import BootOrbitLogo from '@/components/ui/BootOrbitLogo'
import {
  BOOT_SESSION_KEY,
  BOOT_COMPLETE_EVENT,
  BOOT_VIDEO,
  BOOT_BG,
  BOOT_MIN_MS,
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
  const t = useTranslations('loader')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
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

  useEffect(() => {
    if (!loading) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const next = Math.min(100, (elapsed / BOOT_MIN_MS) * 100)
      setProgress(next)
      if (elapsed >= BOOT_MIN_MS) {
        setReadyToEnter(true)
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
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
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: BOOT_BG }}
            data-boot-layer
          >
            <BootVideoBackground active={loading} />

            <div
              className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center overflow-hidden"
              aria-hidden
            >
              <div className="absolute h-[540px] w-[min(94vw,460px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(2,8,24,0.82)_0%,rgba(2,8,24,0.45)_48%,transparent_76%)]" />
              <motion.div
                className="absolute h-[520px] w-[min(92vw,440px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.55)_0%,rgba(125,211,252,0.28)_42%,transparent_72%)] blur-3xl"
                animate={{ scale: [1, 1.06, 1], opacity: [0.72, 0.92, 0.72] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute h-[380px] w-[min(78vw,360px)] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(224,242,254,0.4)_0%,rgba(147,197,253,0.18)_50%,transparent_75%)] blur-2xl"
                animate={{ scale: [1.04, 0.96, 1.04], opacity: [0.45, 0.65, 0.45] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(2,8,24,0.35)_0%,rgba(2,8,24,0.92)_68%)]"
              aria-hidden
            />

            <div className="relative z-10 flex flex-col items-center justify-center px-10 py-12 min-w-[min(92vw,320px)]">
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-sky-200/25 bg-[#020818]/82 backdrop-blur-md shadow-[0_0_48px_rgba(125,211,252,0.35),0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-3 -z-10 rounded-[1.35rem] bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.28)_0%,transparent_68%)]"
                aria-hidden
              />
              <div className="relative mb-8 flex items-center justify-center">
                <BootOrbitLogo size={112} />
              </div>

              <h2
                className="text-2xl font-extrabold gradient-text mb-2 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
                style={{ filter: 'drop-shadow(0 0 18px rgba(125,211,252,0.45))' }}
              >
                Protos Web
              </h2>
              <p className="text-sm font-semibold text-sky-50 tracking-[0.2em] uppercase mb-6 drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]">
                {t('subtitle')}
              </p>

              <div className="w-52 h-1.5 bg-black/45 border border-white/15 rounded-full overflow-hidden mb-6 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              </div>

              <AnimatePresence>
                {readyToEnter && !showConsentModal && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={handleEnter}
                    className="px-10 py-3 rounded-full border border-sky-200/50 bg-[#020818]/85 backdrop-blur-sm text-white text-sm font-bold tracking-[0.25em] uppercase hover:bg-sky-950/90 hover:border-sky-100/60 transition-all duration-300 shadow-[0_0_28px_rgba(125,211,252,0.45),0_4px_20px_rgba(0,0,0,0.55)]"
                  >
                    {t('enter')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteConsentModal open={loading && showConsentModal} onAccepted={finishBoot} />
    </>
  )
}
