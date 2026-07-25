export type Variant = {
  id: string
  title: string
  productId: string
  sku: string | null
  barcode: string | null
  batchNo: string | null
  stock: number
  allowBackorder: boolean
  manageInventory: boolean
  hsCode: string | null
  originCountry: string | null
  midCode: string | null
  material: string | null
  weight: number | null
  length: number | null
  height: number | null
  width: number | null
  price: number
  costPerItem: number
  mfgDate: string | null
  expiryDate: string | null
  returnAllowed: boolean
  replaceAllowed: boolean
  mrp: number
  img: string | null
  description: string | null
  storeId: string | null
  len: number | null
  rank: number
  shippingWeight: number | null
  shippingHeight: number | null
  shippingLen: number | null
  shippingWidth: number | null
  shippingCost: number | null
  metadata: Record<string, unknown> | null
  variantRank: number
  options: { id: string; optionId: string; value: string; variantId: string }[]
}

// The following interfaces are lightweight versions or additional interfaces
// that may be used in some parts of the application

// Product related additional types
export interface ProductVariant {
	id: string
	title: string
	price: number
	mrp?: number
	thumbnail?: string
	stock?: number
	sku?: string
	options?: VariantOption[]
}

export interface VariantOption {
  optionId: string
  value: string
}
