export type AdminPortfolioItem = {
  id: string
  title: string
  tag: string | null
  description: string | null
  image_url: string | null
  project_url: string | null
  featured: boolean | null
  active: boolean | null
  sort_order: number | null
  language: string
  created_at: string | null
}

export type PortfolioFormInput = {
  title: string
  tag?: string
  description?: string
  image_url?: string
  project_url?: string
  featured: boolean
  active: boolean
  sort_order: number
  language: string
}
