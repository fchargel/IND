export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  publisher: string | null
  published_at: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  form_url: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type HeroImage = {
  id: string
  url: string
  alt: string | null
  display_order: number
  active: boolean
  created_at: string
}

export type PageConfig = {
  key: string
  value: Record<string, unknown>
  updated_at: string
}
