export type Wishlist = {
  id: string // Unique identifier for the wishlist entry
  active: boolean // Status to indicate if the wishlist item is active
  product: string // Product ID associated with the wishlist item
  listing: string // Listing ID for the product
  store: string | null // Store ID, can be null if not specified
  userId: string // User ID who created the wishlist item
  variant: string // Variant ID of the product, defaults to an empty string
  createdAt: string // Timestamp of when the wishlist item was created
  updatedAt: string // Timestamp of the last update to the wishlist item
}
