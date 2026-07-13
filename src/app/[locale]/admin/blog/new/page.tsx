import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/features/admin/AdminPageShell'
import BlogAdminForm from '@/components/features/admin/BlogAdminForm'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminBlogNewPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale)
  return (
    <AdminPageShell title="Novi članak" backHref="/admin/blog" backLabel="Blog">
      <BlogAdminForm />
    </AdminPageShell>
  )
}
