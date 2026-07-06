export type AdminBlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  language: string
  is_published: boolean | null
  created_at: string | null
}

export type BlogFormInput = {
  title: string
  slug?: string
  excerpt?: string
  content?: string
  language: string
  is_published: boolean
}
