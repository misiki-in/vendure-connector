export type Store = {
  id: string
  name: string
  isActive: boolean
  isApproved: boolean
  isFeatured: boolean
  isClosed: boolean
  ownerFirstName: string | null
  ownerLastName: string | null
  ownerPhone: string | null
  ownerEmail: string | null
  address_1: string
  address_2: string | null
  zipCode: string | null
  city: string | null
  state: string | null
  country: string | null
  lat: number | null
  lng: number | null
  currencyCode: string | null
  currencySymbol: string | null
  currencySymbolNative: string | null
  lang: string | null
  description: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  freeShippingOn: number
  minimumOrderValue: number
  shippingCharges: number
  commissionRate: number
  timeZone: string | null
  businessPhone: string | null
  businessEmail: string | null
  businessLegalName: string | null
  businessName: string | null
  logo: string | null
  dimensionUnit: string
  weightUnit: string
  userId: string | null
  createdAt: string
  updatedAt: string
}

export type Setting = {
  id: string // Unique identifier for each setting
  name: string // Name of the setting
  description?: string // Optional description of the setting
  logo?: string // URL or path to the logo
  address_1?: string // Address line 1
  address_2?: string // Address line 2
  city?: string // City of the setting's location
  state?: string // State of the setting's location
  country?: string // Country of the setting's location
  phone?: string // Contact phone number
  email?: string // Contact email
  zipCode?: string // Zip code, limited to 16 characters
  currency?: string // Foreign key reference to `Currency` code
  language?: string // Language for the setting
  commission?: number // Commission percentage, defaults to 0
  emailProvider?: string // Email service provider name
  paymentProvider?: string // Payment provider name
  shippingProvider?: string // Shipping provider name
  weightUnit?: string // Weight unit, e.g., "kg", "lbs"
  dimensionUnit?: string // Dimension unit, e.g., "cm", "in"
  createdAt?: string // Timestamp when the setting was created
  updatedAt?: string // Timestamp when the setting was last updated
}

export type CustomerGroup = {
  id: string // Unique identifier for the group
  name: string // Name of the group
  slug: string // URL-friendly slug for the group
  description: string | null // Optional description of the group
  isActive: boolean // Indicates if the group is active
  isFeatured: boolean // Indicates if the group is featured
  userId: string // User ID of the creator or owner
  productCount: number // Number of products in the group, defaults to 0
  thumbnail: string | null // Optional thumbnail image URL
  metaTitle: string | null // Optional meta title for SEO
  metaDescription: string | null // Optional meta description for SEO
  createdAt: string // Timestamp of when the group was created
  updatedAt: string // Timestamp of last update to the group
}

export type Domain = {
  id: string // Unique identifier for the blog post
  status: string // Optional status of the blog post (e.g., draft, published)
  name: string // Title of the blog post
  description: string
  isPrimary: boolean
  isPropagated: boolean
  isActive: boolean
  isDeleted: boolean
  isVerified: boolean
  storeId: string
  userId: string
  createdAt: string // Timestamp when the blog post was created
  updatedAt: string // Timestamp when the blog post was last updated
}

/**
 * Type definitions for store data
 */

export interface Plugin {
  active?: boolean
  value?: string | boolean | number
  phone?: string
  enableReviews?: boolean
  whatsappChatButton?: {
    active?: boolean
    phone?: string
  }
  [key: string]: unknown
}

export interface B2bSettings {
  allowDifferentBillingAddress?: {
    val?: boolean
  }
  [key: string]: unknown
}

export interface StoreData {
  id: string
  name: string
  domain?: string
  logo?: string
  favicon?: string
  plugins?: Record<string, Plugin>
  b2b?: B2bSettings
  state?: string
  city?: string
  [key: string]: unknown // For other potential properties
}

export interface RequestParams {
  request: Request
  url: URL
}
