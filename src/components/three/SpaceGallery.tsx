'use client'

import { useState, useRef, useMemo, useEffect, useCallback, memo } from 'react'
import * as THREE from 'three'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { type ShowcaseProject } from './showcase/constants'
import { ShowcaseScene } from './showcase/GalleryScene'
import { buildShowcaseProjects } from './showcase/buildProjects'
import { ShowcaseFallback } from './showcase/ShowcaseFallback'
import { ShowcaseJoystick } from './showcase/ShowcaseJoystick'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import { isWebGLAvailable } from '@/lib/showcase/webgl'
import {
  FEATURED_WALL_DEMO,
} from '@/lib/showcase/featured-demo'
import { ShowcaseFullscreenDemo } from '@/components/showcase/ShowcaseFullscreenDemo'
import {
  INITIAL_TOUCH_INPUT,
  useShowcaseViewport,
  useTouchControlsEnabled,
  type TouchInput,
} from '@/hooks/use-showcase-viewport'
import { SHOWCASE_CONFIG } from './showcase/constants'
import type { PortfolioItem } from '@/types/portfolio'

type Phase = 'intro' | 'playing'

type SpaceGalleryProps = {
  portfolioItems?: PortfolioItem[]
  focusPoklon?: boolean
}

type ShowcaseCanvasLayerProps = {
  projects: ShowcaseProject[]
  isPlaying: boolean
  viewport: import('@/hooks/use-showcase-viewport').ShowcaseViewport
  keys: React.MutableRefObject<Record<string, boolean>>
  touchInput: React.MutableRefObject<TouchInput>
  characterRef: React.RefObject<THREE.Group | null>
  featuredDemoTitle: string
  featuredDemoBadge: string
  onNearestProject: (project: ShowcaseProject | null) => void
  onNearFeaturedDemo: (near: boolean) => void
  mountKey: number
  onContextLost: () => void
}

const ShowcaseCanvasLayer = memo(function ShowcaseCanvasLayer({
  projects,
  isPlaying,
  viewport,
  keys,
  touchInput,
  characterRef,
  featuredDemoTitle,
  featuredDemoBadge,
  onNearestProject,
  onNearFeaturedDemo,
  mountKey,
  onContextLost,
}: ShowcaseCanvasLayerProps) {
  return (
    <div className="absolute inset-0 z-[1]">
      <SafeCanvas
        mountKey={mountKey}
        camera={{ fov: 70, near: 0.1, far: 1000 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        onContextLost={onContextLost}
        fallback={null}
      >
        <ShowcaseScene
          projects={projects}
          isPlaying={isPlaying}
          viewport={viewport}
          keys={keys}
          touchInput={touchInput}
          characterRef={characterRef}
          featuredDemoTitle={featuredDemoTitle}
          featuredDemoBadge={featuredDemoBadge}
          onNearestProject={onNearestProject}
          onNearFeaturedDemo={onNearFeaturedDemo}
        />
      </SafeCanvas>
    </div>
  )
})

export function SpaceGallery({ portfolioItems = [], focusPoklon = false }: SpaceGalleryProps) {
  const t = useTranslations('showcase')
  const tNav = useTranslations('nav')
  const viewport = useShowcaseViewport()
  const touchControlsEnabled = useTouchControlsEnabled()

  const projects = useMemo<ShowcaseProject[]>(
    () => buildShowcaseProjects(t, portfolioItems, viewport),
    [t, portfolioItems, viewport],
  )

  const [webglReady] = useState(() => isWebGLAvailable())
  const [contextLost, setContextLost] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('intro')
  const [showMenu, setShowMenu] = useState(false)
  const [nearestProject, setNearestProject] = useState<ShowcaseProject | null>(null)
  const [nearFeaturedDemo, setNearFeaturedDemo] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [showGiftHint, setShowGiftHint] = useState(focusPoklon)
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false })

  const keys = useRef<Record<string, boolean>>({})
  const touchInput = useRef<TouchInput>(INITIAL_TOUCH_INPUT)
  const characterRef = useRef<THREE.Group>(null)

  const openFeaturedDemo = useCallback(() => {
    setDemoOpen(true)
    setShowGiftHint(false)
  }, [])

  const closeFeaturedDemo = useCallback(() => {
    setDemoOpen(false)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (phase !== 'playing' || !focusPoklon || !characterRef.current) return

    const character = characterRef.current
    const { galleryLength } = SHOWCASE_CONFIG
    character.position.set(0, 0, -galleryLength / 2 + 7)
    character.rotation.set(0, 0, 0, 'YXZ')
    setShowGiftHint(true)
  }, [phase, focusPoklon])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (demoOpen) return

      keys.current[e.code] = true
      setActiveKeys({
        w: !!(keys.current.KeyW || keys.current.ArrowUp),
        a: !!(keys.current.KeyA || keys.current.ArrowLeft),
        s: !!(keys.current.KeyS || keys.current.ArrowDown),
        d: !!(keys.current.KeyD || keys.current.ArrowRight),
      })
      if (e.code === 'Escape') setShowMenu((m) => !m)
      if (e.code === 'KeyE' && phase === 'playing') {
        if (nearFeaturedDemo) {
          openFeaturedDemo()
        } else if (nearestProject) {
          window.open(nearestProject.link, '_blank', 'noopener,noreferrer')
        }
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
      setActiveKeys({
        w: !!(keys.current.KeyW || keys.current.ArrowUp),
        a: !!(keys.current.KeyA || keys.current.ArrowLeft),
        s: !!(keys.current.KeyS || keys.current.ArrowDown),
        d: !!(keys.current.KeyD || keys.current.ArrowRight),
      })
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [nearestProject, nearFeaturedDemo, phase, demoOpen, openFeaturedDemo])

  const handleNearestProject = useCallback((project: ShowcaseProject | null) => {
    setNearestProject(project)
  }, [])

  const handleNearFeaturedDemo = useCallback((near: boolean) => {
    setNearFeaturedDemo(near)
    if (near) setShowGiftHint(false)
  }, [])

  const handleContextLost = useCallback(() => {
    setContextLost(true)
  }, [])

  const handleRetryWebGL = useCallback(() => {
    setContextLost(false)
    setCanvasKey((key) => key + 1)
    setPhase('intro')
    setShowMenu(false)
  }, [])

  const handleInteract = useCallback(() => {
    if (nearFeaturedDemo) {
      openFeaturedDemo()
      return
    }
    if (nearestProject) {
      window.open(nearestProject.link, '_blank', 'noopener,noreferrer')
    }
  }, [nearFeaturedDemo, nearestProject, openFeaturedDemo])

  if (!webglReady) {
    return <ShowcaseFallback projects={projects} reason="unsupported" />
  }

  if (contextLost) {
    return <ShowcaseFallback projects={projects} reason="lost" onRetry={handleRetryWebGL} />
  }

  const showFeaturedPanel = nearFeaturedDemo && phase === 'playing' && !demoOpen
  const showProjectPanel = nearestProject && phase === 'playing' && !demoOpen && !nearFeaturedDemo

  return (
    <div className="fixed inset-0 bg-[#0a0a1a]">
      <ShowcaseCanvasLayer
        projects={projects}
        isPlaying={phase === 'playing'}
        viewport={viewport}
        keys={keys}
        touchInput={touchInput}
        characterRef={characterRef}
        featuredDemoTitle={t('wallDemoTitle')}
        featuredDemoBadge={t('wallDemoBadge')}
        onNearestProject={handleNearestProject}
        onNearFeaturedDemo={handleNearFeaturedDemo}
        mountKey={canvasKey}
        onContextLost={handleContextLost}
      />

      <ShowcaseFullscreenDemo
        open={demoOpen}
        url={FEATURED_WALL_DEMO.demoUrl}
        title={t('wallDemoTitle')}
        closeLabel={t('wallDemoClose')}
        onClose={closeFeaturedDemo}
      />

      {phase === 'intro' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90">
          <div className="max-w-lg px-8 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">
              {t('instructionsTitle')}
            </h1>
            <p className="mb-8 text-lg text-[#94a3b8]">{t('instructionsSubtitle')}</p>
            {focusPoklon && (
              <p className="mb-6 rounded-2xl border border-[#6366f1]/40 bg-[#6366f1]/10 px-5 py-4 text-sm leading-relaxed text-[#c4b5fd]">
                {t('giftIntroHint')}
              </p>
            )}

            <div className="mb-8 flex flex-col gap-6">
              {!touchControlsEnabled && (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex gap-2">
                    {['W', 'A', 'S', 'D'].map((key) => (
                      <div
                        key={key}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#6366f1] bg-white/10 text-sm font-semibold"
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                  <span className="text-[#94a3b8]">{t('moveHint')}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#6366f1] bg-white/10 text-sm font-semibold">
                  E
                </div>
                <span className="text-[#94a3b8]">{t('interactHint')}</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#6366f1] bg-white/10 text-sm font-semibold">
                  ESC
                </div>
                <span className="text-[#94a3b8]">{t('menuHint')}</span>
              </div>
              {touchControlsEnabled && (
                <p className="text-sm text-[#6366f1] md:hidden">{t('touchMoveHint')}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPhase('playing')}
              className="rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] px-12 py-4 text-xl font-semibold text-white transition-transform hover:scale-105 hover:shadow-[0_10px_40px_rgba(99,102,241,0.4)]"
            >
              ▶ {t('start')}
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="pointer-events-none fixed left-1/2 top-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-white/50 after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:bg-white/50 md:block" />

          {touchControlsEnabled && <ShowcaseJoystick touchInput={touchInput} />}

          {showGiftHint && (
            <div className="fixed left-1/2 top-24 z-30 max-w-md -translate-x-1/2 rounded-2xl border border-[#a78bfa]/40 bg-black/85 px-6 py-4 text-center text-sm text-[#ddd6fe] backdrop-blur-md">
              {t('giftWalkHint')}
            </div>
          )}

          <div
            className={`fixed bottom-32 left-1/2 z-20 max-w-md -translate-x-1/2 rounded-2xl border border-[#a78bfa] bg-black/90 px-8 py-6 text-center backdrop-blur-md transition-all duration-300 ${
              showFeaturedPanel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c4b5fd]">{t('wallDemoBadge')}</p>
            <h3 className="mb-2 text-xl text-[#e0f2fe]">{t('wallDemoTitle')}</h3>
            <p className="mb-4 text-sm text-[#94a3b8]">{t('wallDemoDescription')}</p>
            <button
              type="button"
              onClick={openFeaturedDemo}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {t('wallDemoOpen')}
            </button>
          </div>

          <div
            className={`fixed bottom-32 left-1/2 z-20 max-w-md -translate-x-1/2 rounded-2xl border border-[#6366f1] bg-black/90 px-8 py-6 text-center backdrop-blur-md transition-all duration-300 ${
              showProjectPanel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <h3 className="mb-2 text-xl text-[#6366f1]">{nearestProject?.title}</h3>
            {nearestProject?.imageUrl && (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/10 bg-[#0f172a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nearestProject.imageUrl}
                  alt={nearestProject.title}
                  loading="lazy"
                  className="mx-auto h-36 w-auto max-w-full object-contain object-top"
                />
              </div>
            )}
            <p className="mb-4 text-sm text-[#94a3b8]">{nearestProject?.description}</p>
            <a
              href={nearestProject?.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-2 text-sm text-white hover:bg-[#06b6d4]"
            >
              {t('viewProject')}
            </a>
          </div>

          <div className="fixed bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-8 rounded-2xl border border-white/10 bg-black/80 px-8 py-4 backdrop-blur-md md:flex">
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs ${activeKeys.w ? 'border-[#6366f1] bg-[#6366f1]' : 'border-white/20 bg-white/10'}`}>
                  ↑
                </div>
                <div className="flex gap-1">
                  {[
                    { key: 'a', label: '←' },
                    { key: 's', label: '↓' },
                    { key: 'd', label: '→' },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs ${
                        activeKeys[key as keyof typeof activeKeys] ? 'border-[#6366f1] bg-[#6366f1]' : 'border-white/20 bg-white/10'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[0.65rem] uppercase tracking-wider text-[#94a3b8]">{t('move')}</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <button type="button" className="flex flex-col items-center gap-2" onClick={handleInteract}>
              <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold">{t('details')}</div>
              <span className="text-[0.65rem] uppercase tracking-wider text-[#94a3b8]">E</span>
            </button>
            <div className="h-10 w-px bg-white/20" />
            <button type="button" className="flex flex-col items-center gap-2" onClick={() => setShowMenu((m) => !m)}>
              <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">{t('menuLabel')}: Esc</div>
            </button>
          </div>

        </>
      )}

      {(phase === 'intro' || phase === 'playing') && (
        <header className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-lg font-bold">
            P
          </div>
          <span className="font-semibold">Protos Web</span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 text-2xl font-bold tracking-widest md:block">
          <span className="bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">{t('space')}</span>{' '}
          <span className="text-white">{t('station')}</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white transition-all hover:border-[#6366f1] hover:bg-[#6366f1]"
        >
          ← {t('back')}
        </Link>
      </header>
      )}

      {showMenu && phase === 'playing' && !demoOpen && (
        <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/95">
          <button type="button" onClick={() => setShowMenu(false)} className="absolute right-8 top-8 text-3xl text-white hover:text-[#6366f1]">
            ×
          </button>
          <h2 className="mb-12 text-4xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">{t('menuLabel')}</h2>
          <nav className="flex flex-col gap-6 text-center text-2xl">
            <Link href="/" className="text-[#94a3b8] hover:text-[#6366f1]">
              {tNav('home')}
            </Link>
            <Link href="/usluge" className="text-[#94a3b8] hover:text-[#6366f1]">
              {tNav('services')}
            </Link>
            <Link href="/portfolio" className="text-[#94a3b8] hover:text-[#6366f1]">
              {tNav('portfolio')}
            </Link>
            <Link href="/kontakt" className="text-[#94a3b8] hover:text-[#6366f1]">
              {tNav('contact')}
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
