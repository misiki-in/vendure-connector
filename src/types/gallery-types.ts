/**
 * Gallery-related type definitions
 */

export type Gallery = {
  id: string // Unique identifier for the gallery item
  title: string // Title or name of the gallery image
  description: string | null // Description or caption for the image
  imageUrl: string // URL to the image
  thumbnailUrl: string | null // Optional thumbnail URL for a smaller preview
  sortOrder: number // Order of the image in the gallery display
  isActive: boolean // Indicates if the image is active or visible in the gallery
  createdAt: string // Timestamp of when the gallery item was created
  updatedAt: string // Timestamp of the last update to the gallery item
}
