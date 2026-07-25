/**
 * Checkout-related type definitions
 */

export type Checkout = {
  id: string // Unique identifier for the checkout
  orderId: string // Identifier for the associated order
  userId: string // ID of the user making the checkout
  status: string // Status of the checkout (e.g., pending, completed)
  totalAmount: number // Total amount for the checkout
  paymentMethod: string // Payment method used in the checkout
  paymentStatus: string // Status of payment (e.g., unpaid, paid)
  isConfirmed: boolean // Indicates if the checkout is confirmed
  discount: number // Discount applied to the total amount
  tax: number // Tax applied to the total amount
  shippingCost: number // Shipping cost for the checkout
  createdAt: string // Timestamp of when the checkout was created
  updatedAt: string // Timestamp of the last update to the checkout
}
