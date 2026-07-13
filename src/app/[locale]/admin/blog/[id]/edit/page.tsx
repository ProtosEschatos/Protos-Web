import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { adminGetBlogPost } from '@/lib/queries/admin/blog'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import BlogAdminForm from '@/components/features/admin/BlogAdminForm'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function AdminBlogEditPage(props: Props) {
  const params = await props.params;

  const {
    locale,
    id
  } = params;

  setRequestLocale(locale)
  const post = await adminGetBlogPost(id)
  if (!post) notFound()

  return (
    <AdminPageShell title="Uredi članak" backHref="/admin/blog" backLabel="Blog">
      <BlogAdminForm post={post} />
    </AdminPageShell>
  )
}
