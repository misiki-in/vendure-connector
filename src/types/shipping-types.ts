/**
 * Shipping-related type definitions
 */

export type ShippingProvider = {
  id: string
  name: string
}

export type Fulfillment = {
  id: string // Primary key for the fulfillment record
  shippingSync: boolean // Indicates if shipping is synchronized
  store: string | null // Optional store identifier
  active: boolean // Indicates if the fulfillment is active
  orderNo: number // Order number associated with the fulfillment
  trackingNumber: string | null // Optional tracking number for the shipment
  trackingUrl: string | null // Optional URL for tracking the shipment
  vendorId: string | null // Optional vendor ID for the fulfillment
  orderId: string | null // Optional order ID for the fulfillment
  batchNo: string // Batch number for the fulfillment (required)
  fulfillmentOrderId: string | null // Optional fulfillment order ID
  shipmentId: string | null // Optional shipment ID
  shippingProvider: string | null // Optional shipping provider name
  shipmentLabel: string | null // Optional label for the shipment
  invoiceUrl: string | null // Optional URL for the invoice
  courierName: string | null // Optional name of the courier
  courierId: string | null // Optional ID of the courier
  shippingStatus: string | null // Optional shipping status
  status: string // Current status of the fulfillment (default: 'confirmed')
  shippingInfo: string | null // Optional additional shipping information
  manifest: string | null // Optional manifest details
  userId: number | null // Optional user ID associated with the fulfillment
  pickup: Record<string, any> | null // Optional JSON object for pickup details
  weight: number | null // Weight in grams
  length: number | null // Length dimension
  breadth: number | null // Breadth dimension
  height: number | null // Height dimension
  createdAt: string // Timestamp for when the fulfillment was created
  updatedAt: string // Timestamp for when the fulfillment was last updated
}

export type Return = {
  id: string // Unique identifier for the return
  orderId: string // Identifier for the associated order
  reason: string // Reason for the return
  status: string // Current status of the return (e.g., pending, approved, rejected)
  createdBy: string // Identifier for the user who initiated the return
  createdAt: string // Timestamp for when the return was created
  updatedAt: string // Timestamp for when the return was last updated
}

export type ReturnReason = {
  id: string
  name: string
}
