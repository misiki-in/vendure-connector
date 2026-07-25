export type InventoryItem = {
  id: string
  name: string
  description: string | null
  type: string
  productId: string
  location: string
  stock: number
  sku: string
  barcode: string
  batchNo: string
  allowBackorder: boolean
  manageInventory: boolean
  minStockLevel: number
  reorderQuantity: number
  active: boolean
  createdAt: string
  updatedAt: string
}
