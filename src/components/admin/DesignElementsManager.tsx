'use client'

import { useEffect, useState } from 'react'
import {
  adminCreateDesignElement,
  adminDeleteDesignElement,
  adminListDesignElements,
  adminUploadDesignAsset,
} from '@/actions/admin-design-elements'
import type { Database } from '@/lib/database.types'

type DesignRow = Database['public']['Tables']['design_elements']['Row']

const CATEGORIES = ['card', 'background', 'texture', 'icon', 'misc'] as const

export default function DesignElementsManager() {
  const [items, setItems] = useState<DesignRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState<string>('card')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sourceBoard, setSourceBoard] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    const result = await adminListDesignElements()
    if (!result.success) {
      setError(result.error ?? 'Učitavanje nije uspjelo')
      setItems([])
    } else {
      setItems(result.items ?? [])
      setError('')
    }
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')

    let storagePath: string | undefined
    let imageUrl: string | undefined

    if (file) {
      const fd = new FormData()
      fd.set('file', file)
      fd.set('category', category)
      const upload = await adminUploadDesignAsset(fd)
      if (!upload.success) {
        setError(upload.error ?? 'Upload nije uspio')
        setBusy(false)
        return
      }
      storagePath = upload.storagePath
      imageUrl = upload.publicUrl
    }

    const result = await adminCreateDesignElement({
      category,
      name,
      description,
      source_board: sourceBoard || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      storage_path: storagePath,
      image_url: imageUrl,
    })

    if (!result.success) {
      setError(result.error ?? 'Spremanje nije uspjelo')
      setBusy(false)
      return
    }

    setName('')
    setDescription('')
    setSourceBoard('')
    setTags('')
    setFile(null)
    await load()
    setBusy(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Obrisati design element?')) return
    setBusy(true)
    const result = await adminDeleteDesignElement(id)
    if (!result.success) setError(result.error ?? 'Brisanje nije uspjelo')
    else await load()
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6 space-y-4">
        <h3 className="font-semibold text-[var(--light)]">Novi design element → Supabase</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-[var(--light-muted)] mb-1">Kategorija</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--light-muted)] mb-1">Naziv</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-[var(--light-muted)] mb-1">Opis</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--light-muted)] mb-1">Source board</label>
            <input
              value={sourceBoard}
              onChange={(e) => setSourceBoard(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--light-muted)] mb-1">Tagovi (zarez)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-[var(--light-muted)] mb-1">Slika (design-assets bucket)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-[var(--light-muted)]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold disabled:opacity-50"
        >
          {busy ? 'Spremanje…' : 'Dodaj u Supabase'}
        </button>
      </form>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-[var(--light-muted)]">Učitavanje…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-[var(--light-muted)]">Nema design elemenata u bazi.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border border-white/10" />
              ) : (
                <div className="h-16 w-16 rounded-lg border border-white/10 bg-white/5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[var(--light)]">{item.name}</div>
                <div className="text-xs text-[var(--light-muted)]">
                  {item.category}
                  {item.storage_path ? ` · ${item.storage_path}` : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(item.id)}
                disabled={busy}
                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Obriši
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
