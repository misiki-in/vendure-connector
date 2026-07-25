import { Variant } from './product-variant-types'

export type Product = {
	id: string
	active: boolean
	status: ProductStatus
	type: string
	vendorId: string
	categoryId: string | null
	currency: string | null
	instructions: string | null
	description: string | null
	hsnCode: string | null
	images: string | null
	featuredImage: string | null
	thumbnail: string | null
	keywords: string | null
	link: string | null
	metaTitle: string | null
	metaDescription: string | null
	title: string
	subtitle: string | null
	popularity: number
	rank: number
	slug: string | null

	// Dates and Measurements
	expiryDate: string | null
	weight: number | null
	mfgDate: string | null

	// Pricing and Inventory
	mrp: number
	price: number
	costPerItem: number
	sku: string | null
	stock: number
	allowBackorder: boolean
	manageInventory: boolean

	// Shipping Dimensions
	shippingWeight: number | null
	shippingHeight: number | null
	shippingLen: number | null
	shippingWidth: number | null

	// Product Dimensions
	height: number | null
	width: number | null
	len: number | null

	// Additional Details
	barcode: string | null
	shippingCost: number | null
	returnAllowed: boolean
	replaceAllowed: boolean

	// Metadata and References
	originCountry: string | null
	weightUnit: string
	dimensionUnit: string
	metadata: Record<string, unknown> | null
	collectionId: string | null

	// Variants
	options?: { id: string; title: string; type: string; values: { id: string; value: string }[] }[]
	variants?: Variant[]
}

// Enums
export enum ProductStatus {
	DRAFT = 'draft',
	PROPOSED = 'proposed',
	PUBLISHED = 'published',
	REJECTED = 'rejected'
}

export type AutoComplete = {
	id: string // Unique identifier for the autocomplete entry
	text: string // Text for the autocomplete suggestion
	type: string // Type/category of the suggestion (e.g., "product", "category")
	popularity: number // Popularity score, used for ranking
	createdAt: string // Timestamp of when the entry was created
	updatedAt: string // Timestamp of the last update to the entry
}
