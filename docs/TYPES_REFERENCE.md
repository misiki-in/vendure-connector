# TypeScript Types Reference

Quick reference for all TypeScript types in LiteKart Connector.

---

## Core Types

### `PaginatedResponse<T>`

Base response type for all paginated list operations.

```typescript
type PaginatedResponse<T> = {
  /** Array of items */
  data: T[]
  /** Total count of all items */
  count: number
  /** Number of items per page */
  pageSize: number
  /** Total number of pages */
  noOfPage: number
  /** Current page number (1-based) */
  page: number
}
```

**Usage:**
```typescript
const response: PaginatedResponse<Product> = await productService.list({})
response.data        // Product[]
response.count       // number
response.totalPages  // number (alias for noOfPage)
```

---

## Product Types

### `Product`

Complete product representation.

```typescript
type Product = {
  // ── Identity ─────────────────────────────────────
  id: string
  slug: string | null
  title: string
  subtitle: string | null
  description: string | null
  status: ProductStatus
  type: string
  active: boolean

  // ── Organization ─────────────────────────────────
  vendorId: string
  categoryId: string | null
  collectionId: string | null

  // ── Media ────────────────────────────────────────
  images: string | null
  featuredImage: string | null
  thumbnail: string | null

  // ── Pricing ──────────────────────────────────────
  mrp: number
  price: number
  costPerItem: number
  discount?: number

  // ── Inventory ────────────────────────────────────
  stock: number
  sku: string | null
  barcode: string | null
  allowBackorder: boolean
  manageInventory: boolean

  // ── Variants & Options ───────────────────────────
  options?: ProductOption[]
  variants?: Variant[]

  // ── Dimensions & Weight ──────────────────────────
  weight: number | null
  shippingWeight: number | null
  shippingHeight: number | null
  shippingLen: number | null
  shippingWidth: number | null
  height: number | null
  width: number | null
  len: number | null
  weightUnit: string
  dimensionUnit: string
  shippingCost: number | null

  // ── Dates ────────────────────────────────────────
  expiryDate: string | null
  mfgDate: string | null

  // ── Origins & Compliance ─────────────────────────
  originCountry: string | null
  hsnCode: string | null
  returnAllowed: boolean
  replaceAllowed: boolean

  // ── SEO & Discovery ──────────────────────────────
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  link: string | null
  popularity: number
  rank: number

  // ── Metadata ─────────────────────────────────────
  instructions: string | null
  metadata: Record<string, unknown> | null

  // ── Timestamps ───────────────────────────────────
  createdAt: string
  updatedAt: string
}
```

### `ProductStatus`

```typescript
enum ProductStatus {
  DRAFT = 'draft'
  PROPOSED = 'proposed'
  PUBLISHED = 'published'
  REJECTED = 'rejected'
}
```

### `ProductOption`

```typescript
type ProductOption = {
  id: string
  title: string
  type: string  // e.g., 'color', 'size'
  values: ProductOptionValue[]
}

type ProductOptionValue = {
  id: string
  value: string
}
```

### `Variant`

```typescript
type Variant = {
  id: string
  productId: string
  title: string
  sku?: string
  mrp?: number
  price: number
  costPerItem?: number
  stock: number
  allowBackorder: boolean
  manageInventory: boolean
  barcode?: string
  weight?: number
  images?: string[]
  dimensions?: {
    height?: number
    width?: number
    length?: number
    weight?: number
  }
  options: {
    id: string
    value: string
  }[]
  createdAt: string
  updatedAt: string
}
```

---

## Cart Types

### `Cart`

```typescript
type Cart = {
  // ── Identity ─────────────────────────────────────
  id: string
  userId: string | null
  storeId: string | null
  salesChannelId: string | null

  // ── Contact ──────────────────────────────────────
  email: string | null
  phone: string | null

  // ── Addresses ───────────────────────────────────
  billingAddressId: string | null
  shippingAddressId: string | null

  // ── Line Items ───────────────────────────────────
  lineItems: CartLineItem[]

  // ── Pricing ──────────────────────────────────────
  subtotal: number
  discountAmount: number
  couponCode: string | null
  couponAppliedDate: string | null
  shippingCharges: number
  codCharges: number
  tax: number
  total: number
  savingAmount: number

  // ── Payment ──────────────────────────────────────
  paymentId: string | null
  paymentMethod: string | null
  paymentAuthorizedAt: string | null

  // ── Configuration ───────────────────────────────
  needAddress: boolean
  isCodAvailable: boolean
  type: string
  shippingMethod: string | null
  regionId: string | null
  completedAt: string | null
  idempotencyKey: string | null

  // ── Quantities ───────────────────────────────────
  qty: number
}
```

### `CartLineItem`

```typescript
type CartLineItem = {
  id: string
  productId: string
  variantId: string
  qty: number
  price: number
  total: number
  // Optional depending on API response
  product?: Product
  variant?: Variant
  lineTotal?: number
  isSelectedForCheckout?: boolean
}
```

---

## Order Types

### `Order`

```typescript
type Order = {
  // ── Identity ─────────────────────────────────────
  id: string
  orderNo: number
  parentOrderNo?: string | null
  batchNo?: string | null

  // ── Status & References ─────────────────────────
  status: string
  paymentStatus?: string | null
  storeId?: string | null
  vendorId: string
  cartId: string
  userId?: string | null

  // ── Customer ─────────────────────────────────────
  userFirstName?: string | null
  userLastName?: string | null
  userEmail?: string | null
  userPhone?: string | null

  // ── Addresses ────────────────────────────────────
  shippingAddressId?: string | null
  billingAddressId?: string | null
  shippingAddress?: Address
  billingAddress?: Address

  // ── Line Items ───────────────────────────────────
  lineItems?: OrderLineItem[]

  // ── Pricing ──────────────────────────────────────
  amount?: Record<string, any> | null
  subtotal?: number | null
  shippingCharges: number
  discount?: number | null
  tax?: number | null
  codCharges?: number | null
  total?: number | null
  savingAmount?: number | null
  currencySymbol?: string | null
  currencyCode?: string | null

  // ── Payment ──────────────────────────────────────
  paymentMethod?: string | null
  platform?: string | null
  paymentGateway?: string | null
  paymentId?: string | null
  paymentReferenceId?: string | null
  paymentAmount?: number | null
  paymentMode?: string | null
  paymentDate?: string | null
  paymentMsg?: string | null
  paymentStatus?: string | null
  paymentCurrency?: string | null
  paid: boolean
  paySuccess: number
  amountRefunded?: number | null
  amountDue?: number | null
  amountPaid?: number | null
  totalDiscount?: number | null
  totalAmountRefunded?: number | null
  codPaid?: number | null

  // ── Coupon ───────────────────────────────────────
  couponUsed?: string | null
  coupon?: string | null

  // ── Flags ────────────────────────────────────────
  needAddress: boolean
  selfTakeout: boolean
  isEmailSentToVendor: boolean
  comment?: string | null

  // ── Timestamps ───────────────────────────────────
  createdAt: string
  updatedAt: string
}
```

### `OrderLineItem`

```typescript
type OrderLineItem = {
  id: string
  orderId: string
  productId: string
  variantId: string
  qty: number
  price: number
  total: number
  product?: Product
  variant?: Variant
}
```

---

## User Types

### `User`

```typescript
type User = {
  // ── Identity ─────────────────────────────────────
  id: string
  email: string
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  avatar?: string | null

  // ── Status ───────────────────────────────────────
  status?: string | null
  role?: string | null
  isApproved: boolean
  isDeleted: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean

  // ── Authentication ───────────────────────────────
  otp?: string | null
  otpAttempt: number
  otpTime?: string | null
  verifiedAt?: string | null
  cartId?: string | null
  userAuthToken?: string | null

  // ── Login Tracking ───────────────────────────────
  signInCount: number
  currentSignInAt?: string | null
  currentSignInIp?: string | null
  lastSignInAt?: string | null
  lastSignInIp?: string | null
  lastSignIn?: string | null

  // ── IP Geolocation ───────────────────────────────
  ipCity?: string | null
  ipCountry?: string | null
  ipLatitude?: number | null
  ipLongitude?: number | null
  ipRegion?: string | null
  ipTimezone?: string | null

  // ── Timestamps ───────────────────────────────────
  createdAt: string
  updatedAt: string
}
```

---

## Address Types

### `Address`

```typescript
type Address = {
  id: string
  userId: string

  // ── Contact ──────────────────────────────────────
  firstName: string
  lastName: string
  phone: string
  email?: string

  // ── Location ─────────────────────────────────────
  address_1: string
  address_2?: string
  city: string
  state: string
  zip: string
  countryCode: string
  landmark?: string

  // ── Flags ────────────────────────────────────────
  isPrimary: boolean
  isResidential: boolean
  active: boolean

  // ── Timestamps ───────────────────────────────────
  createdAt: string
  updatedAt: string
}
```

---

## Category Types

### `Category`

```typescript
type Category = {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string | null
  image?: string
  icon?: string
  featured: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
  isActive: boolean
  children?: Category[]
  ancestors?: Category[]
  productCount?: number
  createdAt: string
  updatedAt: string
}
```

---

## Payment & Checkout Types

### `Checkout` (Shipping Rates Response)

```typescript
type Checkout = {
  shippingRates?: ShippingRate[]
  paymentMethods?: PaymentMethod[]
  cart?: Cart
}

type ShippingRate = {
  id: string
  name: string
  description?: string
  price: number
  estimatedDays?: string
  carrier?: string
}

type PaymentMethod = {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  icon?: string
  config?: Record<string, unknown>
}
```

---

## Search Types

### `ProductSearchResult`

```typescript
type ProductSearchResult = {
  data: Product[]
  count: number
  totalPages: number
  categoryHierarchy: Record<string, any>[]
  facets: {
    priceStat: {
      min?: number
      max?: number
    }
    categories: {
      name: string
      count: number
    }[]
    tags: {
      name: string
      count: number
    }[]
    allFilters?: Record<string, Record<string, number>>
  }
}
```

### `MeilisearchResponse`

```typescript
type MeilisearchResponse = {
  hits: Product[]
  totalHits?: number
  estimatedTotalHits?: number
  totalPages?: number
  page?: number
  hitsPerPage?: number
  facetDistribution?: Record<string, Record<string, number>>
  allfacetStats?: {
    price?: { min: number; max: number }
  }
  categories?: Record<string, any>[]
  processingTimeMs?: number
  query?: string
}
```

---

## Content Types

### `Blog`

```typescript
type Blog = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  status: 'draft' | 'published'
  tags?: string[]
  categoryId?: string
  metaTitle?: string
  metaDescription?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
```

### `Banner`

```typescript
type Banner = {
  id: string
  title: string
  type: 'hero' | 'sidebar' | 'footer'
  image: string
  link?: string
  position: number
  isActive: boolean
  startDate?: string
  endDate?: string
  targetUrl?: string
  createdAt: string
  updatedAt: string
}
```

### `Gallery`

```typescript
type Gallery = {
  id: string
  title: string
  slug: string
  description?: string
  images: {
    id: string
    url: string
    alt?: string
    order: number
  }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### `Page`

```typescript
type Page = {
  id: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Store & Vendor Types

### `StoreDetails`

```typescript
type StoreDetails = {
  id: string
  name: string
  domain: string
  logo?: string
  favicon?: string
  description?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  contact?: {
    email?: string
    phone?: string
    website?: string
  }
  settings?: {
    currency?: string
    timezone?: string
    language?: string
    [key: string]: unknown
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### `Vendor`

```typescript
type Vendor = {
  id: string
  userId: string
  businessName: string
  businessDescription?: string
  businessAddress?: string
  taxId?: string
  commissionRate: number
  isApproved: boolean
  isActive: boolean
  bankAccount?: {
    accountNumber: string
    accountHolder: string
    bankName: string
    ifscCode: string
  }
  createdAt: string
  updatedAt: string
}
```

---

## Wishlist & Review Types

### `Wishlist`

```typescript
type Wishlist = {
  id: string
  userId: string
  productId: string
  variantId?: string
  product?: Product
  createdAt: string
}
```

### `Feedback` (Review)

```typescript
type Feedback = {
  id: string
  productId: string
  userId: string
  rating: number  // 1-5
  review: string
  helpful?: number
  isApproved: boolean
  uploadedImages?: string[]
  createdAt: string
  updatedAt: string
}
```

---

## Coupon Types

### `Coupon`

```typescript
type Coupon = {
  id: string
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number  // Percentage (0-100) or fixed amount
  maxUses?: number
  usedCount: number
  minOrderAmount?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  excludedProducts?: string[]
  startDate: string
  expiryDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Utility Types

### `Region`

```typescript
type Region = {
  id: string
  name: string
  code: string
  countryCode: string
  isActive: boolean
}
```

### `Country`

```typescript
type Country = {
  id: string
  name: string
  code: string
  phoneCode: string
  isActive: boolean
  states?: State[]
}
```

### `State`

```typescript
type State = {
  id: string
  name: string
  code: string
  countryCode: string
  isActive: boolean
  cities?: City[]
}
```

### `Currency`

```typescript
type Currency = {
  id: string
  code: string
  name: string
  symbol: string
  isDefault: boolean
  exchangeRate: number
  isActive: boolean
}
```

---

## Common Enums

### `ProductStatus`

```typescript
enum ProductStatus {
  DRAFT = 'draft'
  PROPOSED = 'proposed'
  PUBLISHED = 'published'
  REJECTED = 'rejected'
}
```

### Used in Status Fields

Common status values used throughout:

```typescript
const ORDER_STATUS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const PAYMENT_STATUS = ['pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded']
const USER_ROLES = ['customer', 'vendor', 'admin', 'superadmin']
const ADDRESS_TYPES = ['shipping', 'billing']
```

---

## Type Guards & Utilities

### Type Guards

```typescript
function isProduct(obj: any): obj is Product {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'title' in obj &&
    'price' in obj
  )
}

function isCart(obj: any): obj is Cart {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'lineItems' in obj &&
    'total' in obj
  )
}

function isOrder(obj: any): obj is Order {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'orderNo' in obj &&
    'status' in obj
  )
}
```

### Helper Functions

```typescript
// Format price with currency
function formatPrice(
  price: number,
  currencySymbol: string = '$',
  decimals: number = 2
): string {
  return `${currencySymbol}${price.toFixed(decimals)}`
}

// Check if product is in stock
function isInStock(product: Product, variant?: Variant): boolean {
  if (variant) {
    return variant.stock > 0
  }
  return product.stock > 0
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get product price (variant override or product default)
function getProductPrice(
  product: Product,
  variant?: Variant
): number {
  return variant?.price ?? product.price
}

// Get product MRP
function getProductMrp(
  product: Product,
  variant?: Variant
): number {
  return variant?.mrp ?? product.mrp
}

// Calculate discount percentage
function getDiscountPercentage(
  mrp: number,
  price: number
): number {
  if (mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}
```

---

## Type Extraction Examples

### Extract Product IDs from Cart

```typescript
const productIds: string[] = cart.lineItems.map(item => item.productId)
```

### Group Cart Items by Product

```typescript
const itemsByProduct = cart.lineItems.reduce((acc, item) => {
  if (!acc[item.productId]) {
    acc[item.productId] = []
  }
  acc[item.productId].push(item)
  return acc
}, {} as Record<string, CartLineItem[]>)
```

### Filter Products by Status

```typescript
const publishedProducts = products.filter(
  (p): p is Product & { status: 'published' } =>
    p.status === 'published'
)
```

---

## Type Safety Patterns

### Discriminated Unions for Status

```typescript
type LoadingState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

// Usage
const state: LoadingState<Product[]> = {
  status: 'success',
  data: products
}

if (state.status === 'success') {
  // TypeScript knows state.data exists and is Product[]
  console.log(state.data.length)
}
```

### Optional Field Handling

```typescript
// Safe property access with defaults
const title = product.subtitle ?? product.title ?? 'Untitled'
const description = product.description ?? 'No description available'

// Conditional rendering
{product.featuredImage && (
  <img src={product.featuredImage} alt={product.title} />
)}
```

---

## Generic Types

### Repository Pattern

```typescript
type Repository<T, ID = string> = {
  getById(id: ID): Promise<T | null>
  list(params?: ListParams): Promise<PaginatedResponse<T>>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: ID, data: Partial<T>): Promise<T>
  delete(id: ID): Promise<void>
}

// Example usage
interface ProductRepository extends Repository<Product> {}
```

### Service Response Pattern

```typescript
type ServiceResponse<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

async function safeServiceCall<T>(
  fn: () => Promise<T>
): Promise<ServiceResponse<T>> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
```

---

## Next Steps

- See **[API_REFERENCE.md](./API_REFERENCE.md)** for complete method signatures
- Review **[EXAMPLES.md](./EXAMPLES.md)** for usage examples
- Check **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** for error patterns
