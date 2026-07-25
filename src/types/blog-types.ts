/**
 * Blog-related type definitions
 */

export type Blog = {
  id: string // Unique identifier for the blog post
  status: string | null // Optional status of the blog post (e.g., draft, published)
  title: string // Title of the blog post
  content: string // Content of the blog post
  user: string // Required user ID of the author
  createdAt: string // Timestamp when the blog post was created
  updatedAt: string // Timestamp when the blog post was last updated
}
