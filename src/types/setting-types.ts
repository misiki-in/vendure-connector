/* Setting-related type definitions */

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
