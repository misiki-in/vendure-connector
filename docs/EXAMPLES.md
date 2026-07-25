# Examples

Comprehensive code examples for common e-commerce scenarios using LiteKart Connector.

---

## Table of Contents

1. [Product Catalog](#product-catalog)
2. [Product Details](#product-details)
3. [Shopping Cart](#shopping-cart)
4. [User Authentication](#user-authentication)
5. [Checkout Flow](#checkout-flow)
6. [Order Management](#order-management)
7. [User Account](#user-account)
8. [Wishlist](#wishlist)
9. [Reviews & Ratings](#reviews--ratings)
10. [Search & Filters](#search--filters)
11. [Multiple Payment Gateways](#multiple-payment-gateways)
12. [Vendor Marketplace](#vendor-marketplace)
13. [Admin Dashboard](#admin-dashboard)
14. [Custom Product Design](#custom-product-design)

---

## Product Catalog

### Featured Products with Pagination

```typescript
import { productService } from '@misiki/litekart-connector'
import Link from 'next/link'

export default async function FeaturedProductsPage({
  searchParams
}) {
  const page = parseInt(searchParams.page) || 1
  const limit = 20

  const response = await productService.listFeaturedProducts({
    page,
    sort: '-popularity'
  })

  const products = response.data
  const totalPages = response.totalPages

  return (
    <div>
      <h1>Featured Products</h1>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link href={`/product/${product.slug}`}>
              <img
                src={product.featuredImage || product.thumbnail}
                alt={product.title}
              />
              <h3>{product.title}</h3>
              <p className="price">
                <span className="current">${product.price}</span>
                {product.mrp > product.price && (
                  <span className="mrp">${product.mrp}</span>
                )}
              </p>
              {product.stock === 0 && (
                <span className="badge out-of-stock">Out of Stock</span>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/featured?page=${p}`}
              className={p === page ? 'active' : ''}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Category-Based Products

```typescript
import { categoryService, productService } from '@misiki/litekart-connector'

export default async function CategoryPage({ params }) {
  // Get category details
  const category = await categoryService.fetchCategory(params.slug)

  // Get products in this category
  const productsResponse = await productService.listRelatedProducts({
    categoryId: category.id,
    page: 1,
    sort: '-createdAt'
  })

  // Get subcategories
  const subcategories = await categoryService.fetchAllCategories()

  return (
    <div>
      <nav className="breadcrumb">
        <a href="/">Home</a> / <span>{category.name}</span>
      </nav>

      <h1>{category.name}</h1>

      {category.description && (
        <div className="category-description" dangerouslySetInnerHTML={{
          __html: category.description
        }} />
      )}

      <div className="category-layout">
        <aside className="category-sidebar">
          <h3>Subcategories</h3>
          <ul>
            {category.children?.map(child => (
              <li key={child.id}>
                <Link href={`/category/${child.slug}`}>
                  {child.name} ({child.productCount})
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="category-products">
          {productsResponse.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </div>
  )
}
```

### Products with Filters

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchService } from '@misiki/litekart-connector'

export default function FilteredProductsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)

      const url = new URL(window.location.href)
      const searchResults = await searchService.searchWithUrl(url)

      setResults(searchResults)
      setLoading(false)
    }

    fetchResults()
  }, [searchParams.toString()])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    window.location.search = newParams.toString()
  }

  if (!results) return <div>Loading...</div>

  return (
    <div className="filtered-products">
      <aside className="filters">
        {/* Price Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams.get('priceFrom') || ''}
              onChange={(e) => updateFilter('priceFrom', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get('priceTo') || ''}
              onChange={(e) => updateFilter('priceTo', e.target.value)}
            />
          </div>
          <div className="price-range">
            {results.facets.priceStat.min && (
              <input
                type="range"
                min={Math.floor(results.facets.priceStat.min)}
                max={Math.ceil(results.facets.priceStat.max || 1000)}
                defaultValue={searchParams.get('priceTo') || results.facets.priceStat.max}
                onChange={(e) => updateFilter('priceTo', e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Category Filter */}
        {results.facets.categories.length > 0 && (
          <div className="filter-section">
            <h4>Categories</h4>
            {results.facets.categories.map(cat => (
              <label key={cat.name}>
                <input
                  type="checkbox"
                  checked={searchParams.get('categories')?.includes(cat.name)}
                  onChange={() => {
                    const current = searchParams.get('categories')?.split(',') || []
                    const newValue = current.includes(cat.name)
                      ? current.filter(c => c !== cat.name)
                      : [...current, cat.name]
                    updateFilter('categories', newValue.join(','))
                  }}
                />
                {cat.name} ({cat.count})
              </label>
            ))}
          </div>
        )}

        {/* Tags Filter */}
        {results.facets.tags.length > 0 && (
          <div className="filter-section">
            <h4>Tags</h4>
            {results.facets.tags.map(tag => (
              <label key={tag.name}>
                <input
                  type="checkbox"
                  checked={searchParams.get('tags')?.split(',').includes(tag.name)}
                  onChange={() => {
                    const current = searchParams.get('tags')?.split(',') || []
                    const newValue = current.includes(tag.name)
                      ? current.filter(t => t !== tag.name)
                      : [...current, tag.name]
                    updateFilter('tags', newValue.join(','))
                  }}
                />
                {tag.name} ({tag.count})
              </label>
            ))}
          </div>
        )}
      </aside>

      <main className="products">
        <div className="results-header">
          <h1>{results.count} Products Found</h1>
          <select onChange={(e) => updateFilter('sort', e.target.value)}>
            <option value="">Sort By</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="-createdAt">Newest First</option>
            <option value="popularity:desc">Most Popular</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {results.data.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

---

## Product Details

### Complete Product Page with Variants

```typescript
import { productService, wishlistService, reviewService } from '@misiki/litekart-connector'
import { useState, useEffect } from 'react'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [inWishlist, setInWishlist] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  const loadProduct = async () => {
    try {
      const [productData, reviewsData] = await Promise.all([
        productService.getOne(params.slug),
        reviewService.fetchProducrReviews(productData.data.id)
      ])

      setProduct(productData.data)
      setSelectedVariant(productData.data.variants?.[0] || null)
      setReviews(reviewsData.data)

      // Check wishlist status
      if (selectedVariant) {
        const isInWishlist = await wishlistService.checkWishlist({
          productId: productData.data.id,
          variantId: selectedVariant.id
        })
        setInWishlist(isInWishlist)
      }
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async () => {
    if (!selectedVariant) return

    try {
      const wishlist = await wishlistService.toggleWishlist({
        productId: product.id,
        variantId: selectedVariant.id
      })
      setInWishlist(!inWishlist)
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    }
  }

  const addToCart = async () => {
    try {
      await cartService.addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        qty: quantity,
        lineId: null
      })
      alert('Added to cart!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  const currentPrice = selectedVariant?.price || product.price
  const currentMrp = selectedVariant?.mrp || product.mrp

  return (
    <div className="product-detail">
      <div className="product-gallery">
        <img
          src={selectedVariant?.images?.[0] || product.featuredImage}
          alt={product.title}
          className="main-image"
        />
        {product.images && (
          <div className="thumbnails">
            {product.images.split(',').map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.title} ${idx + 1}`}
                onClick={() => {/* Handle thumbnail click */}}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>

        {product.subtitle && (
          <p className="subtitle">{product.subtitle}</p>
        )}

        <div className="price-section">
          <span className="current-price">${currentPrice.toFixed(2)}</span>
          {currentMrp > currentPrice && (
            <span className="mrp-price">${currentMrp}</span>
          )}
          {product.stock === 0 && (
            <span className="badge out-of-stock">Out of Stock</span>
          )}
        </div>

        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="variant-selector">
            <h4>Select Option</h4>
            {product.options?.map(option => (
              <div key={option.id} className="option-group">
                <label>{option.title}</label>
                <div className="option-values">
                  {option.values.map(value => (
                    <button
                      key={value.id}
                      className={
                        selectedVariant?.options.find(
                          opt => opt.id === option.id
                        )?.value === value.value
                          ? 'active'
                          : ''
                      }
                      onClick={() => {
                        // Find variant with this option combination
                        const variant = product.variants.find(v =>
                          v.options.some(opt =>
                            opt.id === option.id && opt.value === value.value
                          )
                        )
                        setSelectedVariant(variant)
                      }}
                    >
                      {value.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="quantity-selector">
          <label>Quantity</label>
          <div className="qty-controls">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={selectedVariant?.stock || product.stock}
            />
            <button onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>
          <span className="stock-info">
            {selectedVariant?.stock || product.stock} in stock
          </span>
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button
            className="add-to-cart"
            onClick={addToCart}
            disabled={!product.active || product.stock === 0}
          >
            Add to Cart
          </button>

          <button
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={toggleWishlist}
          >
            {inWishlist ? '♥' : '♡'} Wishlist
          </button>
        </div>

        {/* Product Details */}
        <div className="product-details" dangerouslySetInnerHTML={{
          __html: product.description || ''
        }} />
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <span className="rating">{'★'.repeat(review.rating)}</span>
                  <span className="user">{review.user?.firstName}</span>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-text">{review.review}</p>
                {review.uploadedImages?.length > 0 && (
                  <div className="review-images">
                    {review.uploadedImages.map((img, idx) => (
                      <img key={idx} src={img} alt={`Review image ${idx + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## Shopping Cart

### Complete Cart Page

```typescript
import { cartService, couponService } from '@misiki/litekart-connector'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function CartPageContent() {
  const searchParams = useSearchParams()
  const [cart, setCart] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const cartData = await cartService.fetchCartData()
      setCart(cartData)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (lineId, productId, variantId, newQty) => {
    try {
      const updated = await cartService.addToCart({
        productId,
        variantId,
        qty: newQty,
        lineId
      })
      setCart(updated)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const removeItem = async (lineId, productId, variantId) => {
    try {
      const updated = await cartService.addToCart({
        productId,
        variantId,
        qty: -9999999,
        lineId
      })
      setCart(updated)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      setCouponError('')
      const updated = await cartService.applyCoupon({
        cartId: cart.id,
        couponCode: couponCode.trim()
      })
      setCart(updated)
      setCouponCode('')
      alert('Coupon applied successfully!')
    } catch (error: any) {
      setCouponError(error.message || 'Invalid coupon')
    }
  }

  const removeCoupon = async () => {
    try {
      const updated = await cartService.removeCoupon()
      setCart(updated)
    } catch (error) {
      console.error('Failed to remove coupon:', error)
    }
  }

  if (loading) return <div>Loading cart...</div>
  if (!cart) return <div>Failed to load cart</div>

  const subtotal = cart.lineItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {cart.lineItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/">Continue Shopping</a>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.lineItems.map(item => {
              const product = item.product  // Assuming product is included
              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={product.featuredImage}
                    alt={product.title}
                    className="item-image"
                  />

                  <div className="item-details">
                    <h3>{product.title}</h3>
                    {item.variantTitle && (
                      <p className="variant">{item.variantTitle}</p>
                    )}
                    <p className="price">${item.price} each</p>
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(
                        item.id,
                        item.productId,
                        item.variantId,
                        Math.max(1, item.qty - 1)
                      )}
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(
                        item.id,
                        item.productId,
                        item.variantId,
                        item.qty + 1
                      )}
                      disabled={item.qty >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${item.total.toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(
                      item.id,
                      item.productId,
                      item.variantId
                    )}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            {/* Coupon Section */}
            <div className="coupon-section">
              {cart.couponCode ? (
                <div className="coupon-applied">
                  <span>Coupon: {cart.couponCode}</span>
                  <span className="discount">
                    -${cart.discountAmount.toFixed(2)}
                  </span>
                  <button onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
              )}
              {couponError && (
                <p className="coupon-error">{couponError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div className="total-row discount">
                  <span>Discount</span>
                  <span>-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="total-row">
                <span>Shipping</span>
                <span>${cart.shippingCharges.toFixed(2)}</span>
              </div>

              <div className="total-row">
                <span>Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>

              {cart.codCharges > 0 && (
                <div className="total-row">
                  <span>COD Charges</span>
                  <span>${cart.codCharges.toFixed(2)}</span>
                </div>
              )}

              <div className="total-row grand-total">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <a
              href="/checkout"
              className="checkout-btn primary"
            >
              Proceed to Checkout
            </a>

            <a href="/" className="continue-shopping">
              Continue Shopping
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPageContent />
    </Suspense>
  )
}
```

### Mini Cart Component (for Header)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { cartService } from '@misiki/litekart-connector'

export default function MiniCart() {
  const [cart, setCart] = useState(null)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const timer = setTimeout(loadCart, 1000)
    return () => clearTimeout(timer)
  }, [])

  const loadCart = async () => {
    try {
      const cartData = await cartService.fetchCartData()
      setCart(cartData)
    } catch (error) {
      // Silently fail
    }
  }

  if (!cart) return null

  return (
    <div className="mini-cart">
      <button
        className="cart-trigger"
        onClick={() => setShowCart(!showCart)}
      >
        🛒 Cart ({cart.qty})
      </button>

      {showCart && (
        <div className="mini-cart-dropdown">
          <h4>Cart ({cart.qty} items)</h4>

          {cart.lineItems.slice(0, 3).map(item => (
            <div key={item.id} className="mini-cart-item">
              <img src={item.product?.featuredImage} alt="" />
              <div>
                <p>{item.product?.title}</p>
                <small>Qty: {item.qty} - ${item.total}</small>
              </div>
            </div>
          ))}

          <div className="mini-cart-total">
            Total: ${cart.total.toFixed(2)}
          </div>

          <div className="mini-cart-actions">
            <a href="/cart">View Cart</a>
            <a href="/checkout">Checkout</a>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## User Authentication

### Complete Auth Flow

```typescript
// pages/auth/login.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { authService } from '@misiki/litekart-connector'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await authService.login({
        email: form.email,
        password: form.password
      })

      // Store session info if needed
      if (form.remember) {
        localStorage.setItem('auth_token', user.userAuthToken)
      }

      // Redirect to intended page or dashboard
      const redirectTo = (router.query.redirect as string) || '/account'
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="switch-auth">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  )
}
```

### Registration with Email Verification

```typescript
// pages/auth/signup.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { authService } from '@misiki/litekart-connector'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    // Optional address
    address_1: '',
    city: '',
    state: '',
    zip: '',
    countryCode: 'US'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Step 1: Create account
      if (step === 1) {
        if (form.password !== form.passwordConfirmation) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        const user = await authService.signup({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          passwordConfirmation: form.passwordConfirmation,
          origin: window.location.origin
        })

        // If user added address info, proceed to step 2
        if (form.address_1) {
          setStep(2)
        } else {
          alert('Account created successfully! Please verify your email.')
          router.push('/account')
        }
      }

      // Step 2: Add address (optional)
      if (step === 2) {
        await addressService.saveAddress({
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

        alert('Account created successfully! Please verify your email.')
        router.push('/account')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Create Account</h1>

      {error && <div className="alert error">{error}</div>}

      <div className="progress-steps">
        <span className={step >= 1 ? 'active' : ''}>Account</span>
        <span className={step >= 2 ? 'active' : ''}>Address (Optional)</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <div className="form-row">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.passwordConfirmation}
            onChange={(e) =>
              setForm({ ...form, passwordConfirmation: e.target.value })
            }
            required
          />
        </div>

        {step === 2 && (
          <>
            <h3>Shipping Address (Optional)</h3>

            <input
              type="text"
              placeholder="Address Line 1"
              value={form.address_1}
              onChange={(e) => setForm({ ...form, address_1: e.target.value })}
            />

            <div className="form-row">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
              <select
                value={form.countryCode}
                onChange={(e) =>
                  setForm({ ...form, countryCode: e.target.value })
                }
              >
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="UK">United Kingdom</option>
                {/* Add more countries */}
              </select>
            </div>
          </>
        )}

        <div className="form-actions">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="secondary"
            >
              Back
            </button>
          )}
          <button type="submit" disabled={loading}>
            {loading
              ? 'Creating Account...'
              : step === 1
              ? 'Continue'
              : 'Create Account'}
          </button>
        </div>
      </form>

      <p className="switch-auth">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  )
}
```

### Password Reset

```typescript
// pages/auth/forgot-password.tsx
'use client'

import { useState } from 'react'
import { authService } from '@misiki/litekart-connector'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.forgotPassword({
        email,
        referrer: window.location.origin
      })
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-page">
        <h1>Check Your Email</h1>
        <p>
          We've sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <a href="/login">Back to Login</a>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <h1>Forgot Password</h1>

      <p>Enter your email address and we'll send you a link to reset your password.</p>

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p>
        <a href="/login">← Back to Login</a>
      </p>
    </div>
  )
}
```

---

## Checkout Flow

### Multi-Step Checkout

```typescript
// checkout/page.tsx
import {
  cartService,
  addressService,
  checkoutService,
  paymentMethodService
} from '@misiki/litekart-connector'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState(null)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [billingAddress, setBillingAddress] = useState(null)
  const [shippingMethod, setShippingMethod] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [step, setStep] = useState(1)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    initializeCheckout()
  }, [])

  const initializeCheckout = async () => {
    try {
      const [cartData, addresses] = await Promise.all([
        cartService.fetchCartData(),
        addressService.list({})
      ])

      setCart(cartData)
      setSavedAddresses(addresses.data)

      // Pre-select primary shipping address
      const primaryAddress = addresses.data.find(a => a.isPrimary)
      if (primaryAddress) {
        setShippingAddress(primaryAddress)
        setBillingAddress(primaryAddress)
      }

      // Get shipping rates
      const shippingRates = await checkoutService.getShippingRates({
        cartId: cartData.id
      })
      setShippingMethod(shippingRates.shippingRates?.[0])
    } catch (error) {
      console.error('Checkout initialization failed:', error)
    }
  }

  const saveAddress = async (addressData, type) => {
    try {
      const address = await addressService.saveAddress({
        ...addressData,
        userId: cart.userId
      })

      if (type === 'shipping') {
        setShippingAddress(address)
      } else {
        setBillingAddress(address)
      }

      setSavedAddresses(prev => [...prev, address])
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        address: error.message
      }))
    }
  }

  const updateCartWithAddresses = async () => {
    try {
      const updatedCart = await cartService.updateCart2({
        cartId: cart.id,
        customer_id: cart.userId,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        isBillingAddressSameAsShipping:
          billingAddress?.id === shippingAddress?.id,
        email: cart.email,
        phone: cart.phone
      })

      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        cart: error.message
      }))
      throw error
    }
  }

  const processPayment = async () => {
    try {
      let result

      switch (paymentMethod) {
        case 'razorpay':
          result = await checkoutService.checkoutRazorpay({
            cartId: cart.id,
            origin: window.location.origin
          })
          break

        case 'stripe':
          result = await checkoutService.checkoutStripe({
            cartId: cart.id,
            origin: window.location.origin
          })
          break

        case 'phonepe':
          result = await checkoutService.checkoutPhonepe({
            cartId: cart.id,
            email: cart.email,
            phone: cart.phone,
            origin: window.location.origin
          })
          break

        case 'cod':
          result = await checkoutService.checkoutCOD({
            cartId: cart.id,
            origin: window.location.origin
          })
          break

        case 'paypal':
          result = await checkoutService.checkoutPaypal({
            cartId: cart.id,
            origin: window.location.origin,
            return_url: `${window.location.origin}/order/confirm`
          })
          break

        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`)
      }

      return result
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        payment: error.message
      }))
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step < 3) {
      // Validate current step
      if (step === 1 && !shippingAddress) {
        setErrors({ shipping: 'Please select or add a shipping address' })
        return
      }
      setStep(step + 1)
      return
    }

    try {
      setLoading(true)

      // Step 3: Process payment
      const paymentResult = await processPayment()

      // Handle payment gateway redirect
      if (paymentResult.redirectUrl) {
        window.location.href = paymentResult.redirectUrl
      } else if (paymentResult.authorizationUrl) {
        // For gateways that require authorization
        window.location.href = paymentResult.authorizationUrl
      } else {
        // Immediate payment (like COD)
        router.push(`/order/confirmation/${paymentResult.orderId}`)
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!cart) return <div>Loading...</div>

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Progress Indicator */}
      <div className="checkout-steps">
        {['Shipping', 'Review', 'Payment'].map((label, idx) => (
          <div
            key={label}
            className={`step ${step > idx + 1 ? 'completed' : ''} ${
              step === idx + 1 ? 'active' : ''
            }`}
          >
            {idx + 1}. {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Shipping & Billing */}
        {step >= 1 && (
          <div className="checkout-section">
            <h2>Shipping Address</h2>

            {/* Saved addresses */}
            <div className="saved-addresses">
              {savedAddresses.map(addr => (
                <div
                  key={addr.id}
                  className={`address-card ${
                    shippingAddress?.id === addr.id ? 'selected' : ''
                  }`}
                  onClick={() => setShippingAddress(addr)}
                >
                  <p>{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address_1}</p>
                  <p>{addr.city}, {addr.state} {addr.zip}</p>
                  <p>{addr.phone}</p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowAddressForm(true)}
                className="add-new-address"
              >
                + Add New Address
              </button>
            </div>

            {/* Address form */}
            {showAddressForm && (
              <AddressForm
                onSubmit={(addr) => saveAddress(addr, 'shipping')}
                onCancel={() => setShowAddressForm(false)}
              />
            )}

            {/* Billing same as shipping */}
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={
                    billingAddress?.id === shippingAddress?.id ||
                    billingAddress?.id === shippingAddress?.id
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBillingAddress(shippingAddress)
                    } else {
                      setBillingAddress(null)
                    }
                  }}
                />
                Billing address same as shipping
              </label>
            </div>

            {(!billingAddress ||
              billingAddress.id !== shippingAddress.id) && (
              <div className="billing-address-section">
                <h3>Billing Address</h3>
                {/* Similar address form or saved addresses */}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review Order */}
        {step >= 2 && (
          <div className="checkout-section">
            <h2>Review Your Order</h2>

            <div className="order-review">
              <div className="items">
                <h3>Items ({cart.lineItems.length})</h3>
                {cart.lineItems.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.product?.featuredImage} alt="" />
                    <div>
                      <p>{item.product?.title}</p>
                      <small>Qty: {item.qty}</small>
                      <small>${item.total}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shipping-review">
                <h3>Shipping to</h3>
                <p>{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                <p>{shippingAddress?.address_1}</p>
                <p>{shippingAddress?.city}, {shippingAddress?.state}</p>
              </div>

              <div className="totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${cart.subtotal}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>${cart.shippingCharges}</span>
                </div>
                <div className="total-row">
                  <span>Tax</span>
                  <span>${cart.tax}</span>
                </div>
                <div className="total-row">
                  <span>Discount</span>
                  <span>-${cart.discountAmount}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${cart.total}</span>
                </div>
              </div>
            </div>

            <button type="button" onClick={() => setStep(1)}>
              Edit Shipping
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step >= 3 && (
          <div className="checkout-section">
            <h2>Payment Method</h2>

            {/* Payment methods */}
            {paymentMethodService ? (
              <PaymentMethodSelector
                selected={paymentMethod}
                onChange={setPaymentMethod}
              />
            ) : (
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Razorpay (Card, UPI, Netbanking)
                </label>

                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Stripe (Card)
                </label>

                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="phonepe"
                    checked={paymentMethod === 'phonepe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  PhonePe (UPI, Card)
                </label>

                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                  {!cart.isCodAvailable && (
                    <span className="unavailable">(Not available)</span>
                  )}
                </label>

                {storeSettings?.merchantId && (
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                  </label>
                )}
              </div>
            )}

            <div className="terms">
              <label>
                <input type="checkbox" required />
                I agree to the <a href="/terms">Terms & Conditions</a>
              </label>
            </div>

            {errors.payment && (
              <div className="alert error">{errors.payment}</div>
            )}

            <button type="button" onClick={() => setStep(2)}>
              Back to Review
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="checkout-actions">
          {step === 3 ? (
            <button
              type="submit"
              className="primary large"
              disabled={loading || !cart.isCodAvailable}
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'cod'
                ? `Pay $${cart.total} on Delivery`
                : `Pay $${cart.total} Now`}
            </button>
          ) : (
            <button type="submit" className="primary">
              Continue to {step === 1 ? 'Review' : 'Payment'}
            </button>
          )}

          <p className="secure-checkout">
            🔒 256-bit SSL secure checkout
          </p>
        </div>
      </form>
    </div>
  )
}
```

---

## Order Management

### Order History and Details

```typescript
// account/orders/page.tsx
import { orderService } from '@misiki/litekart-connector'
import Link from 'next/link'

export default async function OrdersPage({
  searchParams
}) {
  const page = parseInt(searchParams.page) || 1
  const limit = 10

  // Fetch user's orders
  const ordersResponse = await orderService.list({
    page,
    q: searchParams.q || '',
    sort: '-createdAt'
  })

  const orders = ordersResponse.data

  return (
    <div className="account-page">
      <h1>My Orders</h1>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search orders..."
          defaultValue={searchParams.q || ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const q = (e.target as HTMLInputElement).value
              window.location.search = q ? `?q=${q}` : ''
            }
          }}
        />
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
          <a href="/">Start Shopping</a>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderNo}</h3>
                    <p className="date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    {order.lineItems?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <img
                          src={item.product?.featuredImage}
                          alt={item.product?.title}
                        />
                        <div>
                          <p>{item.product?.title}</p>
                          {item.variantTitle && (
                            <small>{item.variantTitle}</small>
                          )}
                          <small>Qty: {item.qty}</small>
                        </div>
                        <span>${item.total}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Items ({order.lineItems?.length})</span>
                      <span>${order.subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>${order.shippingCharges}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>${order.tax}</span>
                    </div>
                    {order.couponUsed && (
                      <div className="summary-row discount">
                        <span>Discount ({order.couponUsed})</span>
                        <span>-${order.discount}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${order.total} {order.currencySymbol}</span>
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <p>
                      <strong>Shipping to:</strong>{' '}
                      {order.shippingAddress?.firstName}{' '}
                      {order.shippingAddress?.lastName}
                    </p>
                    <p>{order.shippingAddress?.city}</p>
                  </div>

                  <div className="payment-info">
                    <p>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </p>
                    <p>{order.paymentStatus}</p>
                  </div>

                  <div className="order-actions">
                    <Link href={`/order/${order.orderNo}`}>
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <Link
                        href={`/review/${order.id}`}
                        className="secondary"
                      >
                        Write Review
                      </Link>
                    )}
                    <Link
                      href={`/track-order?order=${order.orderNo}&email=${order.userEmail}`}
                      className="secondary"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {ordersResponse.totalPages > 1 && (
            <div className="pagination">
              {Array.from(
                { length: ordersResponse.totalPages },
                (_, i) => i + 1
              ).map(p => (
                <Link
                  key={p}
                  href={`/account/orders?page=${p}&q=${searchParams.q || ''}`}
                  className={p === page ? 'active' : ''}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

### Order Details Page

```typescript
// order/[orderNo].tsx
import {
  orderService,
  reviewService
} from '@misiki/litekart-connector'

export default async function OrderDetailPage({ params }) {
  const order = await orderService.getOrder(params.orderNo)

  return (
    <div className="order-detail">
      <div className="order-header">
        <div>
          <h1>Order #{order.orderNo}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className={`status-badge ${order.status.toLowerCase()}`}>
          {order.status}
        </div>
      </div>

      <div className="order-grid">
        {/* Order Items */}
        <div className="order-items-section">
          <h2>Order Items</h2>

          {order.lineItems?.map((item, idx) => (
            <div key={idx} className="order-item">
              <img
                src={item.product?.featuredImage}
                alt={item.product?.title}
              />
              <div className="item-info">
                <h3>{item.product?.title}</h3>
                {item.variantTitle && <p>{item.variantTitle}</p>}
                <p>Quantity: {item.qty}</p>
                <p className="price">${item.price} each</p>
              </div>
              <div className="item-total">
                ${item.total}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${order.shippingCharges}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${order.tax}</span>
            </div>
            {order.couponUsed && (
              <div className="summary-row discount">
                <span>Discount ({order.couponUsed})</span>
                <span>-${order.discount}</span>
              </div>
            )}
            <div className="summary-row grand-total">
              <span>Total</span>
              <span>${order.total} {order.currencySymbol}</span>
            </div>
          </div>

          <div className="payment-info">
            <h3>Payment</h3>
            <p>Method: {order.paymentMethod}</p>
            <p>Status: {order.paymentStatus}</p>
            {order.paymentId && (
              <p>Payment ID: {order.paymentId}</p>
            )}
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="tracking-info">
              <h3>Tracking</h3>
              <p>Tracking Number: {order.trackingNumber}</p>
              <a
                href={`https://track.example.com?num=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Track Package
              </a>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="address-section">
          <h2>Shipping Address</h2>
          <address>
            {order.shippingAddress?.firstName}{' '}
            {order.shippingAddress?.lastName}
            <br />
            {order.shippingAddress?.address_1}
            {order.shippingAddress?.address_2 && (
              <>, {order.shippingAddress.address_2}</>
            )}
            <br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
            {order.shippingAddress?.zip}
            <br />
            {order.shippingAddress?.country}
            <br />
            Phone: {order.shippingAddress?.phone}
          </address>
        </div>
      </div>

      {/* Write Review Button */}
      {order.status === 'delivered' && (
        <div className="review-cta">
          <a href={`/review/order/${order.id}`} className="button primary">
            Write a Review
          </a>
        </div>
      )}
    </div>
  )
}
```

---

## Reviews & Ratings

### Review Submission Form

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { orderService } from '@misiki/litekart-connector'

export default function ReviewPage({ params }) {
  const router = useRouter()
  const [ratings, setRatings] = useState({})
  const [reviews, setReviews] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Fetch order to get line items
  const { data: order, isLoading } = useQuery(
    ['order', params.orderId],
    () => orderService.fetchOrder(params.orderId)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Submit review for each item
      const promises = order.lineItems.map(item =>
        orderService.submitReview({
          productId: item.productId,
          variantId: item.variantId,
          rating: ratings[item.id] || 5,
          review: reviews[item.id] || '',
          uploadedImages: [] // Implement image upload separately
        })
      )

      await Promise.all(promises)
      alert('Thank you for your review!')
      router.push('/account/orders')
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="review-page">
      <h1>Review Your Order</h1>
      <p>How were the products you purchased?</p>

      <form onSubmit={handleSubmit}>
        {order.lineItems.map(item => (
          <div key={item.id} className="review-item">
            <img
              src={item.product?.featuredImage}
              alt={item.product?.title}
            />
            <div className="item-details">
              <h3>{item.product?.title}</h3>
              {item.variantTitle && (
                <p>Variant: {item.variantTitle}</p>
              )}

              {/* Star Rating */}
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${
                      (ratings[item.id] || 0) >= star ? 'filled' : ''
                    }`}
                    onClick={() =>
                      setRatings({ ...ratings, [item.id]: star })
                    }
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <textarea
                placeholder="Share your experience with this product..."
                value={reviews[item.id] || ''}
                onChange={(e) =>
                  setReviews({ ...reviews, [item.id]: e.target.value })
                }
                rows={4}
                required
              />
            </div>
          </div>
        ))}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Reviews'}
        </button>
      </form>
    </div>
  )
}
```

---

## Vendor Marketplace

### Vendor Registration

```typescript
import { authService, vendorService } from '@misiki/litekart-connector'

export async function registerVendor(formData) {
  try {
    // 1. Register as vendor user
    const user = await authService.joinAsVendor({
      firstName: formData.firstName,
      lastName: formData.lastName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'vendor',
      origin: window.location.origin
    })

    // 2. Create vendor profile
    const vendor = await vendorService.save({
      userId: user.id,
      businessName: formData.businessName,
      businessDescription: formData.description,
      businessAddress: formData.address,
      taxId: formData.taxId,
      bankAccount: {
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode
      },
      commissionRate: formData.commissionRate || 0.1 // 10% default
    })

    return { user, vendor }
  } catch (error) {
    console.error('Vendor registration failed:', error)
    throw error
  }
}
```

---

## Admin Dashboard

### Dashboard with Stats

```typescript
import {
  orderService,
  productService,
  userService
} from '@misiki/litekart-connector'

export default async function AdminDashboard() {
  // Fetch all data in parallel
  const [orders, products, users] = await Promise.all([
    orderService.list({ page: 1, q: '', sort: '-createdAt' }),
    productService.list({ page: 1, search: '', sort: '-createdAt' }),
    userService.getMe() // Or userService.list() if available
  ])

  // Calculate stats
  const totalRevenue = orders.data.reduce((sum, order) => sum + (order.total || 0), 0)
  const pendingOrders = orders.data.filter(o => o.status === 'pending').length
  const lowStock = products.data.filter(p => p.stock < 10).length

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{orders.count}</p>
          <small>{pendingOrders} pending</small>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-value">{products.count}</p>
          <small>{lowStock} low stock</small>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-value">{users?.customerCount || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.data.slice(0, 10).map(order => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.userEmail}</td>
                <td>${order.total}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## Custom Product Design (Varni)

### Upload Custom Design

```typescript
import {
  customDesignService,
  customProductService
} from '@misiki/litekart-connector'

export default function CustomDesignPage() {
  const [design, setDesign] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (file) => {
    setUploading(true)

    try {
      // Upload design file
      const designData = await customDesignService.createDesign({
        name: file.name,
        file: file,  // Your upload implementation
        type: file.type,
        userId: currentUser.id
      })

      setDesign(designData)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const createCustomProduct = async (baseProductId, designId) => {
    try {
      const customProduct =
        await customProductService.createCustomProduct({
          baseProductId,
          designId,
          customization: {
            placement: 'front',
            size: 'large',
            color: '#000000'
          },
          priceAdjustment: 10.00 // Additional fee for customization
        })

      return customProduct
    } catch (error) {
      console.error('Failed to create custom product:', error)
    }
  }

  return (
    <div>
      <h1>Custom Design Your Product</h1>

      {/* Upload area */}
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {uploading ? (
          <p>Uploading...</p>
        ) : design ? (
          <div>
            <img src={design.url} alt="Your design" />
            <button onClick={() => setDesign(null)}>Upload Different</button>
          </div>
        ) : (
          <p>Drop your design file here or click to browse</p>
        )}
      </div>

      {/* Product options */}
      {design && (
        <div className="customization-options">
          <h3>Customization</h3>

          <div className="option">
            <label>Placement</label>
            <select>
              <option value="front">Front</option>
              <option value="back">Back</option>
              <option value="sleeve">Sleeve</option>
            </select>
          </div>

          <div className="option">
            <label>Size</label>
            <select>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <button
            onClick={() =>
              addToCartWithCustomization(baseProductId, design.id)
            }
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## Performance Optimization

### Caching with React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  productService,
  cartService,
  wishlistService
} from '@misiki/litekart-connector'

// Configure React Query
const queryClient = new QueryClient()

// Example component
function ProductList() {
  const queryClient = useQueryClient()

  // Query with caching
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', { page: 1, search: 'featured' }],
    queryFn: () => productService.listFeaturedProducts({ page: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  })

  // Mutation with cache invalidation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, variantId, qty }) =>
      cartService.addToCart({ productId, variantId, qty, lineId: null }),
    onSuccess: () => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })

  const addToCart = (productId, variantId) => {
    addToCartMutation.mutate({ productId, variantId, qty: 1 })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div>
      {products?.data.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product.id, product.variants[0]?.id)}
        />
      ))}
    </div>
  )
}
```

---

## Next Steps

- See **[QUICKSTART.md](./QUICKSTART.md)** for setup instructions
- Review **[API_REFERENCE.md](./API_REFERENCE.md)** for all available methods
- Check **[TYPES_REFERENCE.md](./TYPES_REFERENCE.md)** for TypeScript types
- Read **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** for robust error handling
