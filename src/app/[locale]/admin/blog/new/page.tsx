import { setRequestLocale } from 'next-intl/server'
import AdminPageShell from '@/components/admin/AdminPageShell'
import BlogAdminForm from '@/components/admin/BlogAdminForm'

type Props = { params: { locale: string } }

export default function AdminBlogNewPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  return (
    <AdminPageShell title="Novi članak" backHref="/admin/blog" backLabel="Blog">
      <BlogAdminForm />
    </AdminPageShell>
  )
}
