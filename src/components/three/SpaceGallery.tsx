'use client'

import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useTranslations } from 'next-intl'
import { Link } from '@/routing'
import { PROJECT_LINKS, SHOWCASE_CONFIG, getFrameMarkers, type ShowcaseProject } from './showcase/constants'
import { ShowcaseScene } from './showcase/GalleryScene'
import type { PortfolioItem } from '@/actions/portfolio'
import { getProjectScreenshotUrl, normalizeProjectUrl } from '@/lib/showcase-screenshots'

type Phase = 'loading' | 'intro' | 'playing'

type SpaceGalleryProps = {
  portfolioItems?: PortfolioItem[]
}

function buildShowcaseProjects(
  t: (key: string) => string,
  portfolioItems: PortfolioItem[],
): ShowcaseProject[] {
  return PROJECT_LINKS.map((meta, index) => {
    const dbItem = portfolioItems.find(
      (item) => item.project_url && normalizeProjectUrl(item.project_url) === normalizeProjectUrl(meta.link),
    )

    return {
      color: meta.color,
      link: meta.link,
      title: dbItem?.title ?? t(`project${index + 1}_title`),
      description: dbItem?.description ?? t(`project${index + 1}_desc`),
      imageUrl: dbItem?.image_url ?? getProjectScreenshotUrl(meta.link),
    }
  })
}

function drawMinimap(
  canvas: HTMLCanvasElement | null,
  charX: number,
  charZ: number,
  rotationY: number,
  markers: ReturnType<typeof getFrameMarkers>,
) {
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  const { galleryLength, galleryWidth } = SHOWCASE_CONFIG
  const scaleX = 150 / galleryWidth
  const scaleZ = 100 / galleryLength

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 0, 150, 100)

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(5, 5, 140, 90)

  markers.forEach((marker) => {
    const x = (marker.x + galleryWidth / 2) * scaleX
    const z = (marker.z + galleryLength / 2) * scaleZ
    ctx.fillStyle = `#${marker.color.toString(16).padStart(6, '0')}`
    ctx.beginPath()
    ctx.arc(x, z, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  const px = (charX + galleryWidth / 2) * scaleX
  const pz = (charZ + galleryLength / 2) * scaleZ

  ctx.fillStyle = '#6366f1'
  ctx.beginPath()
  ctx.arc(px, pz, 6, 0, Math.PI * 2)
  ctx.fill()

  const dirX = Math.sin(rotationY)
  const dirZ = Math.cos(rotationY)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(px, pz)
  ctx.lineTo(px + dirX * 10, pz - dirZ * 10)
  ctx.stroke()
}

export function SpaceGallery({ portfolioItems = [] }: SpaceGalleryProps) {
  const t = useTranslations('showcase')
  const tNav = useTranslations('nav')

  const projects = useMemo<ShowcaseProject[]>(
    () => buildShowcaseProjects(t, portfolioItems),
    [t, portfolioItems],
  )

  const frameMarkers = useMemo(() => getFrameMarkers(), [])
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [nearestProject, setNearestProject] = useState<ShowcaseProject | null>(null)
  const [activeKeys, setActiveKeys] = useState({ w: false, a: false, s: false, d: false })

  const keys = useRef<Record<string, boolean>>({})
  const characterRef = useRef<THREE.Group>(null)
  const minimapRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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
  }, [])

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
      if (e.code === 'KeyE' && nearestProject && phase === 'playing') {
        window.open(nearestProject.link, '_blank', 'noopener,noreferrer')
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
  }, [nearestProject, phase])

  const handleCharacterMove = useCallback(
    (pos: THREE.Vector3, rotationY: number) => {
      drawMinimap(minimapRef.current, pos.x, pos.z, rotationY, frameMarkers)
    },
    [frameMarkers],
  )

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute inset-0 z-[1]">
        <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }} gl={{ antialias: true }}>
          <ShowcaseScene
            projects={projects}
            isPlaying={phase === 'playing'}
            keys={keys}
            characterRef={characterRef}
            onCharacterMove={handleCharacterMove}
            onNearestProject={setNearestProject}
          />
        </Canvas>
      </div>

      {phase === 'loading' && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0a0a1a] transition-opacity duration-700">
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
          <p className="mt-8 text-sm text-[#94a3b8]">
            {t('loaderTipPrefix')} <span className="font-semibold text-[#6366f1]">WASD</span> {t('loaderTipOr')}{' '}
            <span className="font-semibold text-[#06b6d4]">{t('loaderTipArrows')}</span> {t('loaderTipSuffix')}
          </p>
        </div>
      )}

      {phase === 'intro' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90">
          <div className="max-w-lg px-8 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-br from-[#6366f1] to-[#06b6d4] bg-clip-text text-transparent">
              {t('instructionsTitle')}
            </h1>
            <p className="mb-8 text-lg text-[#94a3b8]">{t('instructionsSubtitle')}</p>

            <div className="mb-8 flex flex-col gap-6">
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

      {phase !== 'loading' && (
        <>
          <div className="pointer-events-none fixed left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-white/50 after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:bg-white/50" />

          <div
            className={`fixed bottom-32 left-1/2 z-20 max-w-md -translate-x-1/2 rounded-2xl border border-[#6366f1] bg-black/90 px-8 py-6 text-center backdrop-blur-md transition-all duration-300 ${
              nearestProject && phase === 'playing' ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <h3 className="mb-2 text-xl text-[#6366f1]">{nearestProject?.title}</h3>
            {nearestProject?.imageUrl && phase === 'playing' && (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nearestProject.imageUrl} alt={nearestProject.title} className="h-28 w-full object-cover object-top" />
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

          <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-8 rounded-2xl border border-white/10 bg-black/80 px-8 py-4 backdrop-blur-md">
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
              onClick={() => nearestProject && window.open(nearestProject.link, '_blank', 'noopener,noreferrer')}
            >
              <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold">{t('details')}</div>
              <span className="text-[0.65rem] uppercase tracking-wider text-[#94a3b8]">E</span>
            </button>
            <div className="h-10 w-px bg-white/20" />
            <button type="button" className="flex flex-col items-center gap-2" onClick={() => setShowMenu((m) => !m)}>
              <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">{t('menuLabel')}: Esc</div>
            </button>
          </div>

          <div className="fixed bottom-8 right-8 z-20 h-[100px] w-[150px] overflow-hidden rounded-lg border border-white/20 bg-black/80">
            <canvas ref={minimapRef} width={150} height={100} className="h-full w-full" />
          </div>
        </>
      )}

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
          href="/portfolio"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm text-white transition-all hover:border-[#6366f1] hover:bg-[#6366f1]"
        >
          ← {t('back')}
        </Link>
      </header>

      {showMenu && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95">
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
