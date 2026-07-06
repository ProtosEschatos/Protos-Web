'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreatePortfolioItem, adminDeletePortfolioItem, adminUpdatePortfolioItem } from '@/actions/admin-portfolio'
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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
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
    </form>
  )
}
