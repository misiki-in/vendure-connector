/* Region-related type definitions */

export type Region = {
  id: string // Unique identifier for the region
  name: string // Name of the region
  currencyCode: string // Currency code (e.g., USD, EUR) used in the region
  currency: string // Currency code reference from the Currency table
  taxRate: number // Tax rate applicable in the region
  taxCode: string | null // Tax code, if any
  metadata: Record<string, any> | null // Metadata in JSON format for additional details
  createdAt: string | null // Timestamp when the region was created
  updatedAt: string | null // Timestamp for the last update of the region
  deletedAt: string | null // Timestamp for soft deletion of the region, if applicable
}

export type Country = {
  name: string
  iso2: string
}

export type State = {
  name: string
  code: string
}

export type Currency = {
  id: string
  name: string
}
