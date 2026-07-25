export type Collection = {
  id: string // Unique identifier for the collection
  name: string // Name of the collection
  slug: string // URL-friendly slug for the collection
  description: string | null // Optional description of the collection
  isActive: boolean // Indicates if the collection is active
  isFeatured: boolean // Indicates if the collection is featured
  userId: string // User ID of the creator or owner
  productCount: number // Number of products in the collection, defaults to 0
  thumbnail: string | null // Optional thumbnail image URL
  metaTitle: string | null // Optional meta title for SEO
  metaDescription: string | null // Optional meta description for SEO
  createdAt: string // Timestamp of when the collection was created
  updatedAt: string // Timestamp of last update to the collection
}
