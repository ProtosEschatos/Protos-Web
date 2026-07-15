'use client'

import { useState, useRef, useMemo, useEffect, useCallback, memo } from 'react'
import * as THREE from 'three'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { type ShowcaseProject } from './showcase/constants'
import { ShowcaseScene } from './showcase/GalleryScene'
import { buildShowcaseProjects } from './showcase/buildProjects'
import { ShowcaseFallback } from './showcase/ShowcaseFallback'
import { ShowcaseBootLoader } from './showcase/ShowcaseBootLoader'
import { ShowcaseJoystick } from './showcase/ShowcaseJoystick'
import { SafeCanvas } from '@/components/three/SafeCanvas'
import { isWebGLAvailable } from '@/lib/showcase/webgl'
import {
  FEATURED_WALL_DEMO,
  SHOWCASE_FOCUS_PARAM,
  SHOWCASE_POKLON_FOCUS,
} from '@/lib/showcase/featured-demo'
import { ShowcaseFullscreenDemo } from '@/components/showcase/ShowcaseFullscreenDemo'
import {
  INITIAL_TOUCH_INPUT,
  useShowcaseViewportState,
  useTouchControlsEnabled,
  type TouchInput,
} from '@/hooks/use-showcase-viewport'
import type { PortfolioItem } from '@/types/portfolio'

type Phase = 'loading' | 'intro' | 'playing'

type SpaceGalleryProps = {
  portfolioItems?: PortfolioItem[]
}

type ShowcaseCanvasLayerProps = {
  projects: ShowcaseProject[]
  isPlaying: boolean
  viewport: import('@/hooks/use-showcase-viewport').ShowcaseViewport
  layoutWidth: number
  keys: React.MutableRefObject<Record<string, boolean>>
  touchInput: React.MutableRefObject<TouchInput>
  characterRef: React.RefObject<THREE.Group | null>
  onNearestProject: (project: ShowcaseProject | null) => void
  onNearestGift: (near: boolean) => void
  mountKey: number
  onContextLost: () => void
}

const ShowcaseCanvasLayer = memo(function ShowcaseCanvasLayer({
  projects,
  isPlaying,
  viewport,
  layoutWidth,
  keys,
  touchInput,
  characterRef,
  onNearestProject,
  onNearestGift,
  mountKey,
  onContextLost,
}: ShowcaseCanvasLayerProps) {
  return (
    <div className="absolute inset-0 z-[1]">
      <SafeCanvas
        mountKey={mountKey}
        frameloop="always"
        camera={{ fov: 70, near: 0.1, far: 1000 }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        onContextLost={onContextLost}
        fallback={null}
      >
        <ShowcaseScene
          projects={projects}
          isPlaying={isPlaying}
          viewport={viewport}
          layoutWidth={layoutWidth}
          keys={keys}
          touchInput={touchInput}
          characterRef={characterRef}
          onNearestProject={onNearestProject}
          onNearestGift={onNearestGift}
        />
      </SafeCanvas>
    </div>
  )
})

export function SpaceGallery({ portfolioItems = [] }: SpaceGalleryProps) {
  const t = useTranslations('showcase')
  const tNav = useTranslations('nav')
  const searchParams = useSearchParams()
  const { viewport, width: layoutWidth } = useShowcaseViewportState()
  const touchControlsEnabled = useTouchControlsEnabled()
  const poklonFocus = searchParams.get(SHOWCASE_FOCUS_PARAM) === SHOWCASE_POKLON_FOCUS

  const projects = useMemo<ShowcaseProject[]>(
    () => buildShowcaseProjects(portfolioItems, viewport),
    [portfolioItems, viewport],
  )

  const [webglReady, setWebglReady] = useState<boolean | null>(null)
  const [contextLost, setContextLost] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [nearestProject, setNearestProject] = useState<ShowcaseProject | null>(null)
  const [nearestGift, setNearestGift] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false })

  const demoUrl = FEATURED_WALL_DEMO.demoUrl

  const keys = useRef<Record<string, boolean>>({})
  const touchInput = useRef<TouchInput>(INITIAL_TOUCH_INPUT)
  const characterRef = useRef<THREE.Group>(null)

  useEffect(() => {
    setWebglReady(isWebGLAvailable())
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!poklonFocus) return
    setProgress(100)
    setPhase('playing')
    setDemoOpen(true)
  }, [poklonFocus])

  useEffect(() => {
    if (poklonFocus) return
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 15
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase('intro'), 500)
          return 100
        }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [poklonFocus])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      setActiveKeys({
        w: !!(keys.current.KeyW || keys.current.ArrowUp),
        a: !!(keys.current.KeyA || keys.current.ArrowLeft),
        s: !!(keys.current.KeyS || keys.current.ArrowDown),
        d: !!(keys.current.KeyD || keys.current.ArrowRight),
      })
      if (e.code === 'Escape') setShowMenu((m) => !m)
      if (e.code === 'KeyE' && phase === 'playing') {
        if (nearestGift) {
          setDemoOpen(true)
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
  }, [nearestProject, nearestGift, phase])

  const handleNearestProject = useCallback((project: ShowcaseProject | null) => {
    setNearestProject(project)
  }, [])

  const handleNearestGift = useCallback((near: boolean) => {
    setNearestGift(near)
  }, [])

  const handleContextLost = useCallback(() => {
    setContextLost(true)
  }, [])

  const handleRetryWebGL = useCallback(() => {
    setContextLost(false)
    setCanvasKey((key) => key + 1)
    setPhase('intro')
    setProgress(100)
    setShowMenu(false)
  }, [])

  if (webglReady === null) {
    return <ShowcaseBootLoader />
  }

  if (webglReady === false) {
    return <ShowcaseFallback projects={projects} reason="unsupported" />
  }

  if (contextLost) {
    return <ShowcaseFallback projects={projects} reason="lost" onRetry={handleRetryWebGL} />
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a1a]">
      <ShowcaseCanvasLayer
        projects={projects}
        isPlaying={phase === 'playing'}
        viewport={viewport}
        layoutWidth={layoutWidth}
        keys={keys}
        touchInput={touchInput}
        characterRef={characterRef}
        onNearestProject={handleNearestProject}
        onNearestGift={handleNearestGift}
        mountKey={canvasKey}
        onContextLost={handleContextLost}
      />

      {phase === 'loading' && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0a0a1a]">
          <div className="loader-title mb-4 text-5xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">
            {t('loaderTitle')}
          </div>
          <div className="mb-8 text-sm uppercase tracking-[0.3em] text-[#94a3b8]">{t('loaderSubtitle')}</div>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#f59e0b] transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          {!touchControlsEnabled && (
            <p className="mt-8 text-sm text-[#94a3b8]">
              {t('loaderTipPrefix')} <span className="font-semibold text-[#6366f1]">WASD</span> {t('loaderTipOr')}{' '}
              <span className="font-semibold text-[#06b6d4]">{t('loaderTipArrows')}</span> {t('loaderTipSuffix')}
            </p>
          )}
        </div>
      )}

      {phase === 'intro' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-4">
          <div className="max-h-[min(90dvh,100%)] max-w-lg overflow-y-auto px-4 py-2 text-center sm:px-8">
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">
              {t('instructionsTitle')}
            </h1>
            <p className="mb-8 text-lg text-[#94a3b8]">{t('instructionsSubtitle')}</p>

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

          <div
            className={`fixed left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border px-5 py-5 text-center backdrop-blur-md transition-all duration-300 sm:px-8 sm:py-6 ${
              touchControlsEnabled
                ? 'bottom-[calc(env(safe-area-inset-bottom)+11rem)] md:bottom-[11rem]'
                : 'bottom-[calc(env(safe-area-inset-bottom)+2rem)] md:bottom-40'
            } ${
              nearestGift && phase === 'playing'
                ? 'translate-y-0 border-[#ff6600] bg-black/90 opacity-100'
                : nearestProject && phase === 'playing' && !nearestGift
                  ? 'translate-y-0 border-[#6366f1] bg-black/90 opacity-100'
                  : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            {nearestGift ? (
              <>
                <h3 className="mb-2 text-xl text-[#ff6600]">{t('poklonTitle')}</h3>
                <p className="mb-4 text-sm text-[#94a3b8]">{t('poklonDesc')}</p>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff6600] px-5 py-2 text-sm text-white hover:bg-[#06b6d4]"
                >
                  {t('poklonOpen')}
                </button>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-xl text-[#6366f1]">{nearestProject?.title}</h3>
                {nearestProject?.imageUrl && phase === 'playing' && (
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
              </>
            )}
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
            <button
              type="button"
              className="flex flex-col items-center gap-2"
              onClick={() => {
                if (nearestGift) setDemoOpen(true)
                else if (nearestProject) window.open(nearestProject.link, '_blank', 'noopener,noreferrer')
              }}
            >
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
        <header className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
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
          href="/portfolio"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white transition-all hover:border-[#6366f1] hover:bg-[#6366f1]"
        >
          ← {t('back')}
        </Link>
      </header>
      )}

      {showMenu && phase === 'playing' && (
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

      <ShowcaseFullscreenDemo
        open={demoOpen}
        url={demoUrl}
        title={t('poklonTitle')}
        closeLabel={t('poklonClose')}
        onClose={() => setDemoOpen(false)}
      />
    </div>
  )
}
