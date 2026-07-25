# Quick Start Guide

Get up and running with LiteKart Connector in 15 minutes!

---

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun
- A LiteKart backend instance
- Basic TypeScript/JavaScript knowledge

---

## Step 1: Installation

```bash
npm install @misiki/litekart-connector
```

---

## Step 2: Basic Setup

### TypeScript/ES6+ Project

```typescript
import {
  productService,
  cartService,
  authService
} from '@misiki/litekart-connector'

// That's it! Services are ready to use
```

### What's Exported

```typescript
export {
  // Search
  searchService,
  meilisearchService,
  autocompleteService,

  // Products
  productService,
  categoryService,
  bannerService,
  collectionService,
  blogService,
  reviewService,

  // Cart & Wishlist
  cartService,
  wishlistService,

  // Orders
  orderService,

  // Checkout & Payments
  checkoutService,
  couponService,
  paymentMethodService,

  // User & Auth
  authService,
  userService,
  addressService,
  profileService,

  // Store & Vendor
  storeService,
  vendorService,
  initService,

  // Content & Support
  menuService,
  pageService,
  faqService,
  galleryService,
  contactService,
  enquiryService,
  feedbackService,
  chatService,
  reelsService,

  // Utilities
  countryService,
  stateService,
  regionService,
  currencyService,
  settingsService,
  uploadService,
  popularityService,

  // Varni Services
  customDesignService,
  customProductService,

  // Types
  // ... all types exported
}
```

---

## Step 3: Your First API Call

### Fetch Products

```typescript
async function getFeaturedProducts() {
  try {
    const products = await productService.listFeaturedProducts({
      page: 1,
      sort: '-createdAt'
    })

    console.log(`Found ${products.count} featured products`)
    products.data.forEach(product => {
      console.log(product.title, product.price)
    })

    return products.data
  } catch (error: any) {
    console.error('Error fetching products:', error.message)
    return []
  }
}
```

### Search Products

```typescript
async function searchProducts(query) {
  try {
    const results = await searchService.searchWithQuery(query)

    console.log(`${results.count} results for "${query}"`)

    // Get available filters for UI
    const categories = results.facets.categories
    const priceRange = results.facets.priceStat

    return {
      products: results.data,
      categories,
      priceRange
    }
  } catch (error) {
    console.error(error)
  }
}
```

---

## Step 4: Build a Simple Product Page

```typescript
// products/[slug].tsx (React Next.js example)
'use client'

import { useEffect, useState } from 'react'
import { productService, cartService, wishlistService } from '@misiki/litekart-connector'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch product details
        const productData = await productService.getOne(params.slug)
        setProduct(productData.data)

        // Fetch related products
        const relatedProducts = await productService.listRelatedProducts({
          categoryId: productData.data.categoryId,
          page: 1
        })
        setRelated(relatedProducts.data)

        // Check wishlist status
        if (productData.data.variants?.length > 0) {
          const inWishlist = await wishlistService.checkWishlist({
            productId: productData.data.id,
            variantId: productData.data.variants[0].id
          })
          // Update UI with wishlist status
        }

        // Get current cart
        const currentCart = await cartService.fetchCartData()
        setCart(currentCart)
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  const addToCart = async (variantId) => {
    try {
      const updatedCart = await cartService.addToCart({
        productId: product.id,
        variantId,
        qty: 1,
        lineId: null
      })
      setCart(updatedCart)
      alert('Added to cart!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="product-page">
      <img src={product.featuredImage} alt={product.title} />

      <h1>{product.title}</h1>
      <p>{product.description}</p>

      <div className="price">
        <span className="mrp">{product.mrp}</span>
        <span className="current">{product.price}</span>
      </div>

      {/* Variant selector */}
      <div className="variants">
        {product.variants?.map(variant => (
          <button
            key={variant.id}
            onClick={() => addToCart(variant.id)}
          >
            {variant.title} - {variant.price}
          </button>
        ))}
      </div>

      {/* Related products */}
      <div className="related">
        <h3>Related Products</h3>
        {related.map(p => (
          <div key={p.id}>{p.title}</div>
        ))}
      </div>
    </div>
  )
}
```

---

## Step 5: Implement Shopping Cart

```typescript
// cart/page.tsx
export default async function CartPage() {
  // Server-side cart fetch (Next.js App Router)
  const cart = await cartService.fetchCartData()

  const subtotal = cart.lineItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {cart.lineItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.lineItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="row">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>

            {cart.couponCode && (
              <div className="row discount">
                <span>Discount ({cart.couponCode})</span>
                <span>-{cart.discountAmount}</span>
              </div>
            )}

            <div className="row">
              <span>Shipping</span>
              <span>{cart.shippingCharges}</span>
            </div>

            <div className="row">
              <span>Tax</span>
              <span>{cart.tax}</span>
            </div>

            <div className="row total">
              <span>Total</span>
              <span>{cart.total}</span>
            </div>

            <button onClick={() => window.location.href = '/checkout'}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Step 6: User Authentication

```typescript
// auth/login.tsx
'use client'

import { useState } from 'react'
import { authService } from '@misiki/litekart-connector'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await authService.login({
        email,
        password
      })

      // Success! User is logged in
      console.log('Logged in as:', user.email)
      window.location.href = '/dashboard'
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <div className="error">{error}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </form>
  )
}
```

---

## Step 7: Registration with Address

```typescript
// auth/signup.tsx
'use client'

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    // Address fields
    address_1: '',
    city: '',
    state: '',
    zip: '',
    countryCode: 'US'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // 1. Create account
      const user = await authService.signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        passwordConfirmation: form.passwordConfirmation
      })

      // 2. Save address (if provided)
      if (form.address_1) {
        await addressService.saveAddress({
          userId: user.id,
          firstName: form.firstName,
          lastName: form.lastName,
          address_1: form.address_1,
          city: form.city,
          state: form.state,
          zip: form.zip,
          countryCode: form.countryCode,
          phone: form.phone,
          isPrimary: true,
          isResidential: true
        })
      }

      // Success!
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Signup failed:', error.message)
    }
  }

  // Form JSX...
}
```

---

## Step 8: Complete Checkout Flow

```typescript
// checkout/page.tsx
export default async function CheckoutPage() {
  // Get cart data
  const cart = await cartService.fetchCartData()

  // Redirect if cart empty
  if (cart.lineItems.length === 0) {
    redirect('/cart')
  }

  // Get shipping rates
  const shippingRates = await checkoutService.getShippingRates({
    cartId: cart.id
  })

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <form action="/api/checkout" method="POST">
        {/* Shipping Address */}
        <AddressForm />

        {/* Shipping Method */}
        <ShippingOptions rates={shippingRates.shippingRates} />

        {/* Payment Method */}
        <PaymentOptions />

        <button type="submit" formAction="/api/checkout/razorpay">
          Pay with Razorpay
        </button>
      </form>
    </div>
  )
}
```

```typescript
// Handle payment
'use client'

async function handleRazorpay(cartId, shippingRateId) {
  try {
    // 1. Create payment session
    const checkout = await checkoutService.checkoutRazorpay({
      cartId,
      origin: window.location.origin
    })

    // 2. Razorpay will open in a popup or redirect
    // The user completes payment on Razorpay's site

    // 3. Razorpay redirects back to your callback URL
    // Verify payment status on your server
    const order = await orderService.getOrder(checkout.orderId)

    if (order.paid) {
      // Payment successful!
      window.location.href = `/order/confirmation/${order.orderNo}`
    } else {
      // Payment failed
      window.location.href = `/order/failed/${order.orderNo}`
    }
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}
```

---

## Step 9: Order History

```typescript
// account/orders/page.tsx
export default async function OrdersPage() {
  // Fetch user's orders
  const orders = await orderService.list({
    page: 1,
    sort: '-createdAt'
  })

  return (
    <div>
      <h1>My Orders</h1>

      {orders.data.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.orderNo}</span>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="order-body">
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total: {order.total} {order.currencySymbol}</p>
            <p>Items: {order.lineItems?.length || 0}</p>
            <p>Status: {order.paymentStatus}</p>
          </div>

          <div className="order-actions">
            <a href={`/order/${order.orderNo}`}>View Details</a>
            {order.status === 'delivered' && (
              <button onClick={() => openReviewModal(order)}>
                Write Review
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <Pagination
        currentPage={orders.page}
        totalPages={orders.noOfPage}
      />
    </div>
  )
}
```

---

## Step 10: Advanced Search with Filters

```typescript
// search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { searchService } from '@misiki/litekart-connector'

export default function SearchPage() {
  const router = useRouter()
  const { query } = router.query

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    async function performSearch() {
      setLoading(true)

      // Build URL with search params from router
      const url = new URL(`${window.location.origin}/search`)
      Object.entries(query).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, String(value))
      })

      const searchResults = await searchService.searchWithUrl(url)
      setResults(searchResults)
      setLoading(false)
    }

    performSearch()
  }, [query])

  const updateFilter = (key, value) => {
    const newQuery = { ...query, [key]: value }
    router.push({ pathname: '/search', query: newQuery }, undefined, {
      shallow: true  // Don't reload page
    })
  }

  return (
    <div className="search-page">
      <aside className="filters">
        <h3>Filters</h3>

        {/* Price Range */}
        <div>
          <h4>Price</h4>
          <input
            type="range"
            min={results?.facets.priceStat.min || 0}
            max={results?.facets.priceStat.max || 1000}
            value={query.priceMax || results?.facets.priceStat.max}
            onChange={(e) => updateFilter('priceTo', e.target.value)}
          />
          <div>
            {query.priceFrom || 0} - {query.priceTo || 'Max'}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4>Categories</h4>
          {results?.facets.categories.map(cat => (
            <label key={cat.name}>
              <input
                type="checkbox"
                checked={query.categories?.includes(cat.name)}
                onChange={() => {
                  const current = query.categories?.split(',') || []
                  const updated = current.includes(cat.name)
                    ? current.filter(c => c !== cat.name)
                    : [...current, cat.name]
                  updateFilter('categories', updated.join(','))
                }}
              />
              {cat.name} ({cat.count})
            </label>
          ))}
        </div>
      </aside>

      <main className="search-results">
        <h1>Search Results</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>{results?.count} results found</p>

            <div className="product-grid">
              {results?.data.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
```

---

## Common Patterns

### Using with Next.js Server Components

```typescript
// Server-side data fetching (Next.js App Router)
import { productService } from '@misiki/litekart-connector'

export default async function ProductListPage() {
  // Direct await in server component
  const products = await productService.list({
    page: 1,
    search: 'featured',
    sort: 'price'
  })

  return (
    <ul>
      {products.data.map(product => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  )
}
```

### React Query / SWR Integration

```typescript
import useSWR from 'swr'
import { productService } from '@misiki/litekart-connector'

function useProducts(params) {
  const { data, error, mutate } = useSWR(
    ['products', params],
    () => productService.list(params),
    {
      revalidateOnFocus: false
    }
  )

  return {
    products: data,
    loading: !data && !error,
    error,
    refresh: mutate
  }
}
```

---

## Next Steps

- Read the [API Reference](./API_REFERENCE.md) for all available methods
- Check [Examples](./EXAMPLES.md) for more code snippets
- See [TYPES_REFERENCE](./TYPES_REFERENCE.md) for TypeScript types
- Review [Error Handling](./ERROR_HANDLING.md) for robust implementations
- Learn about [Payment Gateways](./PAYMENT_GATEWAYS.md) for checkout setup

---

## Troubleshooting

### "Cannot find module '@misiki/litekart-connector'"

Make sure you've installed the package:
```bash
npm install @misiki/litekart-connector
```

### TypeScript errors

Ensure you're using TypeScript 5.0+ and have `"moduleResolution": "node"` in tsconfig.json.

### Cart is empty after adding items

Cart ID is stored in localStorage. Make sure you're not clearing localStorage or using private/incognito mode.

### 401 Unauthorized errors

User session has expired. Redirect to login page or re-authenticate.

### CORS errors in development

Configure your LiteKart backend to allow your development origin, or use a proxy.

---

## Need More Help?

- **[Full Documentation](./API_REFERENCE.md)** - All methods and parameters
- **[GitHub Issues](https://github.com/misiki/litekart-connector/issues)** - Report bugs or request features
- **[Discord](https://discord.gg/litekart)** - Get help from the community
- **[litekart.in](https://litekart.in)** - LiteKart platform documentation

---

**Happy coding! 🚀**
