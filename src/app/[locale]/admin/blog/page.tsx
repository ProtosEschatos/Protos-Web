import { setRequestLocale } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { adminListBlogPosts } from '@/lib/queries/admin/blog'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import AdminLink from '@/components/features/admin/AdminLink'

type Props = { params: { locale: string } }

export default async function AdminBlogPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const posts = await adminListBlogPosts(locale)

  return (
    <AdminPageShell title="Blog" description="Upravljanje člancima u Supabase bazi (blog_posts).">
      <div className="flex justify-end mb-6">
        <AdminLink
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff8800] text-white text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Novi članak
        </AdminLink>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--dark-card)]/80 text-[var(--light-muted)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Naslov</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Datum</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--light-muted)]">
                  Nema članaka za {locale.toUpperCase()}.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-[var(--light)]">{post.title}</td>
                  <td className="px-4 py-3 text-[var(--light-muted)] hidden sm:table-cell">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        post.is_published
                          ? 'border-emerald-500/30 text-emerald-400'
                          : 'border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {post.is_published ? 'Objavljeno' : 'Skica'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--light-muted)] hidden md:table-cell">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('hr-HR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminLink href={`/admin/blog/${post.id}/edit`} className="text-[var(--primary)] hover:underline">
                      Uredi
                    </AdminLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPageShell>
  )
}
