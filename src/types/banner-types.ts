/**
 * Banner-related type definitions
 */

export type Banner = {
  id: string // Unique identifier for the banner
  active: boolean // Indicates whether the banner is active
  demo: boolean // Indicates if this is a demo banner
  groupId: string | null // Optional group identifier for categorizing banners
  groupTitle: string | null // Optional title for the group of banners
  heading: string | null // Optional heading for the banner
  img: string // Image URL for the banner (required)
  imgCdn: string | null // Optional CDN URL for the image
  link: string | null // Optional link for redirection when the banner is clicked
  pageId: string // Page identifier where the banner will be displayed (defaults to 'home')
  pageType: string | null // Optional type of page for the banner
  isLinkExternal: boolean | null // Indicates if the link is external
  sort: number | null // Optional sorting index for display order
  storeId: number // Required store identifier
  userId: number | null // Optional user identifier for the banner's owner
  type: string // Type of the banner (defaults to 'slider')
  isMobile: boolean // Indicates if the banner is optimized for mobile
  description: string | null // Optional description of the banner
  title: string | null // Optional title for the banner
  bannerId: number | null // Optional identifier for related banners
  fieldGrid: number | null // Optional grid field for layout
  scroll: boolean | null // Indicates if the banner is scrollable
  createdAt: string // Timestamp when the banner was created
  updatedAt: string // Timestamp when the banner was last updated
}
