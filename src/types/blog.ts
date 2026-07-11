export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  created_at: string
  language: string
  author_slug: 'dario' | 'martina' | 'both'
}

export type BlogSlugEntry = {
  slug: string
  language: string
  updated_at: string
}
