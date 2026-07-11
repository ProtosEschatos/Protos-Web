'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreateBlogPost, adminDeleteBlogPost, adminUpdateBlogPost } from '@/actions/admin-blog'
import type { AdminBlogPost, BlogFormInput } from '@/types/admin-blog'

const LANGUAGES = ['hr', 'en', 'de', 'it', 'es'] as const

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

type Props = {
  post?: AdminBlogPost
}

export default function BlogAdminForm({ post }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [language, setLanguage] = useState(post?.language ?? 'hr')
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const buildInput = (): BlogFormInput => ({
    title,
    slug: slug || slugify(title),
    excerpt,
    content,
    language,
    is_published: isPublished,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = post
        ? await adminUpdateBlogPost(post.id, buildInput())
        : await adminCreateBlogPost(buildInput())
      if (!result.success) {
        setError(result.error ?? 'Spremanje nije uspjelo.')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('Greška pri spremanju.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm('Obrisati ovaj članak?')) return
    setLoading(true)
    const result = await adminDeleteBlogPost(post.id)
    if (!result.success) {
      setError(result.error ?? 'Brisanje nije uspjelo.')
      setLoading(false)
      return
    }
    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm text-[var(--light-muted)] mb-2">Naslov</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (!slug && title) setSlug(slugify(title))
            }}
            required
            className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--light-muted)] mb-2">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
          <label className="block text-sm text-[var(--light-muted)] mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-[var(--light-muted)] mb-2">Sadržaj (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-[var(--dark)]/80 border border-white/10 text-[var(--light)] font-mono text-sm"
          />
        </div>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-[var(--light)]">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-white/20"
          />
          Objavljeno na stranici
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Spremanje…' : post ? 'Spremi promjene' : 'Kreiraj članak'}
        </button>
        {post ? (
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
