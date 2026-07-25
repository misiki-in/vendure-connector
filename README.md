# @misiki/litekart-connector

[![NPM Version](https://img.shields.io/npm/v/@misiki/litekart-connector.svg)](https://www.npmjs.com/package/@misiki/litekart-connector)
[![NPM Downloads](https://img.shields.io/npm/dm/@misiki/litekart-connector.svg)](https://www.npmjs.com/package/@misiki/litekart-connector)
[![License](https://img.shields.io/npm/l/@misiki/litekart-connector.svg)](https://github.com/misiki/litekart-connector/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@misiki/litekart-connector)](https://bundlephobia.com/result?p=@misiki/litekart-connector)

**The official TypeScript SDK for LiteKart E-commerce Platform**

Production-ready, fully-typed API client for building e-commerce applications with LiteKart backend.

---

## Features

- ✅ **Complete E-commerce Coverage** - Products, cart, orders, payments, users, and more
- ✅ **Fully Typed** - Complete TypeScript definitions with no `any` types
- ✅ **Production Ready** - Battle-tested with error handling and best practices
- ✅ **Tree-Shakable** - Only include services you use
- ✅ **Multiple Payment Gateways** - Razorpay, Stripe, PhonePe, PayPal, Cashfree, COD, Affirm
- ✅ **Advanced Search** - Meilisearch integration with faceted search and autocomplete
- ✅ **Multi-Store Support** - Works with multi-store LiteKart installations
- ✅ **Vendor Marketplace** - Full vendor management capabilities
- ✅ **Singleton Pattern** - Easy dependency management
- ✅ **Comprehensive Docs** - Extensive API docs with examples

---

## Installation

```bash
npm install @misiki/litekart-connector
```

```bash
yarn add @misiki/litekart-connector
```

```bash
pnpm add @misiki/litekart-connector
```

```bash
bun add @misiki/litekart-connector
```

---

## Quick Start

### Basic Example

```typescript
import {
  productService,
  cartService,
  authService,
  checkoutService
} from '@misiki/litekart-connector'

// Featured products
const featured = await productService.listFeaturedProducts({ page: 1 })

// Add to cart
const cart = await cartService.addToCart({
  productId: 'prod_123',
  variantId: 'var_456',
  qty: 2,
  lineId: null
})

// User login
const user = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})
```

### Complete Shopping Flow

```typescript
// Search products
const searchResults = await productService.list({
  search: 'running shoes',
  sort: 'price'
})

// Get product details
const product = await productService.getOne('nike-air-max')

// Add to cart
await cartService.addToCart({
  productId: product.data.id,
  variantId: product.data.variants?.[0].id,
  qty: 1
})

// Apply coupon
await cartService.applyCoupon({
  cartId: cart.id,
  couponCode: 'SAVE20'
})

// Checkout with payment
const checkout = await checkoutService.checkoutRazorpay({
  cartId: cart.id,
  origin: 'https://yourstore.com'
})
```

---

## Core Services

### Authentication
- **authService** - Login, registration, password management, email/phone verification
- **userService** - User profile management (alternative API)

### Products
- **productService** - Product listings, details, featured/trending products, reviews
- **categoryService** - Categories, megamenu, hierarchical navigation
- **bannerService** - Home page banners and promotions
- **blogService** - Blog posts and content
- **collectionService** - Product collections and curated lists

### Shopping Cart
- **cartService** - Add/remove items, apply coupons, cart calculations
- **wishlistService** - Wishlist management with bulk operations

### Orders & Checkout
- **orderService** - Order history, tracking, order details, returns
- **checkoutService** - Payment gateway integrations, shipping rates

### Search
- **searchService** - High-level search API with URL parameter parsing
- **meilisearchService** - Direct Meilisearch access
- **autocompleteService** - Search suggestions and autocomplete

### Payments
- **paymentMethodService** - Available payment methods
- **couponService** - Coupon management and validation

### User Management
- **addressService** - Address book CRUD operations
- **profileService** - User profile and settings

### Store & Vendor
- **storeService** - Multi-store configuration and details
- **vendorService** - Vendor registration and management

### Content
- **menuService** - Navigation menus
- **pageService** - CMS pages
- **faqService** - Frequently asked questions
- **galleryService** - Image galleries
- **reelsService** - Short-form product videos

### Support
- **chatService** - Live chat integration
- **contactService** - Contact forms
- **enquiryService** - Product enquiries
- **feedbackService** - Customer feedback

### Utilities
- **uploadService** - File uploads
- **countryService** / **stateService** / **regionService** - Location data
- **currencyService** - Currency management
- **settingsService** - Store settings
- **initService** - App initialization data

---

## TypeScript Support

Full type safety with zero configuration:

```typescript
import type { Product, Cart, Order, User } from '@misiki/litekart-connector'

const product: Product = await productService.getOne('product-slug')
// TypeScript knows all product properties
console.log(product.data.price)        // number
console.log(product.data.variants)     // Variant[]
console.log(product.data.description) // string | null

const cart: Cart = await cartService.fetchCartData()
console.log(cart.total)                // number
console.log(cart.lineItems)            // CartLineItem[]
console.log(cart.discountAmount)       // number
```

---

## API Reference

Comprehensive API documentation is available in **[DOCS.md](./DOCS.md)**.

### Key Methods

#### Search
```typescript
searchService.searchWithUrl(url: URL, slug?: string)    // URL-based search
searchService.searchWithQuery(query: string)            // Simple text search
```

#### Cart
```typescript
cartService.addToCart({ productId, variantId, qty, lineId? })
cartService.removeCart({ cartId, lineId? })
cartService.applyCoupon({ cartId, couponCode })
cartService.updateCart2({ cartId, shippingAddress, billingAddress, ... })
```

#### Orders
```typescript
orderService.list({ page?, q?, sort? })
orderService.fetchOrder(id: string)
orderService.getOrder(orderNo: string)
```

#### Payments
```typescript
checkoutService.checkoutRazorpay({ cartId, origin })
checkoutService.checkoutStripe({ cartId, origin })
checkoutService.checkoutPhonepe({ cartId, email, phone, origin })
checkoutService.checkoutCOD({ cartId, origin })
checkoutService.getShippingRates({ cartId })
```

#### User
```typescript
authService.login({ email, password, cartId? })
authService.signup({ firstName, lastName, phone, email, password, ... })
authService.forgotPassword({ email, referrer })
authService.updateProfile({ id, firstName, lastName, email, phone, avatar? })
```

---

## Error Handling

```typescript
try {
  const user = await authService.login({ email, password })
} catch (error: any) {
  console.log(error.message)  // User-friendly error
  console.log(error.status)   // HTTP status code
  console.log(error.data)     // Additional error data

  if (error.message.includes('Session expired')) {
    // Redirect to login
  } else if (error.message.includes('internet')) {
    // Show offline message
  }
}
```

---

## Configuration

### Custom Fetch (SSR, Custom Headers)

```typescript
import fetch from 'isomorphic-unfetch'

const customFetch = (url: string, options?: RequestInit) => {
  return fetch(`${process.env.API_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${getToken()}`,
      'Store-ID': getStoreId()
    }
  })
}

// Create service with custom fetch
const productService = new ProductService(customFetch)
```

---

## Best Practices

1. **Use singleton services** - Import pre-instantiated services
   ```typescript
   import { productService } from '@misiki/litekart-connector'
   ```

2. **Handle all errors** - Wrap async calls in try-catch
   ```typescript
   try { await cartService.addToCart(...) } catch (e: any) { /* ... */ }
   ```

3. **Leverage TypeScript types** - Use imported types for better DX
   ```typescript
   import type { Product, Cart } from '@misiki/litekart-connector'
   ```

4. **Batch operations** - Use bulk methods when available
   ```typescript
   wishlistService.checkWishlistInBulk([{ productId, variantId }])
   ```

5. **Cart persistence** - Service auto-manages cart ID in localStorage

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Works with SSR (Next.js, Nuxt.js, etc.) when used with isomorphic fetch.

---

## Framework Examples

### Next.js / React

```typescript
'use client'

import { productService } from '@misiki/litekart-connector'
import { useEffect, useState } from 'react'

export default function ProductPage({ slug }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    productService.getOne(slug).then(setProduct)
  }, [slug])

  return <div>{/* Render product */}</div>
}
```

### Vue / Nuxt

```vue
<script setup>
import { productService } from '@misiki/litekart-connector'
import { ref, onMounted } from 'vue'

const product = ref(null)

onMounted(async () => {
  product.value = await productService.getOne(props.slug)
})
</script>
```

### Svelte

```svelte
<script>
  import { productService } from '@misiki/litekart-connector'
  export let slug

  let product
  productService.getOne(slug).then(p => product = p)
</script>
```

---

## Development

```bash
# Clone repository
git clone https://github.com/misiki/litekart-connector.git
cd litekart-connector

# Install dependencies
npm install

# Build
npm run build

# Watch mode (development)
npm run dev

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test
```

---

## Documentation

- **Full API Reference** - [DOCS.md](./DOCS.md) (comprehensive API documentation)
- **LiteKart Documentation** - https://litekart.in/docs
- **API Reference** - https://litekart.in/api

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing patterns (singleton, JSDoc, TypeScript)
4. Add tests for new functionality
5. Ensure build passes: `npm run build`
6. Submit a Pull Request

---

## License

ISC

---

## Support

- **Documentation**: https://litekart.in/docs/connector
- **Issues**: https://github.com/misiki/litekart-connector/issues
- **Email**: support@litekart.in
- **Discord**: https://discord.gg/litekart

---

## Related Projects

- **[LiteKart](https://github.com/litekart/litekart)** - Headless e-commerce backend
- **[LiteKart Admin](https://github.com/litekart/litekart-admin)** - Admin dashboard
- **[LiteKart Storefront](https://github.com/litekart/litekart-storefront)** - React storefront template

---

**Made with ❤️ by the LiteKart Team**
