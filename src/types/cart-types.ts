export type Cart = {
	// Primary fields
	id: string
	email: string | null
	phone: string | null
	lineItems: CartLineItem[]
	// References
	billingAddressId: string | null
	shippingAddressId: string | null
	regionId: string | null
	userId: string | null
	salesChannelId: string | null
	storeId: string | null

	// Payment and discount related
	couponCode: string | null
	discountAmount: number
	couponAppliedDate: string | null
	paymentId: string | null
	paymentMethod: string | null
	paymentAuthorizedAt: string | null

	// Cart configuration
	needAddress: boolean
	isCodAvailable: boolean
	type: string
	completedAt: string | null
	idempotencyKey: string | null

	// Shipping related
	shippingCharges: number
	shippingMethod: string | null

	// Quantity and monetary values
	qty: number
	subtotal: number
	codCharges: number
	tax: number
	total: number
	savingAmount: number
}

export type CartLineItem = {
	id: string
	productId: string
	variantId: string
	qty: number
	price: number
	total: number
}

export type CartProduct = {
	id: string
	slug: string
	thumbnail: string
	productId: string
	variantId: string
	item_id: string
	title: string
	price: number
	product: any // This should reference Product type
	qty: number
}
