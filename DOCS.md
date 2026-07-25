# @misiki/litekart-connector

**Comprehensive API Client for LiteKart E-commerce Platform**

[![npm version](https://litekart.in/logo-litekart.png)](https://litekart.in)
[![NPM License](https://img.shields.io/npm/l/@misiki/litekart-connector.svg)](https://www.npmjs.com/package/@misiki/litekart-connector)
[![NPM Version](https://img.shields.io/npm/v/@misiki/litekart-connector.svg)](https://www.npmjs.com/package/@misiki/litekart-connector)
[![NPM Downloads](https://img.shields.io/npm/dm/@misiki/litekart-connector.svg)](https://www.npmjs.com/package/@misiki/litekart-connector)

> A production-ready, fully-typed TypeScript/JavaScript SDK for building e-commerce applications with LiteKart backend.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [Authentication Services](#authentication-services)
  - [Product Services](#product-services)
  - [Shopping Cart](#shopping-cart)
  - [Order Management](#order-management)
  - [Checkout & Payments](#checkout--payments)
  - [Search & Discovery](#search--discovery)
  - [User Management](#user-management)
  - [Address Management](#address-management)
  - [Categories & Content](#categories--content)
  - [Wishlist](#wishlist)
  - [Reviews & Ratings](#reviews--ratings)
  - [Coupons & Discounts](#coupons--discounts)
  - [Store Management](#store-management)
  - [Vendor Management](#vendor-management)
  - [Additional Services](#additional-services)
- [TypeScript Types Reference](#typescript-types-reference)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**LiteKart Connector** is a comprehensive, type-safe API client library designed to simplify integration with the LiteKart e-commerce backend. It provides a complete set of services covering all aspects of e-commerce operations including product catalog, shopping cart, orders, payments, user management, and more.

### What is LiteKart?

LiteKart is a modern headless e-commerce platform built with Node.js, featuring:
- **Multi-store support** - Manage multiple stores from a single installation
- **Flexible product catalog** with variants, options, and custom designs
- **Advanced search** powered by Meilisearch
- **Multiple payment gateways** (Razorpay, Stripe, PhonePe, PayPal, Cashfree, COD)
- **Comprehensive order management**
- **Vendor management** for marketplace operations
- **Blog, banners, and content management**

### What Does This Connector Provide?

This SDK provides:
- **Fully typed interfaces** for all API responses and request parameters
- **Singleton service pattern** for easy dependency management
- **Built-in error handling** with meaningful error messages
- **Consistent API** across all services
- **TypeScript support** out of the box
- **Tree-shakable** ES modules
- **CommonJS support** for legacy environments

---

## Features

### Complete E-commerce Coverage
- ✅ Product catalog management (products, categories, variants, options)
- ✅ Shopping cart operations (add, update, remove, apply coupons)
- ✅ Order lifecycle management (create, track, update, return)
- ✅ Multiple payment gateway integrations
- ✅ User authentication and profile management
- ✅ Address book management
- ✅ Wishlist functionality
- ✅ Product reviews and ratings
- ✅ Search with Meilisearch
- ✅ Category and menu management
- ✅ Store and vendor management
- ✅ Blog and content management
- ✅ File uploads
- ✅ Real-time chat support

### Developer Experience
- 📘 **Comprehensive TypeScript types** - Full type safety for all operations
- 🔄 **Singleton services** - Easy instantiation and testing
- ⚡ **Async/await** - Modern async API design
- 🛡️ **Error handling** - Consistent error objects with messages
- 📦 **Tree-shakable** - Only include what you use
- 🧪 **Well-tested** - Production-ready codebase
- 📝 **JSDoc annotations** - IDE autocomplete and documentation

---

## Installation

### Using npm

```bash
npm install @misiki/litekart-connector
```

### Using yarn

```bash
yarn add @misiki/litekart-connector
```

### Using pnpm

```bash
pnpm add @misiki/litekart-connector
```

### Using bun

```bash
bun add @misiki/litekart-connector
```

---

## Quick Start

### Basic Usage

```typescript
import { services } from '@misiki/litekart-connector'

// Access individual services
const { productService, cartService, authService } = services

// Or import specific services
import { productService, cartService } from '@misiki/litekart-connector'

// Fetch featured products
const featuredProducts = await productService.listFeaturedProducts({ page: 1 })
console.log(`Found ${featuredProducts.count} featured products`)

// Add item to cart
const cart = await cartService.addToCart({
  productId: 'prod_123',
  variantId: 'var_456',
  qty: 2,
  lineId: null
})
```

### Complete Example: User Shopping Flow

```typescript
import {
  productService,
  cartService,
  authService,
  checkoutService,
  orderService,
  addressService
} from '@misiki/litekart-connector'

async function shoppingFlow() {
  try {
    // 1. Search for products
    const searchResults = await productService.list({
      search: 'running shoes',
      sort: 'price'
    })

    // 2. Get product details
    const product = await productService.getOne('nike-air-max')

    // 3. Add to cart
    const cart = await cartService.addToCart({
      productId: product.data.id,
      variantId: product.data.variants?.[0].id,
      qty: 1
    })

    // 4. Add shipping address
    const address = await addressService.saveAddress({
      firstName: 'John',
      lastName: 'Doe',
      address_1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      countryCode: 'US',
      phone: '1234567890'
    })

    // 5. Update cart with address
    const updatedCart = await cartService.updateCart2({
      cartId: cart.id,
      shippingAddress: address,
      isBillingAddressSameAsShipping: true,
      customer_id: cart.userId
    })

    // 6. Initiate checkout with payment
    const checkout = await checkoutService.checkoutRazorpay({
      cartId: cart.id,
      origin: 'https://yourstore.com'
    })

    console.log('Order created successfully!', checkout)
  } catch (error: any) {
    console.error('Error:', error.message)
  }
}
```

---

## Configuration

### Custom Fetch Implementation

All services accept an optional `fetch` implementation, useful for custom HTTP clients or testing:

```typescript
import { ProductService } from '@misiki/litekart-connector'

// Use a custom fetch (e.g., with axios or node-fetch)
import fetch from 'node-fetch'

const productService = new ProductService(fetch)
const products = await productService.list({ page: 1 })
```

### Setting Base URL

Currently, the services assume your LiteKart backend is running on the same origin. For cross-origin setups, configure your fetch wrapper:

```typescript
const customFetch = (url: string, options?: RequestInit) => {
  const baseURL = 'https://api.litekart.com'
  const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`
  return fetch(fullURL, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })
}

const productService = new ProductService(customFetch)
```

---

## Core Concepts

### Singleton Pattern

All services follow the singleton pattern to ensure a single instance per application:

```typescript
import { productService } from '@misiki/litekart-connector'

// Get instance directly
const instance1 = productService
const instance2 = productService
console.log(instance1 === instance2) // true
```

### Async/Await API

All service methods return Promises and are designed to be used with `async/await`:

```typescript
const result = await productService.getOne('product-slug')
```

### Error Handling

All services use a consistent error object:

```typescript
try {
  const user = await authService.login({ email, password })
} catch (error: any) {
  // Error structure
  console.log(error.message) // User-friendly error message
  console.log(error.status) // HTTP status code if available
  console.log(error.data) // Additional error data from API
}
```

### Pagination

Most list methods support pagination with consistent parameters:

```typescript
const response = await productService.list({
  page: 1,      // Current page (1-based)
  sort: '-createdAt'  // Sort order
})

console.log(response.data)    // Array of items
console.log(response.count)   // Total items
console.log(response.totalPages) // Total pages
```

---

## API Reference

### Authentication Services

#### `authService` (AuthService)

User authentication and account management.

##### `getMe()`
Retrieves the currently authenticated user's profile.

**Endpoint:** `GET /api/admin/users/me`

**Returns:** `Promise<User>`

**Example:**
```typescript
const user = await authService.getMe()
console.log(user.email, user.firstName)
```

##### `getUser(id: string)`
Fetches a user by ID.

**Endpoint:** `GET /api/users/:id`

**Parameters:**
- `id` (string): User ID

**Returns:** `Promise<User>`

##### `signup(userData)`
Registers a new user account.

**Endpoint:** `POST /api/auth/signup`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
  cartId?: string | null
}
```

**Returns:** `Promise<User>`

**Example:**
```typescript
const newUser = await authService.signup({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  password: 'SecurePass123!',
  passwordConfirmation: 'SecurePass123!'
})
```

##### `joinAsVendor(vendorData)`
Registers a new vendor account.

**Endpoint:** `POST /api/auth/join-as-vendor`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  businessName: string
  phone: string
  email: string
  password: string
  cartId?: string | null
  role: string
  origin: string
}
```

**Returns:** `Promise<User>`

##### `joinAsAdmin(adminData)`
Registers a new admin account.

**Endpoint:** `POST /api/auth/join-as-admin`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  businessName: string
  phone: string
  email: string
  password: string
  origin: string
}
```

**Returns:** `Promise<User>`

##### `login(credentials)`
Authenticates user with email and password.

**Endpoint:** `POST /api/auth/login`

**Parameters:**
```typescript
{
  email: string
  password: string
  cartId?: string | null
}
```

**Returns:** `Promise<User>`

**Example:**
```typescript
const user = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})
// User session is automatically managed
```

##### `forgotPassword(recoveryData)`
Initiates password recovery.

**Endpoint:** `POST /api/auth/forgot-password`

**Parameters:**
```typescript
{
  email: string
  referrer: string  // URL for password reset page
}
```

**Returns:** `Promise<User>`

##### `changePassword(passwordData)`
Changes password for authenticated user.

**Endpoint:** `POST /api/admin/auth/change-password`

**Parameters:**
```typescript
{
  old: string    // Current password
  password: string // New password
}
```

**Returns:** `Promise<User>`

##### `resetPassword(resetData)`
Resets password using token.

**Endpoint:** `POST /api/auth/reset-password`

**Parameters:**
```typescript
{
  userId: string
  token: string
  password: string
}
```

**Returns:** `Promise<User>`

##### `getOtp(otpData)`
Requests OTP for phone verification.

**Endpoint:** `POST /api/auth/get-otp`

**Parameters:**
```typescript
{
  phone: string
}
```

**Returns:** `Promise<User>`

##### `verifyOtp(verifyData)`
Verifies phone with OTP.

**Endpoint:** `POST /api/auth/verify-otp`

**Parameters:**
```typescript
{
  phone: string
  otp: string
}
```

**Returns:** `Promise<User>`

##### `logout()`
Logs out current user.

**Endpoint:** `DELETE /api/auth/logout`

**Returns:** `Promise<any>`

##### `updateProfile(profileData)`
Updates user profile.

**Endpoint:** `PUT /api/users/:id`

**Parameters:**
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
}
```

**Returns:** `Promise<User>`

---

### Product Services

#### `productService` (ProductService)

Product catalog management and details.

##### `listFeaturedProducts(options)`
Retrieves featured products.

**Endpoint:** `GET /api/products/featured`

**Parameters:**
```typescript
{
  page?: number = 1
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Product>>`

##### `listTrendingProducts(options)`
Retrieves trending products.

**Endpoint:** `GET /api/products?search=Trending`

**Parameters:**
```typescript
{
  page?: number = 1
  search?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Product>>`

##### `listRelatedProducts(options)`
Retrieves products related to a category.

**Endpoint:** `GET /api/products?categories=:categoryId`

**Parameters:**
```typescript
{
  page?: number = 1
  categoryId?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Product>>`

##### `list(options)`
General product listing with search.

**Endpoint:** `GET /api/products`

**Parameters:**
```typescript
{
  page?: number = 1
  search?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Product>>`

**Example:**
```typescript
const products = await productService.list({
  search: 'nike shoes',
  sort: 'price:asc'
})
```

##### `getOne(slug)`
Gets detailed product information.

**Endpoint:** `GET /api/products/:slug`

**Parameters:**
- `slug` (string): Product slug

**Returns:** `Promise<PaginatedResponse<Product>>`

**Example:**
```typescript
const product = await productService.getOne('nike-air-max-90')
console.log(product.data.description)
console.log(product.data.variants) // Product variants
```

##### `addReview(reviewData)`
Adds a review and rating for a product.

**Endpoint:** `POST /api/products/ratings-and-reviews`

**Parameters:**
```typescript
{
  productId: string
  variantId: string
  review: string
  rating: number  // 1-5
  uploadedImages: string[]  // Array of image URLs
}
```

**Returns:** `Promise<any>`

**Example:**
```typescript
await productService.addReview({
  productId: 'prod_123',
  variantId: 'var_456',
  review: 'Amazing product! Very comfortable.',
  rating: 5,
  uploadedImages: ['https://example.com/review-img1.jpg']
})
```

##### `fetchReels()`
Fetches product-related reels/short videos.

**Endpoint:** `GET /api/reels`

**Returns:** `Promise<any>`

---

### Shopping Cart

#### `cartService` (CartService)

Shopping cart management.

##### `fetchCartData()`
Fetches current user's cart.

**Endpoint:** `GET /api/cart`

**Returns:** `Promise<Cart>`

##### `refereshCart()`
Refreshes cart from server.

**Endpoint:** `GET /api/carts/refresh/:cartId`

**Returns:** `Promise<Cart>`

**Note:** Cart ID is read from `localStorage.getItem('cart_id')`

##### `getCartByCartId(cartId)`
Fetches cart by ID.

**Endpoint:** `GET /api/carts/:id`

**Parameters:**
- `cartId` (string): Cart identifier

**Returns:** `Promise<Cart>`

##### `addToCart(params)`
Adds product to cart or updates quantity.

**Endpoint:** `POST /api/carts/:cartId/line-items`

**Parameters:**
```typescript
{
  productId: string
  variantId: string
  qty: number  // Use -9999999 to remove item
  cartId?: string | null  // Optional, falls back to localStorage
  lineId?: string | null  // Required if updating existing item
}
```

**Returns:** `Promise<Cart>`

**Example:**
```typescript
// Add item to cart
const cart = await cartService.addToCart({
  productId: 'prod_123',
  variantId: 'var_456',
  qty: 2,
  lineId: null
})

// Update quantity
const updatedCart = await cartService.addToCart({
  productId: 'prod_123',
  variantId: 'var_456',
  qty: 3,
  lineId: 'line_item_id'  // From cart.lineItems[].id
})

// Remove item
const cart = await cartService.addToCart({
  productId: 'prod_123',
  variantId: 'var_456',
  qty: -9999999,
  lineId: 'line_item_id'
})
```

##### `removeCart(params)`
Removes item from cart.

**Endpoint:** `DELETE /api/carts/:cartId/line-items/:lineId`

**Parameters:**
```typescript
{
  cartId: string
  lineId?: string | null
}
```

**Returns:** `Promise<Cart>`

##### `applyCoupon(params)`
Applies coupon code to cart.

**Endpoint:** `POST /api/cart/apply-coupon/:cartId`

**Parameters:**
```typescript
{
  cartId: string
  couponCode: string
}
```

**Returns:** `Promise<Cart>`

**Example:**
```typescript
const cart = await cartService.applyCoupon({
  cartId: 'cart_123',
  couponCode: 'SAVE20'
})
console.log(cart.discountAmount) // Discount applied
```

##### `removeCoupon()`
Removes applied coupon.

**Endpoint:** `POST /api/cart/remove-coupon/:cartId`

**Returns:** `Promise<Cart>`

**Note:** Cart ID read from `localStorage`

##### `updateCart2(params)`
Updates cart with addresses and contact info.

**Endpoint:** `PATCH /api/carts/:cartId`

**Parameters:**
```typescript
{
  storeId?: string
  cartId: string
  email?: string
  billingAddress?: Address
  customer_id: string
  shippingAddress?: Address
  phone?: string
  isBillingAddressSameAsShipping: boolean
}
```

**Returns:** `Promise<Cart>`

**Example:**
```typescript
const cart = await cartService.updateCart2({
  cartId: 'cart_123',
  customer_id: 'user_456',
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address_1: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    countryCode: 'US',
    phone: '1234567890'
  },
  isBillingAddressSameAsShipping: true
})
```

##### `completeCart(cart_id)`
Marks cart as complete.

**Endpoint:** `POST /api/carts/:cart_id/complete`

**Parameters:**
- `cart_id` (string): Cart identifier

**Returns:** `Promise<Cart>`

##### `updateCart(params)`
Updates cart line item.

**Endpoint:** `POST /api/carts/:cartId/line-items`

**Parameters:**
```typescript
{
  qty: number
  cartId: string
  lineId?: string | null
  productId: string
  variantId: string
  isSelectedForCheckout?: boolean
}
```

**Returns:** `Promise<Cart>`

##### `updateShippingRate(params)`
Updates shipping method.

**Endpoint:** `PATCH /api/carts/:cartId`

**Parameters:**
```typescript
{
  cartId: string
  shippingRateId: string
}
```

**Returns:** `Promise<Cart>`

---

### Order Management

#### `orderService` (OrderService)

Order lifecycle management.

##### `list(options)`
Retrieves orders with pagination.

**Endpoint:** `GET /api/orders`

**Parameters:**
```typescript
{
  page?: number = 1
  q?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Order>>`

##### `fetchOrder(id)`
Gets order by ID.

**Endpoint:** `GET /api/orders/:id`

**Parameters:**
- `id` (string): Order ID

**Returns:** `Promise<Order>`

##### `getOrder(orderNo)`
Gets order by order number.

**Endpoint:** `GET /api/orders/:orderNo`

**Parameters:**
- `orderNo` (string): Order number

**Returns:** `Promise<Order>`

##### `listOrdersByParent(params)`
Lists orders by parent reference (useful for split orders).

**Endpoint:** `GET /api/orders/list-by-parent`

**Parameters:**
```typescript
{
  orderNo: string | null
  cartId: string | null
}
```

**Returns:** `Promise<PaginatedResponse<Order>>`

##### `fetchTrackOrder(id)`
Fetches order tracking information.

**Endpoint:** `GET /api/orders/list-by-parent?id=:id`

**Parameters:**
- `id` (string): Order/tracking ID

**Returns:** `Promise<PaginatedResponse<Order>>`

##### `listPublic()`
Public order listing (guest order lookup).

**Endpoint:** `GET /api/orders/public/list`

**Returns:** `Promise<PaginatedResponse<Order>>`

##### `getOrderByEmailAndOTP(params)`
Retrieves order using email and OTP for guest access.

**Endpoint:** `GET /api/orders-public/list`

**Parameters:**
```typescript
{
  email: string
  otp: string
}
```

**Returns:** `Promise<PaginatedResponse<Order>>`

##### `submitReview(params)`
Submits review for ordered product.

**Endpoint:** `POST /api/products/ratings-and-reviews`

**Parameters:**
```typescript
{
  rating: number
  review: string
  productId: string
  variantId: string
  uploadedImages?: string[]
}
```

**Returns:** `Promise<any>`

**Example:**
```typescript
await orderService.submitReview({
  rating: 5,
  review: 'Excellent product!',
  productId: 'prod_123',
  variantId: 'var_456',
  uploadedImages: ['https://example.com/img.jpg']
})
```

---

### Checkout & Payments

#### `checkoutService` (CheckoutService)

Payment gateway integrations and checkout flow.

##### `checkoutRazorpay(params)`
Initiates Razorpay checkout.

**Endpoint:** `POST /api/checkout/razorpay`

**Parameters:**
```typescript
{
  cartId: string
  origin: string
}
```

**Returns:** `Promise<Cart>`

##### `captureRazorpayPayment(params)`
Captures Razorpay payment.

**Endpoint:** `POST /api/checkout/razorpay-capture`

**Parameters:**
```typescript
{
  razorpay_order_id: string
  razorpay_payment_id: string
}
```

**Returns:** `Promise<any>`

##### `checkoutCOD(params)`
Cash on Delivery checkout.

**Endpoint:** `POST /api/checkout/cod`

**Parameters:**
```typescript
{
  cartId: string
  origin: string
}
```

**Returns:** `Promise<Cart>`

##### `checkoutPhonepe(params)`
Initiates PhonePe payment.

**Endpoint:** `POST /api/checkout/phonepe`

**Parameters:**
```typescript
{
  cartId: string
  email: string
  phone: string
  origin: string
}
```

**Returns:** `Promise<any>`

##### `capturePhonepePayment(params)`
Captures PhonePe payment.

**Endpoint:** `POST /api/checkout/phonepe-capture`

**Parameters:**
```typescript
{
  phonepe_order_id: string
  phonepe_payment_id: string
}
```

**Returns:** `Promise<any>`

##### `checkoutPaypal(params)`
PayPal checkout.

**Endpoint:** `POST /api/checkout/paypal`

**Parameters:**
```typescript
{
  cartId: string
  origin: string
  return_url: string
}
```

**Returns:** `Promise<any>`

##### `checkoutStripe(params)`
Stripe checkout.

**Endpoint:** `POST /api/checkout/stripe`

**Parameters:**
```typescript
{
  cartId: string
  origin: string
}
```

**Returns:** `Promise<any>`

##### `checkoutStripeCapture(params)`
Captures Stripe payment.

**Endpoint:** `POST /api/checkout/stripe-capture`

**Parameters:**
```typescript
{
  order_no: string
  pg: string
  payment_session_id: string
  storeId: string
}
```

**Returns:** `Promise<any>`

##### `createAffirmPayOrder(params)`
Creates Affirm payment order.

**Endpoint:** `POST /api/affirm-checkout/create-order`

**Parameters:**
```typescript
{
  cartId: string
  addressId: string
  origin: string
  storeId: string
  paymentMethodId: string
}
```

**Returns:** `Promise<any>`

##### `confirmAffirmOrder(params)`
Confirms Affirm payment.

**Endpoint:** `POST /api/checkout/affirm/confirm-order`

**Parameters:**
```typescript
{
  affirmToken: string
  orderId: string
  storeId: string
  origin: string
}
```

**Returns:** `Promise<any>`

##### `cancelAffirmOrder(params)`
Cancels Affirm order.

**Endpoint:** `POST /api/checkout/affirm/cancel-order`

**Parameters:**
```typescript
{
  orderId: string
  storeId: string
  origin: string
}
```

**Returns:** `Promise<any>`

##### `getShippingRates(params)`
Retrieves available shipping rates.

**Endpoint:** `GET /api/shipping-rates/:cartId`

**Parameters:**
```typescript
{
  cartId: string
}
```

**Returns:** `Promise<Checkout>`

**Example:**
```typescript
const shipping = await checkoutService.getShippingRates({
  cartId: 'cart_123'
})
console.log(shipping.shippingRates) // Available shipping options
```

---

### Search & Discovery

#### `searchService` (SearchService)

High-level product search API with Meilisearch integration.

##### `searchWithUrl(url, slug?)`
Search using URL parameters.

**Endpoint:** `GET /api/ms/products`

**Parameters:**
- `url` (URL): URL containing search parameters
- `slug?` (string): Optional category slug override

**Returns:** `Promise<ProductSearchResult>`

**Supported URL Parameters:**
| Parameter | Description | Example |
|-----------|-------------|---------|
| `search` | Main query text | `search=red+shoes` |
| `categories` | Category filter | `categories=footwear` |
| `priceFrom` | Min price | `priceFrom=50` |
| `priceTo` | Max price | `priceTo=200` |
| `tags` | Tag filters | `tags=sale,new` |
| `originCountry` | Country filter | `originCountry=US` |
| `keywords` | Additional keywords | `keywords=comfortable` |
| `page` | Page number | `page=2` |
| `sort` | Sort order | `sort=price:asc` |
| `attributes.*` | Attribute filters | `attributes.color=red` |
| `option.*` | Option filters | `option.size=42` |

**Example:**
```typescript
const url = new URL('https://store.com/search')
url.searchParams.set('search', 'nike shoes')
url.searchParams.set('priceFrom', '50')
url.searchParams.set('priceTo', '200')
url.searchParams.set('categories', 'footwear')

const results = await searchService.searchWithUrl(url)
```

**Return Structure:**
```typescript
{
  data: Product[]           // Matching products
  count: number             // Total matches
  totalPages: number        // Total pages
  categoryHierarchy: Record[] // Category breadcrumbs
  facets: {
    priceStat: { min?, max? }
    categories: [{ name, count }]
    tags: [{ name, count }]
    allFilters?: Record<string, Record<string, number>>
  }
}
```

##### `searchWithQuery(query)`
Simple text search.

**Endpoint:** `GET /api/ms/products?search=:query`

**Parameters:**
- `query` (string): Search query

**Returns:** `Promise<ProductSearchResult>`

**Example:**
```typescript
const results = await searchService.searchWithQuery('red running shoes')
console.log(`Found ${results.count} products`)
console.log(results.facets.categories) // Available category filters
```

---

### Categories & Content

#### `categoryService` (CategoryService)

Category management and navigation.

##### `fetchFooterCategories(params)`
Pagination-enabled category listing.

**Endpoint:** `GET /api/categories`

**Parameters:**
```typescript
{
  page?: number = 1
  q?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Category>>`

##### `fetchFeaturedCategories(params)`
Gets featured categories.

**Endpoint:** `GET /api/categories/featured`

**Parameters:**
```typescript
{
  limit?: number = 100
}
```

**Returns:** `Promise<PaginatedResponse<Category>>`

##### `fetchCategory(id)`
Gets category by slug/handle.

**Endpoint:** `GET /api/product-categories?handle=:id`

**Parameters:**
- `id` (string): Category slug/ID

**Returns:** `Promise<Category>`

##### `fetchAllCategories()`
Gets all categories.

**Endpoint:** `GET /api/categories`

**Returns:** `Promise<PaginatedResponse<Category>>`

##### `fetchAllProductsOfCategories(id)`
Gets products in a category.

**Endpoint:** `GET /api/product-categories?handle=:id`

**Parameters:**
- `id` (string): Category ID/slug

**Returns:** `Promise<PaginatedResponse<Category>>`

##### `getMegamenu()`
Retrieves megamenu structure.

**Endpoint:** `GET /api/categories/megamenu`

**Returns:** `Promise<PaginatedResponse<Category>>`

---

### User Management

#### `userService` (UserService)

Alternative user management (similar to authService).

##### `getMe()`
Get current user.

**Endpoint:** `GET /api/users/me`

**Returns:** `Promise<User>`

##### `getUser(id)`
Get user by ID.

**Endpoint:** `GET /api/users/:id`

**Parameters:**
- `id` (string): User ID

**Returns:** `Promise<User>`

##### `signup(userData)`
User registration.

**Endpoint:** `POST /api/auth/signup`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string | null
  cartId?: string | null
  origin: string
}
```

**Returns:** `Promise<User>`

##### `login(credentials)`
User login.

**Endpoint:** `POST /api/auth/login`

**Parameters:**
```typescript
{
  email: string
  password: string
  cartId?: string | null
}
```

**Returns:** `Promise<any>`

##### `forgotPassword(params)`
Password reset request.

**Endpoint:** `POST /api/auth/forgot-password`

**Parameters:**
```typescript
{
  email: string
  referrer: string
}
```

**Returns:** `Promise<any>`

##### `logout()`
Logout user.

**Endpoint:** `DELETE /api/auth/logout`

**Returns:** `Promise<any>`

##### `updateProfile(params)`
Update profile.

**Endpoint:** `PUT /api/admin/users/:id`

**Parameters:**
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
}
```

**Returns:** `Promise<User>`

##### `joinAsVendor(vendorData)`
Vendor registration.

**Endpoint:** `POST /api/auth/join-as-vendor`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  businessName: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
  cartId?: string | null
  origin: string
}
```

**Returns:** `Promise<User>`

##### `changePassword(body)`
Change password.

**Endpoint:** `POST /api/auth/change-password`

**Parameters:**
```typescript
{
  old: string
  password: string
}
```

**Returns:** `Promise<User>`

##### `resetPassword(params)`
Reset password with token.

**Endpoint:** `POST /api/auth/reset-password`

**Parameters:**
```typescript
{
  userId: string
  token: string
  password: string
}
```

**Returns:** `Promise<User>`

##### `getOtp(params)`
Request OTP verification.

**Endpoint:** `POST /api/auth/get-otp`

**Parameters:**
```typescript
{
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
}
```

**Returns:** `Promise<{ otp: string }>`

##### `verifyOtp(params)`
Verify OTP.

**Endpoint:** `POST /api/auth/verify-otp`

**Parameters:**
```typescript
{
  phone: string
  otp: string
}
```

**Returns:** `Promise<User>`

##### `checkEmail(email)`
Check email availability.

**Endpoint:** `POST /api/users/check-email`

**Parameters:**
- `email` (string): Email to check

**Returns:** `Promise<any>`

##### `deleteUser(id)`
Delete user account.

**Endpoint:** `DELETE /api/delete/user/:id`

**Parameters:**
- `id` (string): User ID

**Returns:** `Promise<any>`

---

### Address Management

#### `addressService` (AddressService)

User address book management.

##### `list(params)`
List user addresses with pagination.

**Endpoint:** `GET /api/address`

**Parameters:**
```typescript
{
  page?: number = 1
  q?: string = ''
  sort?: string = '-createdAt'
  user?: string = ''
}
```

**Returns:** `Promise<PaginatedResponse<Address>>`

##### `fetchAddress(id)`
Get address by ID.

**Endpoint:** `GET /api/address/:id`

**Parameters:**
- `id` (string): Address ID

**Returns:** `Promise<Address>`

##### `saveAddress(address)`
Create new address.

**Endpoint:** `POST /api/address/me`

**Parameters:** `Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'active'>`

**Returns:** `Promise<Address>`

**Example:**
```typescript
const address = await addressService.saveAddress({
  firstName: 'John',
  lastName: 'Doe',
  address_1: '123 Main St',
  address_2: 'Apt 4B',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  countryCode: 'US',
  phone: '1234567890',
  email: 'john@example.com',
  isPrimary: true,
  isResidential: true
})
```

##### `editAddress(id, address)`
Update existing address.

**Endpoint:** `PUT /api/address/me/:id`

**Parameters:**
- `id` (string): Address ID
- `address` (Partial<Address>): Address fields to update

**Returns:** `Promise<Address>`

##### `deleteAddress(id)`
Delete address.

**Endpoint:** `DELETE /api/address/:id`

**Parameters:**
- `id` (string): Address ID

**Returns:** `Promise<void>`

---

### Wishlist

#### `wishlistService` (WishlistService)

Wishlist management.

##### `fetchWishlist(params)`
Gets user's wishlist.

**Endpoint:** `GET /api/wishlists/me`

**Parameters:**
```typescript
{
  q?: string = ''
  sort?: string = ''
  page?: number = 1
}
```

**Returns:** `Promise<PaginatedResponse<Wishlist>>`

##### `checkWishlist(params)`
Checks if product is in wishlist.

**Endpoint:** `GET /api/wishlists/me/check`

**Parameters:**
```typescript
{
  productId: string
  variantId: string
}
```

**Returns:** `Promise<boolean>`

**Example:**
```typescript
const isInWishlist = await wishlistService.checkWishlist({
  productId: 'prod_123',
  variantId: 'var_456'
})
```

##### `checkWishlistInBulk(ids)`
Bulk check wishlist status.

**Endpoint:** `POST /api/wishlists/me/bulk-check`

**Parameters:**
```typescript
{ productId: string, variantId: string }[]
```

**Returns:** `Promise<{ productId: string, variantId: string, exists: boolean }[]>`

##### `toggleWishlist(params)`
Add/remove product from wishlist.

**Endpoint:** `POST /api/wishlists/me/toggle`

**Parameters:**
```typescript
{
  productId: string
  variantId: string
}
```

**Returns:** `Promise<Wishlist>`

**Example:**
```typescript
// Toggle - adds if not present, removes if present
const wishlist = await wishlistService.toggleWishlist({
  productId: 'prod_123',
  variantId: 'var_456'
})
```

---

### Reviews & Ratings

#### `reviewService` (ReviewService)

Product review management.

##### `fetchReviews(params)`
Gets user's own reviews.

**Endpoint:** `GET /api/reviews/me`

**Parameters:**
```typescript
{
  productId: string
  search?: string = ''
  sort?: string = '-createdAt'
  currentPage?: number = 1
}
```

**Returns:** `Promise<PaginatedResponse<Feedback>>`

##### `fetchProducrReviews(productId)`
Gets all reviews for a product.

**Endpoint:** `GET /api/reviews?product-id=:productId`

**Parameters:**
- `productId` (string): Product ID

**Returns:** `Promise<PaginatedResponse<Feedback>>`

##### `allReviews(params)`
Gets all reviews in system.

**Endpoint:** `GET /api/products/all-ratings`

**Parameters:**
```typescript
{
  search?: string = ''
  sort?: string = '-createdAt'
  currentPage?: number = 1
}
```

**Returns:** `Promise<PaginatedResponse<Feedback>>`

##### `saveReview(review)`
Creates new review.

**Endpoint:** `POST /api/reviews`

**Parameters:** `Omit<Feedback, 'id'>`

**Returns:** `Promise<Feedback>`

**Example:**
```typescript
await reviewService.saveReview({
  productId: 'prod_123',
  rating: 5,
  review: 'Excellent product quality!',
  userId: 'user_456'
})
```

---

### Coupons & Discounts

#### `couponService` (CouponService)

Coupon and discount management.

##### `listCoupons(options)`
Lists coupons with pagination.

**Endpoint:** `GET /api/coupons`

**Parameters:**
```typescript
{
  page?: number = 1
  q?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Coupon>>`

##### `searchCoupons(params)`
Search coupons.

**Endpoint:** `GET /api/coupons`

**Parameters:**
```typescript
{
  page?: number = 1
  q?: string = ''
  sort?: string = '-createdAt'
}
```

**Returns:** `Promise<PaginatedResponse<Coupon>>`

##### `getCoupon(id)`
Gets coupon by ID.

**Endpoint:** `GET /api/coupons/:id`

**Parameters:**
- `id` (string): Coupon ID

**Returns:** `Promise<Coupon>`

##### `createCoupon(coupon)`
Creates new coupon.

**Endpoint:** `POST /api/coupons`

**Parameters:** `Omit<Coupon, 'id'>`

**Returns:** `Promise<Coupon>`

##### `patchCoupon(id, coupon)`
Updates coupon.

**Endpoint:** `PUT /api/coupons/:id`

**Parameters:**
- `id` (string): Coupon ID
- `coupon` (Partial<Coupon>): Fields to update

**Returns:** `Promise<Coupon>`

##### `deleteCoupon(id)`
Deletes coupon.

**Endpoint:** `DELETE /api/coupons/:id`

**Parameters:**
- `id` (string): Coupon ID

**Returns:** `Promise<Coupon>`

---

### Store Management

#### `storeService` (StoreService)

Multi-store operations.

##### `getStoreByIdOrDomain(params)`
Retrieves store details.

**Endpoint:** `GET /api/stores/public-details`

**Parameters:**
```typescript
{
  storeId?: string
  domain?: string
}
```

**Returns:** `Promise<StoreDetails>`

**Example:**
```typescript
// Get by store ID
const store = await storeService.getStoreByIdOrDomain({
  storeId: 'store_123'
})

// Get by domain
const store = await storeService.getStoreByIdOrDomain({
  domain: 'mystore.example.com'
})

console.log(store.name)
console.log(store.settings?.currency)
console.log(store.contact?.email)
```

---

### Vendor Management

#### `vendorService` (VendorService)

Vendor operations for marketplace.

##### `save(data)`
Creates new vendor.

**Endpoint:** `POST /api/vendors`

**Parameters:** `Partial<Vendor>`

**Returns:** `Promise<Vendor>`

##### `update(data)`
Updates vendor.

**Endpoint:** `PUT /api/vendors/:id`

**Parameters:** `Partial<Vendor> & { id: string }`

**Returns:** `Promise<Vendor>`

---

### Additional Services

#### `bannerService` (BannerService)
- `list()` - `GET /api/banners`
- `getById(id)` - `GET /api/banners/:id`

#### `blogService` (BlogService)
- `list()` - `GET /api/blogs`
- `getBySlug(slug)` - `GET /api/blogs/:slug`
- `featured()` - `GET /api/blogs/featured`

#### `menuService` (MenuService)
- `getMenu()` - `GET /api/menus`
- `getByType(type)` - `GET /api/menus/:type`

#### `faqService` (FaqService)
- `list()` - `GET /api/faqs`
- `getByCategory(category)` - `GET /api/faqs/category/:category`

#### `galleryService` (GalleryService)
- `list()` - `GET /api/galleries`
- `getById(id)` - `GET /api/galleries/:id`

#### `uploadService` (UploadService)
- `uploadFile(file)` - `POST /api/upload`
- `deleteFile(fileId)` - `DELETE /api/upload/:id`

#### `contactService` (ContactService)
- `submitContact(formData)` - `POST /api/contact`

#### `enquiryService` (EnquiryService)
- `submitEnquiry(enquiryData)` - `POST /api/enquiry`

#### `feedbackService` (FeedbackService)
- `submitFeedback(feedbackData)` - `POST /api/feedback`

#### `countryService` (CountryService)
- `listCountries()` - `GET /api/countries`
- `getCountryByCode(code)` - `GET /api/countries/:code`

#### `stateService` (StateService)
- `listStates(countryCode?)` - `GET /api/states`
- `getState(id)` - `GET /api/states/:id`

#### `regionService` (RegionService)
- `listRegions()` - `GET /api/regions`
- `getRegion(id)` - `GET /api/regions/:id`

#### `currencyService` (CurrencyService)
- `listCurrencies()` - `GET /api/currencies`
- `getDefaultCurrency()` - `GET /api/currencies/default`

#### `paymentMethodService` (PaymentMethodService)
- `list(params)` - `GET /api/payment-methods`

#### `settingsService` (SettingsService)
- `getSettings()` - `GET /api/settings`
- `updateSettings(settings)` - `PUT /api/settings`

#### `homeService` (HomeService)
- `getHomeData()` - `GET /api/home`
- Components for homepage sections

#### `chatService` (ChatService)
- `sendMessage(message)` - `POST /api/chat`
- `getConversation()` - `GET /api/chat`

#### `popularityService` (PopularityService)
- `trackView(productId)` - `POST /api/popularity/view`
- `getPopularItems(limit?)` - `GET /api/popularity`

#### `autocompleteService` (AutocompleteService)
- `search(query)` - `GET /api/autocomplete`
- Uses Meilisearch for instant suggestions

#### `initService` (InitService)
- `getInitialData()` - `GET /api/init`
- Fetches initial app configuration

#### `pluginsService` (PluginsService)
- `listPlugins()` - `GET /api/plugins`
- Plugin management for extended functionality

#### `dealService` (DealService)
- `getDeals(params)` - `GET /api/deals`
- Flash sales and limited-time offers

#### `reelsService` (ReelsService)
- `getReels(params)` - `GET /api/reels`
- Product video reels
- `getProductReels(productId)` - `GET /api/reels/product/:id`

#### `pageService` (PageService)
- `getPageBySlug(slug)` - `GET /api/pages/:slug`
- Custom page content

#### `customDesignService` (VarniCustomDesignService)
- `createDesign(design)` - `POST /api/custom-designs`
- `getDesign(id)` - `GET /api/custom-designs/:id`
- Custom product design upload and management

#### `customProductService` (VarniCustomProductService)
- `listCustomProducts(params)` - `GET /api/custom-products`
- `createCustomProduct(data)` - `POST /api/custom-products`
- Custom product variant management

---

## TypeScript Types Reference

### Core Types

#### `PaginatedResponse<T>`
```typescript
type PaginatedResponse<T> = {
  data: T[]
  count: number
  pageSize: number
  noOfPage: number
  page: number
}
```

#### `ProductStatus`
```typescript
enum ProductStatus {
  DRAFT = 'draft'
  PROPOSED = 'proposed'
  PUBLISHED = 'published'
  REJECTED = 'rejected'
}
```

### Main Entities

#### `Product`
```typescript
type Product = {
  // Basic Info
  id: string
  title: string
  subtitle?: string
  slug?: string
  description?: string
  active: boolean
  status: ProductStatus
  type: string
  vendorId: string
  categoryId?: string | null

  // Media
  images?: string | null
  featuredImage?: string | null
  thumbnail?: string | null

  // Pricing
  mrp: number
  price: number
  costPerItem: number

  // Inventory
  stock: number
  allowBackorder: boolean
  manageInventory: boolean
  sku?: string | null
  barcode?: string | null

  // SEO
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null

  // Dimensions
  weight?: number | null
  shippingWeight?: number | null
  shippingHeight?: number | null
  shippingLen?: number | null
  shippingWidth?: number | null
  height?: number | null
  width?: number | null
  len?: number | null
  weightUnit: string
  dimensionUnit: string

  // Additional
  originCountry?: string | null
  instructions?: string | null
  hsnCode?: string | null
  returnAllowed: boolean
  replaceAllowed: boolean
  shippingCost?: number | null
  collectionId?: string | null
  metadata?: Record<string, unknown> | null

  // Variants
  options?: { id: string; title: string; type: string; values: { id: string; value: string }[] }[]
  variants?: Variant[]

  // Timestamps
  createdAt: string
  updatedAt: string
}
```

#### `Cart` & `CartLineItem`
```typescript
type Cart = {
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

  // Payment
  couponCode: string | null
  discountAmount: number
  couponAppliedDate: string | null
  paymentId: string | null
  paymentMethod: string | null
  paymentAuthorizedAt: string | null

  // Totals
  qty: number
  subtotal: number
  shippingCharges: number
  codCharges: number
  tax: number
  total: number
  savingAmount: number

  // Metadata
  needAddress: boolean
  isCodAvailable: boolean
  type: string
  completedAt: string | null
  idempotencyKey: string | null
  shippingMethod: string | null
}

type CartLineItem = {
  id: string
  productId: string
  variantId: string
  qty: number
  price: number
  total: number
}
```

#### `Order`
```typescript
type Order = {
  id: string
  orderNo: number
  storeId?: string | null
  batchNo?: string | null
  amount?: Record<string, any> | null
  parentOrderNo?: string | null
  vendorId: string
  isEmailSentToVendor: boolean
  status: string
  cartId: string
  userId?: string | null
  userPhone?: string | null
  userFirstName?: string | null
  userLastName?: string | null
  userEmail?: string | null
  comment?: string | null
  needAddress: boolean
  selfTakeout: boolean
  shippingCharges: number
  total?: number | null
  subtotal?: number | null
  discount?: number | null
  tax?: number | null
  currencySymbol?: string | null
  currencyCode?: string | null
  codCharges?: number | null
  codPaid?: number | null
  paid: boolean
  paySuccess: number
  amountRefunded?: number | null
  amountDue?: number | null
  amountPaid?: number | null
  totalDiscount?: number | null
  totalAmountRefunded?: number | null
  paymentMethod?: string | null
  platform?: string | null
  couponUsed?: string | null
  coupon?: string | null
  paymentStatus?: string | null
  paymentCurrency?: string | null
  paymentMsg?: string | null
  paymentReferenceId?: string | null
  paymentGateway?: string | null
  paymentId?: string | null
  paymentAmount?: number | null
  paymentMode?: string | null
  paymentDate?: string | null
  shippingAddressId?: string | null
  billingAddressId?: string | null
}
```

#### `User`
```typescript
type User = {
  id: string
  phone?: string | null
  email: string
  status?: string | null
  avatar?: string | null
  cartId?: string | null
  verifiedAt?: string | null
  currentSignInAt?: string | null
  currentSignInIp?: string | null
  firstName?: string | null
  lastName?: string | null
  ipCity?: string | null
  ipCountry?: string | null
  ipLatitude?: number | null
  ipLongitude?: number | null
  ipRegion?: string | null
  ipTimezone?: string | null
  isApproved: boolean
  isDeleted: boolean
  lastSignInAt?: string | null
  lastSignInIp?: string | null
  lastSignIn?: string | null
  otp?: string | null
  otpAttempt: number
  otpTime?: string | null
  password?: string | null
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role?: string | null
  signInCount: number
  userAuthToken?: string | null
  createdAt: string
  updatedAt: string
}
```

#### `Address`
```typescript
type Address = {
  id: string
  userId: string
  firstName: string
  lastName: string
  address_1: string
  address_2?: string
  city: string
  landmark?: string
  state: string
  zip: string
  countryCode: string
  phone: string
  email?: string
  isPrimary: boolean
  isResidential: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}
```

#### `Category`
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

#### `Coupon`
```typescript
type Coupon = {
  id: string
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
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

#### `Wishlist`
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

#### `Feedback` (Reviews)
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

#### `StoreDetails`
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

#### `Variant`
```typescript
type Variant = {
  id: string
  productId: string
  title: string
  sku?: string
  price: number
  mrp?: number
  costPerItem?: number
  stock: number
  images?: string[]
  weight?: number
  barcode?: string
  allowBackorder: boolean
  manageInventory: boolean
  options: { id: string; value: string }[]
  dimensions?: {
    height?: number
    width?: number
    length?: number
    weight?: number
  }
  createdAt: string
  updatedAt: string
}
```

#### `ProductSearchResult`
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
    categories: { name: string; count: number }[]
    tags: { name: string; count: number }[]
    allFilters?: Record<string, Record<string, number>>
  }
}
```

#### `MeilisearchResponse`
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

## Error Handling

All service methods wrap errors in a consistent format:

```typescript
try {
  const user = await authService.login({ email, password })
} catch (error: any) {
  // Standardized error structure
  console.error(error.message)  // User-friendly message
  console.error(error.status)   // HTTP status code
  console.error(error.data)     // Additional error data from API

  // Handle specific error types
  if (error.message === 'Session expired. Please login again') {
    // Redirect to login
  } else if (error.message.includes('internet')) {
    // Show offline message
  }
}
```

### Common Error Messages

| Message | Cause | Action |
|---------|-------|--------|
| `Session expired. Please login again` | 401 Unauthorized | Re-authenticate user |
| `Please check your internet connection` | Offline | Show connection error |
| `Unable to reach the server` | Network/server error | Retry or show error |
| `Something went wrong` | Generic 4xx/5xx | Display error to user |
| Validation errors | 422 Unprocessable Entity | Show field-specific errors |

---

## Best Practices

### 1. Singleton Usage

Always use the exported singleton instances:

```typescript
// ✅ Good
import { productService } from '@misiki/litekart-connector'
const products = await productService.list({})

// ❌ Avoid
import { ProductService } from '@misiki/litekart-connector'
const service = new ProductService()  // Creates new instance
```

### 2. Error Handling

Always wrap async calls in try-catch:

```typescript
async function getProducts() {
  try {
    const result = await productService.list({ page: 1 })
    return result
  } catch (error: any) {
    console.error('Failed to fetch products:', error.message)
    throw error  // Re-throw if needed upstream
  }
}
```

### 3. Cart Persistence

The cart service uses `localStorage` to maintain cart ID:

```typescript
// Cart ID is automatically stored/retrieved
// Ensure localStorage is accessible
if (typeof localStorage !== 'undefined') {
  const cart = await cartService.addToCart({ /* ... */ })
}
```

### 4. Type Safety

Leverage TypeScript types for better DX:

```typescript
import type { Product, PaginatedResponse } from '@misiki/litekart-connector'

async function handleProducts(): Promise<PaginatedResponse<Product>> {
  return await productService.list({ page: 1 })
}
```

### 5. Search Optimization

Use the high-level search API for better UX:

```typescript
// ✅ Parse URL parameters automatically
const url = new URL(`${window.location.origin}/search?search=shoes&priceFrom=50`)
const results = await searchService.searchWithUrl(url)

// Access facets for filtering UI
const priceRange = results.facets.priceStat
const categories = results.facets.categories
```

### 6. Payment Flow

Handle payment callbacks properly:

```typescript
// After payment gateway redirects back
const paymentResult = await checkoutService.captureRazorpayPayment({
  razorpay_order_id: orderId,
  razorpay_payment_id: paymentId
})

// Verify order status
const order = await orderService.getOrder(orderNo)
if (order.paid) {
  // Show success
}
```

### 7. Address Management

Reuse addresses in checkout:

```typescript
// Save address first
const address = await addressService.saveAddress(addressData)

// Then use in cart
const cart = await cartService.updateCart2({
  cartId,
  shippingAddress: address,
  customer_id: userId,
  isBillingAddressSameAsShipping: true
})
```

### 8. Batch Operations

Use bulk check operations when possible:

```typescript
// ❌ Multiple individual calls
const check1 = await wishlistService.checkWishlist({ productId: '1', variantId: 'a' })
const check2 = await wishlistService.checkWishlist({ productId: '2', variantId: 'b' })

// ✅ Bulk check
const results = await wishlistService.checkWishlistInBulk([
  { productId: '1', variantId: 'a' },
  { productId: '2', variantId: 'b' }
])
```

---

## Examples

### Product Catalog with Search

```typescript
import {
  productService,
  searchService,
  categoryService
} from '@misiki/litekart-connector'

async function ProductCatalogPage({ categorySlug }: { categorySlug?: string }) {
  // Get category info
  let category = null
  if (categorySlug) {
    category = await categoryService.fetchCategory(categorySlug)
  }

  // Get products with URL-based search (reacts to query params)
  const url = new URL(window.location.href)
  const searchResults = await searchService.searchWithUrl(url, categorySlug)

  return (
    <div>
      <h1>{category?.name || 'All Products'}</h1>

      {/* Facets/Filters */}
      <aside>
        <h3>Price Range</h3>
        <input
          type="range"
          min={searchResults.facets.priceStat.min}
          max={searchResults.facets.priceStat.max}
          onChange={/* update URL params */}
        />

        <h3>Categories</h3>
        {searchResults.facets.categories.map(cat => (
          <label key={cat.name}>
            <input type="checkbox" name="categories" value={cat.name} />
            {cat.name} ({cat.count})
          </label>
        ))}
      </aside>

      {/* Product Grid */}
      <div className="product-grid">
        {searchResults.data.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={searchResults.totalPages}
      />
    </div>
  )
}
```

### Shopping Cart Page

```typescript
import {
  cartService,
  productService,
  couponService,
  checkoutService
} from '@misiki/litekart-connector'

async function CartPage() {
  // Get cart
  const cart = await cartService.fetchCartData()

  // Calculate totals
  const subtotal = cart.lineItems.reduce((sum, item) => sum + item.total, 0)
  const discount = cart.discountAmount
  const shipping = cart.shippingCharges
  const tax = cart.tax
  const total = cart.total

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart.lineItems.map(item => {
        const product = cart.lineItems.find(p => p.id === item.productId)
        return (
          <CartItem
            key={item.id}
            item={item}
            product={product}
            onUpdate={async (qty) => {
              await cartService.addToCart({
                productId: item.productId,
                variantId: item.variantId,
                qty,
                lineId: item.id
              })
            }}
            onRemove={async () => {
              await cartService.addToCart({
                productId: item.productId,
                variantId: item.variantId,
                qty: -9999999,
                lineId: item.id
              })
            }}
          />
        )
      })}

      <div className="summary">
        <h3>Order Summary</h3>
        <p>Subtotal: {subtotal}</p>
        {discount > 0 && <p>Discount: -{discount}</p>}
        <p>Shipping: {shipping}</p>
        <p>Tax: {tax}</p>
        <h4>Total: {total}</h4>

        {/* Coupon Input */}
        <CouponInput onApply={async (code) => {
          await cartService.applyCoupon({
            cartId: cart.id,
            couponCode: code
          })
        }} />

        {/* Checkout Button */}
        <button onClick={async () => {
          const checkout = await checkoutService.checkoutRazorpay({
            cartId: cart.id,
            origin: window.location.origin
          })
          // Redirect to payment gateway
          window.location.href = checkout.paymentUrl
        }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
```

### User Registration Flow

```typescript
import {
  authService,
  addressService,
  cartService
} from '@misiki/litekart-connector'

async function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Get current cart ID
      const cartId = localStorage.getItem('cart_id')

      // Register user
      const user = await authService.signup({
        ...formData,
        cartId
      })

      // Save default address if provided
      if (formData.address) {
        await addressService.saveAddress({
          userId: user.id,
          ...formData.address
        })
      }

      // Redirect to dashboard or continue to checkout
      router.push('/dashboard')
    } catch (error: any) {
      // Show validation errors
      setErrors(error.data?.errors || {})
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" onChange={/* update */} />
      <input name="email" type="email" onChange={/* update */} />
      {/* ... other fields */}
      <button type="submit">Register</button>
    </form>
  )
}
```

### Order History

```typescript
import { orderService } from '@misiki/litekart-connector'

async function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadOrders() {
      const result = await orderService.list({ page })
      setOrders(result.data)
    }
    loadOrders()
  }, [page])

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map(order => (
        <OrderCard key={order.id} order={order}>
          <p>Order #: {order.orderNo}</p>
          <p>Status: {order.status}</p>
          <p>Total: {order.total} {order.currencySymbol}</p>
          <p>Items: {order.lineItems?.length || 0}</p>
        </OrderCard>
      ))}
      <Pagination
        currentPage={page}
        totalPages={/* get from response */}
        onPageChange={setPage}
      />
    </div>
  )
}
```

### Review Submission

```typescript
import { orderService, productService } from '@misiki/litekart-connector'

async function ReviewForm({ orderId, productId }: { orderId: string; productId: string }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = async () => {
    // Get order to find variant
    const order = await orderService.fetchOrder(orderId)
    const orderItem = order.lineItems.find(item => item.productId === productId)

    await orderService.submitReview({
      rating,
      review,
      productId,
      variantId: orderItem.variantId,
      uploadedImages: images
    })

    alert('Review submitted successfully!')
  }

  return (
    <div>
      <h3>Write a Review</h3>
      <StarRating rating={rating} onRate={setRating} />
      <textarea value={review} onChange={e => setReview(e.target.value)} />
      <ImageUpload onUpload={setImages} />
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  )
}
```

---

## Advanced Usage

### Custom HTTP Client

Use a custom fetch for SSR or custom headers:

```typescript
// next.js example
import fetch from 'isomorphic-unfetch'

const customFetch = (url: string, options?: RequestInit) => {
  const baseUrl = process.env.NEXT_PUBLIC_LITEKART_URL

  return fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${getToken()}`,
      'Store-ID': getStoreId()
    }
  })
}

// Create services with custom fetch
const productService = new ProductService(customFetch)
const cartService = new CartService(customFetch)
```

### Testing with Mocks

```typescript
// Mock implementation for tests
const mockFetch = jest.fn()
const productService = new ProductService(mockFetch)

// Mock response
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: () => Promise.resolve({
    data: [{ id: '1', title: 'Test Product' }],
    count: 1,
    totalPages: 1
  })
})

const result = await productService.list({})
expect(result.data).toHaveLength(1)
```

### Batch Requests with Promise.all

```typescript
// Fetch multiple resources in parallel
const [products, categories, cart] = await Promise.all([
  productService.listFeaturedProducts({ page: 1 }),
  categoryService.fetchFeaturedCategories({ limit: 10 }),
  cartService.fetchCartData()
])
```

### Middleware-like Pattern

```typescript
// Create enhanced service with logging
function createLoggedService(ServiceClass: any) {
  return class LoggedService extends ServiceClass {
    async get<T>(url: string): Promise<T> {
      console.log(`GET ${url}`)
      const start = Date.now()
      const result = await super.get<T>(url)
      console.log(`GET ${url} completed in ${Date.now() - start}ms`)
      return result
    }

    async post<T>(url: string, data: any): Promise<T> {
      console.log(`POST ${url}`, data)
      return super.post<T>(url, data)
    }
  }
}

const loggedProductService = new (createLoggedService(ProductService))()
```

---

## Migration Guide

### From v1.x to v2.x

**Breaking Changes:**

1. **Singleton Pattern**
   - Old: `new ProductService()`
   - New: `productService` (import singleton)

2. **Return Types**
   - Old: Plain objects with no type safety
   - New: Typed `PaginatedResponse<T>` for list methods

3. **Search API**
   - Old: Direct API calls
   - New: High-level `searchService` with URL parameter parsing

4. **Cart Operations**
   - Old: Multiple service calls for cart updates
   - New: Consolidated `updateCart2` for address management

**Migration Steps:**

```typescript
// v1.x
import { ProductService } from '@misiki/litekart-connector'
const products = await new ProductService().list()

// v2.x
import { productService } from '@misiki/litekart-connector'
const result = await productService.list({})
// result.data contains products
// result.count for pagination
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the existing patterns** - singleton pattern, JSDoc comments
4. **Add tests** for new functionality
5. **Ensure TypeScript compiles**: `npm run build`
6. **Submit a Pull Request** with detailed description

### Development Setup

```bash
git clone https://github.com/misiki/litekart-connector.git
cd litekart-connector
npm install
npm run dev  # Watch mode with tsup
npm run build
```

### Code Style

This project uses Biome for code formatting and linting:

```bash
npm run format  # Format code
npm run lint    # Lint code
```

---

## License

ISC

---

## Support

- **Documentation**: https://litekart.in/docs/connector
- **Issues**: https://github.com/misiki/litekart-connector/issues
- **Email**: support@litekart.in
- **Discord**: [Join our Discord](https://discord.gg/litekart)

---

## Related Projects

- **[LiteKart Core](https://github.com/litekart/litekart)** - The headless e-commerce backend
- **[LiteKart Admin](https://github.com/litekart/litekart-admin)** - Admin dashboard
- **[LiteKart Storefront](https://github.com/litekart/litekart-storefront)** - React storefront template

---

## Changelog

### v2.0.26 (Latest)

- Added Varni custom design and product services
- Added `wishlistService.checkWishlistInBulk` for performance
- Updated TypeScript types
- Improved error handling

### v2.0.25

- Added `orderService.submitReview`
- Performance improvements
- Bug fixes

### v2.0.24

- Added meilisearch autocomplete
- Improved search facets
- Enhanced pagination types

[View full changelog](CHANGELOG.md)

---

**Made with ❤️ by the LiteKart Team**
