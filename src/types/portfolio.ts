export type PortfolioItem = {
  id: string
  title: string
  tag: string | null
  description: string | null
  image_url: string | null
  project_url: string | null
  featured: boolean | null
  sort_order: number | null
  language: string
}
