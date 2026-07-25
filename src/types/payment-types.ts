/**
 * Payment-related type definitions
 */

export type PaymentMethod = {
  id: string // Unique identifier for the payment method
  name: string // Name of the payment method (must be unique)
  type: string // Type of payment method (e.g., credit card, PayPal)
  active: boolean // Indicates if the payment method is active
  isTest: boolean // Indicates if the payment method is in test mode
  manualCapture: boolean // Indicates if the payment method requires manual capture
  value: string
  createdAt: string // Timestamp for when the payment method was created
  updatedAt: string // Timestamp for when the payment method was last updated
}

export type Payment = {
  id: string
  orderId: string
  amount: number
  currency: string
  method: string
  status: string
  transactionId: string | null
  gatewayResponse: Record<string, any> | null
  metadata: Record<string, any> | null
  createdAt: string
  updatedAt: string
}
