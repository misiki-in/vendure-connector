/**
 * Vendor-related type definitions
 */

export type Vendor = {
  id: string
  status?: string | null
  address?: string | null
  email: string
  phone: string
  dialCode?: string | null
  name?: string | null
  email2?: string | null
  banners?: string | null
  logo?: string | null
  countryName?: string | null
  country?: string | null // Country.iso2 reference
  about?: string | null
  businessName: string
  website?: string | null
  description?: string | null
  info?: string | null
  shippingCharges: number
  codCharges: number
  slug?: string | null
  featuredImage?: string | null
  isEmailVerified: boolean
  isPhoneVerified: boolean
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  isApproved: boolean
  isDeleted: boolean
  state?: string | null
  tax_number?: string | null
  zip?: string | null
  user: string // User.id reference
  createdAt: string
  updatedAt: string
}

export type Commission = {
  id: string // Unique identifier for the commission
  commissionRate: number // Commission rate, either a percentage or fixed amount
  commissionType: string // Type of commission (e.g., percentage or fixed)
  userId: string // User ID associated with this commission
  isActive: boolean // Indicates if the commission is currently active
  startDate: string // Start date of the commission period
  endDate: string | null // Optional end date of the commission period
  createdAt: string // Timestamp of when the commission record was created
  updatedAt: string // Timestamp of the last update to the commission record
}

export type Team = {
  id?: string
  email: string
  phone?: string
  role: string
  vendorId: string
  storeId: string
  avatar?: string
  approved: boolean
  isJoined?: boolean
  isCreator?: boolean
  zips?: string[]
  createdAt?: string
  updatedAt?: string
}
