export type Order = {
	id: string // Unique identifier for the order
	orderNo: number // Unique serial order number
	storeId: string | null // Identifier for the store associated with the order
	batchNo: string | null // Batch number for the order
	amount: Record<string, any> | null // JSON object representing the amount breakdown
	parentOrderNo: string | null // Parent order number, if applicable
	vendorId: string // Identifier for the vendor, references Vendor.id
	isEmailSentToVendor: boolean // Flag to check if an email was sent to the vendor
	status: string // Status of the order (e.g., created, processing, completed)
	cartId: string // Cart ID associated with the order, references Cart.id
	userId: string | null // User ID who placed the order
	userPhone: string | null // User phone number
	userFirstName: string | null // First name of the user
	userLastName: string | null // Last name of the user
	userEmail: string | null // User email address
	comment: string | null // Any comment provided with the order
	needAddress: boolean // Flag indicating if an address is needed for the order
	selfTakeout: boolean // Flag for self-takeout orders
	shippingCharges: number // Charges for shipping
	total: number | null // Total amount for the order
	subtotal: number | null // Subtotal amount for the order
	discount: number | null // Discount applied to the order
	tax: number | null // Tax amount for the order
	currencySymbol: string | null // Symbol for the currency used
	currencyCode: string | null // Currency code (e.g., USD, EUR)
	codCharges: number | null // Cash on Delivery charges, if applicable
	codPaid: number | null // Amount paid for COD
	paid: boolean // Flag indicating if the order is fully paid
	paySuccess: number // Payment success flag or count
	amountRefunded: number | null // Total amount refunded
	amountDue: number | null // Remaining amount due
	amountPaid: number | null // Total amount paid so far
	totalDiscount: number | null // Total discount on the order
	totalAmountRefunded: number | null // Total refunded amount on the order
	paymentMethod: string | null // Payment method used
	platform: string | null // Platform through which the order was placed
	couponUsed: string | null // Coupon code used
	coupon: string | null // Coupon details
	paymentStatus: string | null // Status of the payment
	paymentCurrency: string | null // Currency in which the payment was made
	paymentMsg: string | null // Payment status message
	paymentReferenceId: string | null // Reference ID for payment processing
	paymentGateway: string | null // Payment gateway used
	paymentId: string | null // Payment ID, references Payment.id
	paymentAmount: number | null // Amount paid through the payment method
	paymentMode: string | null // Mode of payment (e.g., card, UPI)
	paymentDate: string | null // Date of the payment
	shippingAddressId: string | null // Shipping address ID
	billingAddressId: string | null // Billing address ID
	shippingAddress: Record<string, any> | null // JSON object for shipping address details
	billingAddress: Record<string, any> | null // JSON object for billing address details
	createdAt: string // Timestamp when the order was created
	updatedAt: string // Timestamp when the order was last updated
}

export type Invoice = {
	id: string
	name: string
}

// Order specific lightweight interface
export interface OrderItem {
	id: string
	productId: string
	variantId?: string
	title: string
	price: number
	quantity: number
	thumbnail?: string
}
