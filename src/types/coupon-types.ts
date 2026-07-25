/**
 * Coupon-related type definitions
 */

export type Coupon = {
  id: string // Unique identifier for the coupon
  code: string // Unique code for the coupon
  amount: number // Discount amount
  type: 'USER' | 'TOTAL' | 'BOGO' // Type of coupon, as defined by the CouponTypeEnum
  maxAmount: number // Maximum discount amount
  createdAt: string // Timestamp of when the coupon was created
  updatedAt: string // Timestamp of the last update to the coupon
}

export type Deal = {
  // Primary fields
  id: string
  title: string
  description: string | null
  storeId: string | null

  // Deal configuration and conditions
  dealType: string // e.g., "discount", "bundle", "BOGO"
  discountPercentage: number | null
  discountAmount: number | null
  minPurchaseAmount: number | null
  startDate: string
  endDate: string | null
  active: boolean
  conditions: Record<string, any> | null // e.g., specific category, user segment, etc.

  // Product associations
  products: string[] // Array of product IDs eligible for the deal
  variants: string[] // Array of variant IDs eligible for the deal

  // Deal limits
  maxUses: number | null // Maximum times the deal can be applied
  perUserLimit: number | null // Maximum times a single user can use this deal

  // Metadata and tracking
  metadata: Record<string, any> | null
  createdAt: string
  updatedAt: string
}
