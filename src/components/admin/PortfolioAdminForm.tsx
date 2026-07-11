'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreatePortfolioItem, adminDeletePortfolioItem, adminUpdatePortfolioItem } from '@/actions/admin-portfolio'
import AdminAiPanel from '@/components/admin/AdminAiPanel'
import type { AdminPortfolioItem, PortfolioFormInput } from '@/types/admin-portfolio'

const LANGUAGES = ['hr', 'en', 'de', 'it', 'es'] as const

type Props = {
  item?: AdminPortfolioItem
}

export default function PortfolioAdminForm({ item }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(item?.title ?? '')
  const [tag, setTag] = useState(item?.tag ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '')
  const [projectUrl, setProjectUrl] = useState(item?.project_url ?? '')
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0)
  const [language, setLanguage] = useState(item?.language ?? 'hr')
  const [featured, setFeatured] = useState(item?.featured ?? false)
  const [active, setActive] = useState(item?.active ?? true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAi, setShowAi] = useState(false)

  const buildInput = (): PortfolioFormInput => ({
    title,
    tag,
    description,
    image_url: imageUrl,
    project_url: projectUrl,
    sort_order: sortOrder,
    language,
    featured,
    active,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = item
        ? await adminUpdatePortfolioItem(item.id, buildInput())
        : await adminCreatePortfolioItem(buildInput())
      if (!result.success) {
        setError(result.error ?? 'Spremanje nije uspjelo.')
        return
      }
      router.push('/admin/portfolio')
      router.refresh()
    } catch {
      setError('Greška pri spremanju.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item || !confirm('Obrisati ovaj projekt?')) return
    setLoading(true)
    const result = await adminDeletePortfolioItem(item.id)
    if (!result.success) {
      setError(result.error ?? 'Brisanje nije uspjelo.')
      setLoading(false)
      return
    }
    router.push('/admin/portfolio')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setShowAi((v) => !v)}
        className="px-4 py-2 rounded-full border border-cyan-400/30 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10"
      >
        {showAi ? 'Sakrij AI' : 'AI pomoć'}
      </button>

      {showAi ? (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
          <AdminAiPanel onInsert={(text) => setDescription(text)} />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--light-muted)] mb-2">Naziv projekta</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--light-muted)] mb-2">Tag / kategorija</label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--light-muted)] mb-2">Jezik</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--light-muted)] mb-2">Opis</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--light-muted)] mb-2">URL slike</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--light-muted)] mb-2">URL projekta</label>
              <input
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--light-muted)] mb-2">Redoslijed</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
              />
            </div>
            <div className="flex flex-col gap-3 justify-end">
              <label className="flex items-center gap-2 text-sm text-[var(--light)]">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                Istaknuto
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--light)]">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                Aktivno na stranici
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Spremanje…' : item ? 'Spremi promjene' : 'Dodaj projekt'}
            </button>
            {item ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2.5 rounded-full border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 disabled:opacity-50"
              >
                Obriši
              </button>
            ) : null}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6 h-fit sticky top-24">
          <p className="text-xs uppercase tracking-wider text-[var(--primary)] mb-3">Live preview</p>
          <div className="cosmic-panel rounded-2xl overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="w-full aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video bg-white/5 flex items-center justify-center text-xs text-[var(--light-muted)]">
                Slika projekta
              </div>
            )}
            <div className="p-5">
              {tag ? (
                <span className="text-[0.65rem] uppercase tracking-wider text-[var(--primary)]">{tag}</span>
              ) : null}
              <h3 className="text-lg font-bold text-[var(--light)] mt-1">{title || 'Naziv projekta'}</h3>
              <p className="text-sm text-[var(--light-muted)] mt-2 leading-relaxed">
                {description || 'Opis projekta…'}
              </p>
              {projectUrl ? (
                <p className="text-xs text-cyan-300 mt-3 truncate">{projectUrl}</p>
              ) : null}
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
