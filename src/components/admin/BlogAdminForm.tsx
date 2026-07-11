'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { adminCreateBlogPost, adminDeleteBlogPost, adminUpdateBlogPost } from '@/actions/admin-blog'
import AdminAiPanel from '@/components/admin/AdminAiPanel'
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
  const [showAi, setShowAi] = useState(false)

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

  const insertAiContent = (text: string) => {
    if (!text) return
    if (!content.trim()) setContent(text)
    else if (!excerpt.trim()) setExcerpt(text)
    else setContent((prev) => `${prev.trim()}\n\n${text}`)
    setShowAi(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAi((v) => !v)}
          className="px-4 py-2 rounded-full border border-cyan-400/30 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10"
        >
          {showAi ? 'Sakrij AI' : 'AI pomoć'}
        </button>
      </div>

      {showAi ? (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
          <AdminAiPanel onInsert={insertAiContent} />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-5">
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
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[var(--dark-card)]/50 p-6 h-fit sticky top-24">
          <p className="text-xs uppercase tracking-wider text-[var(--primary)] mb-3">Live preview</p>
          <h2 className="text-xl font-bold text-[var(--light)] mb-2">{title || 'Naslov članka'}</h2>
          {excerpt ? <p className="text-sm text-[var(--light-muted)] mb-4 leading-relaxed">{excerpt}</p> : null}
          <div className="prose prose-invert prose-sm max-w-none text-[var(--light-muted)] [&_h2]:text-[var(--light)] [&_h3]:text-[var(--light)]">
            {content.trim() ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-sm italic">Markdown sadržaj će se prikazati ovdje.</p>
            )}
          </div>
        </aside>
      </form>
    </div>
  )
}
