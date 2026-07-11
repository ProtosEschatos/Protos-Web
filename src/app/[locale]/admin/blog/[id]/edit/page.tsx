import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { adminGetBlogPost } from '@/lib/queries/admin/blog'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import BlogAdminForm from '@/components/features/admin/BlogAdminForm'

type Props = { params: { locale: string; id: string } }

export default async function AdminBlogEditPage({ params: { locale, id } }: Props) {
  setRequestLocale(locale)
  const post = await adminGetBlogPost(id)
  if (!post) notFound()

  return (
    <AdminPageShell title="Uredi članak" backHref="/admin/blog" backLabel="Blog">
      <BlogAdminForm post={post} />
    </AdminPageShell>
  )
}
