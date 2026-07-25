# Error Handling Guide

Comprehensive guide to handling errors in LiteKart Connector.

---

## Error Structure

All service methods throw errors with a consistent structure:

```typescript
class LiteKartError extends Error {
  message: string      // User-friendly error message
  status?: number     // HTTP status code
  data?: unknown      // Additional error data from API
  code?: string       // Error code (if provided by API)
}
```

### Standard Error Format

```typescript
{
  message: string,      // Always present
  status: number,       // Optional HTTP status
  data: {               // Optional additional data
    errors?: Record<string, string[]>,
    message?: string,
    code?: string
  }
}
```

---

## Common Error Messages

### Authentication Errors

| Error Message | Status | Cause | Solution |
|---------------|--------|-------|----------|
| `Session expired. Please login again` | 401 | Token expired or invalid | Redirect to login page |
| `Invalid credentials` | 401 | Wrong email/password | Show error, ask user to retry |
| `Email not verified` | 403 | User hasn't verified email | Send verification reminder |
| `Account is disabled` | 403 | Admin disabled account | Contact support |

### Validation Errors

| Error Message | Status | Cause | Solution |
|---------------|--------|-------|----------|
| `Validation failed` | 422 | Invalid input data | Show field-specific errors |
| `Required field missing` | 422 | Missing required field | Highlight missing field |
| `Invalid email format` | 422 |.email validation failed | Validate email before submit |
| `Password too short` | 422 | Password doesn't meet requirements | Show password requirements |

### Resource Errors

| Error Message | Status | Cause | Solution |
|---------------|--------|-------|----------|
| `Product not found` | 404 | Invalid product ID/slug | Show "not found" page |
| `Cart not found` | 404 | Cart ID invalid or expired | Create new cart |
| `Order not found` | 404 | Order ID doesn't exist | Show "order not found" |
| `Coupon expired` | 404 | Coupon validity period ended | Remove coupon from UI |
| `Out of stock` | 400 | Insufficient inventory | Show stock warning |

### Network Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `Please check your internet connection` | User offline | Show offline message |
| `Unable to reach the server` | Server down/network issue | Retry with exponential backoff |
| `Request timeout` | Request took too long | Increase timeout or retry |

---

## Error Handling Patterns

### Basic Try-Catch

```typescript
async function safeOperation() {
  try {
    const user = await authService.login({ email, password })
    return user
  } catch (error: any) {
    console.error('Login failed:', error.message)
    throw error  // Re-throw for caller
  }
}
```

### Specific Error Types

```typescript
async function handleLogin() {
  try {
    const user = await authService.login({ email, password })
    return user
  } catch (error: any) {
    // Handle specific error types
    if (error.message?.includes('Session expired')) {
      // Clear local storage, redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    } else if (error.message?.includes('email')) {
      // Email-specific error
      setFieldError('email', error.message)
    } else if (error.message?.includes('password')) {
      // Password-specific error
      setFieldError('password', error.message)
    } else {
      // Generic error
      setError('Login failed. Please try again.')
      console.error('Login error:', error)
    }
  }
}
```

### Validation Error Parsing

```typescript
interface ValidationErrors {
  [field: string]: string[]
}

function parseValidationError(error: any): ValidationErrors | null {
  if (error.status === 422 && error.data?.errors) {
    return error.data.errors
  }
  return null
}

async function submitForm(formData) {
  try {
    const user = await authService.signup(formData)
    return user
  } catch (error: any) {
    const fieldErrors = parseValidationError(error)

    if (fieldErrors) {
      // Display field-specific errors
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        setFieldError(field, messages[0])
      })
    } else {
      // Generic error
      setFormError(error.message)
    }
  }
}
```

---

## Retry Logic

### Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry on 4xx errors (except 429 Too Many Requests)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }

      if (attempt < maxRetries - 1) {
        // Calculate delay with jitter
        const delay = baseDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

// Usage
const products = await withRetry(() =>
  productService.list({ page: 1 })
)
```

### Network Status Awareness

```typescript
function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

async function safeFetchWithFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isOnline()) {
    return fallback
  }

  try {
    return await fn()
  } catch (error: any) {
    if (error.message?.includes('internet')) {
      return fallback
    }
    throw error
  }
}

// Usage
const products = await safeFetchWithFallback(
  () => productService.list({ page: 1 }),
  { data: [], count: 0, totalPages: 0, pageSize: 10, page: 1, noOfPage: 0 }
)
```

---

## Error Boundaries (React)

```typescript
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // Log to error reporting service
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
export default function App() {
  return (
    <ErrorBoundary
      fallback={<ErrorPage />}
    >
      <YourApp />
    </ErrorBoundary>
  )
}
```

---

## Global Error Handler

```typescript
// Set up global error handler
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason

  console.error('Unhandled promise rejection:', error)

  // Log to error service
  if (error instanceof Error) {
    logError({
      message: error.message,
      stack: error.stack,
      type: 'unhandled_rejection'
    })
  }

  // Show user-friendly message
  showToast('An unexpected error occurred. Please refresh the page.')
})

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)

  logError({
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'global_error'
  })
})
```

---

## API Service-Specific Handling

### Cart Errors

```typescript
async function safeAddToCart(params) {
  try {
    const cart = await cartService.addToCart(params)
    return { success: true, cart }
  } catch (error: any) {
    // Handle stock issues
    if (error.message?.includes('stock')) {
      return {
        success: false,
        type: 'out_of_stock',
        message: 'This item is currently out of stock'
      }
    }

    // Handle cart creation failure
    if (error.message?.includes('cart')) {
      // Try to recreate cart
      try {
        localStorage.removeItem('cart_id')
        const newCart = await cartService.addToCart(params)
        return { success: true, cart: newCart }
      } catch (retryError) {
        return {
          success: false,
          type: 'cart_error',
          message: 'Unable to update cart. Please try again.'
        }
      }
    }

    return { success: false, error: error.message }
  }
}
```

### Payment Errors

```typescript
interface PaymentResult {
  success: boolean
  orderId?: string
  redirectUrl?: string
  error?: string
  errorType?: 'validation' | 'gateway' | 'network' | 'insufficient'
}

async function processPayment(
  cartId: string,
  paymentMethod: string
): Promise<PaymentResult> {
  try {
    let result

    switch (paymentMethod) {
      case 'razorpay':
        result = await checkoutService.checkoutRazorpay({
          cartId,
          origin: window.location.origin
        })
        break

      case 'cod':
        // Check if COD is available
        const cart = await cartService.fetchCartData()
        if (!cart.isCodAvailable) {
          return {
            success: false,
            error: 'Cash on delivery is not available for this order',
            errorType: 'validation'
          }
        }
        result = await checkoutService.checkoutCOD({ cartId, origin: window.location.origin })
        break

      // ... other payment methods
    }

    return { success: true, orderId: result.orderId, redirectUrl: result.redirectUrl }
  } catch (error: any) {
    // Payment gateway errors
    if (error.message?.includes('insufficient')) {
      return {
        success: false,
        error: 'Insufficient funds',
        errorType: 'insufficient'
      }
    }

    // Validation errors
    if (error.status === 422) {
      return {
        success: false,
        error: 'Please check your payment details',
        errorType: 'validation'
      }
    }

    // Gateway errors
    if (error.status >= 500) {
      return {
        success: false,
        error: 'Payment gateway is temporarily unavailable. Please try another method.',
        errorType: 'gateway'
      }
    }

    // Network errors
    if (error.message?.includes('network')) {
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        errorType: 'network'
      }
    }

    return {
      success: false,
      error: error.message || 'Payment failed',
      errorType: 'unknown'
    }
  }
}
```

### Search Errors

```typescript
async function safeSearch(query: string) {
  try {
    const results = await searchService.searchWithQuery(query)
    return results
  } catch (error: any) {
    console.error('Search failed:', error)

    // Meilisearch unavailable - show alternatives
    if (error.message?.includes('Meilisearch') || error.status === 503) {
      // Fallback to regular product list
      try {
        const fallback = await productService.list({ search: query })
        return {
          ...fallback,
          notice: 'Search is currently experiencing issues. Showing all matching products.'
        }
      } catch (fallbackError) {
        throw new Error('Search and product listing are currently unavailable')
      }
    }

    throw error
  }
}
```

---

## User-Friendly Error Messages

### Map Technical Errors to User Messages

```typescript
const ERROR_MESSAGES = {
  // Authentication
  401: {
    default: 'Your session has expired. Please log in again.',
    login: 'Invalid email or password',
    signup: 'Unable to create account. Please try again.'
  },

  // Validation
  422: {
    default: 'Please correct the errors in the form.',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters'
  },

  // Not Found
  404: {
    default: 'The requested resource was not found',
    product: 'Product not found',
    order: 'Order not found',
    cart: 'Your cart is empty'
  },

  // Server
  500: {
    default: 'Something went wrong. Please try again later.'
  },

  // Conflict
  409: {
    default: 'This resource already exists',
    email: 'An account with this email already exists'
  },

  // Network
  NETWORK: {
    default: 'Unable to connect. Please check your internet.',
    timeout: 'Request timed out. Please try again.'
  }
}

function getUserFriendlyMessage(
  error: any,
  context?: string
): string {
  const status = error.status

  if (status && ERROR_MESSAGES[status]) {
    const contextMessages = ERROR_MESSAGES[status][context]
    const defaultMessage = ERROR_MESSAGES[status].default

    return contextMessages || defaultMessage
  }

  if (error.message?.includes('network')) {
    return ERROR_MESSAGES.NETWORK.default
  }

  if (error.message?.includes('timeout')) {
    return ERROR_MESSAGES.NETWORK.timeout
  }

  return error.message || 'An unexpected error occurred'
}
```

---

## Error Logging

### Development vs Production

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'

async function withErrorLogging<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    const errorData = {
      operation,
      message: error.message,
      status: error.status,
      timestamp: new Date().toISOString(),
      user: getCurrentUser()?.id,
      url: window.location.href,
      // Don't log sensitive data in production
      ...(isDevelopment && { stack: error.stack, data: error.data })
    }

    // Development: log to console
    if (isDevelopment) {
      console.error(`[${operation}]`, errorData)
    } else {
      // Production: send to error tracking service
      await fetch('/api/errors/log', {
        method: 'POST',
        body: JSON.stringify(errorData)
      }).catch(() => {
        // Silently fail logging errors
      })
    }

    throw error
  }
}

// Usage
const user = await withErrorLogging('user.login', () =>
  authService.login({ email, password })
)
```

---

## Recovery Strategies

### Graceful Degradation

```typescript
async function getProductsWithFallback(params) {
  try {
    // Try search first (faster)
    return await searchService.searchWithQuery(params.query)
  } catch (error: any) {
    if (error.message?.includes('Meilisearch')) {
      console.warn('Meilisearch unavailable, falling back to API')
      // Fallback to REST API
      return await productService.list(params)
    }
    throw error
  }
}
```

### Session Recovery

```typescript
async function withSessionRecovery<T>(
  fn: () => Promise<T>
): Promise<{ data?: T; needsLogin: boolean }> {
  try {
    const result = await fn()
    return { data: result, needsLogin: false }
  } catch (error: any) {
    if (error.message?.includes('Session expired')) {
      // Clear auth state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_id')

      return { needsLogin: true }
    }

    throw error
  }
}

// Usage
const { data, needsLogin } = await withSessionRecovery(() =>
  cartService.fetchCartData()
)

if (needsLogin) {
  router.push('/login?redirect=/cart')
} else if (data) {
  // Render cart
}
```

---

## Form Error Management

```typescript
'use client'

import { useState } from 'react'

type FormErrors = Record<string, string[]>
type FieldValues = Record<string, any>

function useFormHandler<T extends FieldValues>(
  onSubmit: (values: T) => Promise<void>
) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: T) => {
    setSubmitting(true)
    setErrors({})

    try {
      await onSubmit(values)
    } catch (error: any) {
      const fieldErrors = parseValidationError(error)

      if (fieldErrors) {
        setErrors(fieldErrors)
      } else {
        setErrors({
          _global: [error.message || 'An error occurred']
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getFieldError = (fieldName: string): string | null => {
    return errors[fieldName]?.[0] || null
  }

  const hasErrors = Object.keys(errors).length > 0

  return {
    handleSubmit,
    errors,
    getFieldError,
    hasErrors,
    submitting
  }
}

// Usage in component
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { handleSubmit, submitting, getFieldError } = useFormHandler(
    async (values) => {
      await authService.login(values)
    }
  )

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit({ email, password })
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {getFieldError('email') && (
        <span className="error">{getFieldError('email')}</span>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Login'}
      </button>

      {getFieldError('_global') && (
        <div className="global-error">{getFieldError('_global')}</div>
      )}
    </form>
  )
}
```

---

## Testing Error Handling

```typescript
import { productService } from '@misiki/litekart-connector'

// Mock fetch for testing
const mockFetch = jest.fn()

describe('Error Handling', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({
        message: 'Product not found'
      })
    })

    const service = new ProductService(mockFetch)

    await expect(service.getOne('invalid-slug')).rejects.toThrow('Product not found')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const service = new ProductService(mockFetch)

    await expect(service.list({})).rejects.toThrow('network')
  })

  it('should handle server errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({
        message: 'Internal server error'
      })
    })

    const service = new ProductService(mockFetch)

    const error = await service.list({}).catch(e => e)
    expect(error.message).toBe('Something went wrong')
  })
})
```

---

## Monitoring and Alerting

### Error Monitoring Setup

```typescript
interface ErrorReport {
  message: string
  stack?: string
  status?: number
  userId?: string
  url?: string
  userAgent?: string
  timestamp: string
  additionalData?: Record<string, any>
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private queue: ErrorReport[] = []
  private flushInterval: NodeJS.Timeout

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  capture(error: Error, context?: Partial<ErrorReport>): void {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context
    }

    // Add to queue
    this.queue.push(report)

    // Flush immediately in development
    if (process.env.NODE_ENV === 'development') {
      this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const reports = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: reports })
      })
    } catch (error) {
      // Re-queue on failure
      this.queue.unshift(...reports)
    }
  }

  startAutoFlush(interval: number = 30000): void {
    this.flushInterval = setInterval(() => this.flush(), interval)
  }

  stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
  }
}

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  ErrorMonitor.getInstance().capture(event.reason as Error, {
    type: 'unhandled_rejection',
    url: window.location.href
  })
})

// Start auto-flush in production
if (process.env.NODE_ENV === 'production') {
  ErrorMonitor.getInstance().startAutoFlush()
}
```

---

## Real-World Error Handling Scenarios

### Shopping Cart with Robust Error Handling

```typescript
async function robustAddToCart(
  productId: string,
  variantId: string,
  qty: number
): Promise<{
  success: boolean
  cart?: Cart
  error?: string
  errorType?: 'stock' | 'network' | 'server' | 'validation'
}> {
  const MAX_RETRIES = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const cart = await cartService.addToCart({
        productId,
        variantId,
        qty,
        lineId: null
      })

      // Validate cart response
      if (!cart?.id) {
        throw new Error('Invalid cart response')
      }

      return { success: true, cart }
    } catch (error: any) {
      lastError = error

      // Don't retry on client errors
      if (error.status && error.status >= 400 && error.status < 500) {
        break
      }

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        )
      }
    }
  }

  // Determine error type
  let errorType: 'stock' | 'network' | 'server' | 'validation' = 'server'
  let message = 'Failed to add item to cart. Please try again.'

  if (lastError?.message?.includes('stock')) {
    errorType = 'stock'
    message = 'This item is currently out of stock'
  } else if (lastError?.message?.includes('network')) {
    errorType = 'network'
    message = 'Network error. Please check your connection.'
  } else if (lastError?.status === 422) {
    errorType = 'validation'
    message = lastError.message
  }

  return { success: false, error: message, errorType }
}
```

### Complete Form with Error States

```typescript
'use client'

import { useState, useEffect } from 'react'

function FormWithErrorHandling() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error on change
    setErrors(prev => ({ ...prev, [field]: [] }))
    setSubmitError(null)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = ['Email is required']
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ['Please enter a valid email']
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = ['Password is required']
    } else if (formData.password.length < 8) {
      newErrors.password = ['Password must be at least 8 characters']
    }

    // Name validation
    if (!formData.firstName || !formData.lastName) {
      newErrors.firstName = ['First and last name are required']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await authService.signup({
        ...formData,
        passwordConfirmation: formData.password,
        origin: window.location.origin
      })

      setSubmitSuccess(true)
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      })
    } catch (error: any) {
      const fieldErrors = parseValidationError(error)

      if (fieldErrors) {
        setErrors(fieldErrors)
      } else {
        setSubmitError(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasErrors = Object.keys(errors).some(key => errors[key].length > 0)

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Account</h2>

      {submitError && (
        <div className="alert alert-error">{submitError}</div>
      )}

      {submitSuccess && (
        <div className="alert alert-success">
          Account created! Check your email to verify.
        </div>
      )}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={isSubmitting}
        />
        {errors.email?.map((err, i) => (
          <span key={i} className="field-error">{err}</span>
        ))}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          disabled={isSubmitting}
        />
        {errors.password?.map((err, i) => (
          <span key={i} className="field-error">{err}</span>
        ))}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={isSubmitting}
          />
          {errors.firstName?.map((err, i) => (
            <span key={i} className="field-error">{err}</span>
          ))}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={isSubmitting}
          />
          {errors.lastName?.map((err, i) => (
            <span key={i} className="field-error">{err}</span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || hasErrors}
        className={isSubmitting ? 'loading' : ''}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
```

---

## Best Practices Summary

✅ **DO:**
- Always wrap async calls in try-catch
- Provide specific error messages to users
- Log errors appropriately (development vs production)
- Implement retry logic for network errors
- Use error boundaries for React component errors
- Distinguish between error types (network, validation, server)
- Clear error states when user takes action

❌ **DON'T:**
- Show raw error objects to users
- Swallow errors silently
- Retry indefinitely on 4xx errors
- Store sensitive data in error logs
- Block the UI during error recovery
- Duplicate error handling logic everywhere

---

## Troubleshooting

### Common Issues

**Issue:** "Failed to load products" with empty error message
**Solution:** Check network connectivity, API endpoint configuration

**Issue:** Session expires immediately after login
**Solution:** Verify `userAuthToken` is properly stored and sent with requests

**Issue:** Cart resets on page refresh
**Solution:** Ensure `localStorage.cart_id` is being set and read

**Issue:** Validation errors not displaying
**Solution:** Check that `parseValidationError` correctly extracts `error.data.errors`

---

## Next Steps

- Review the **[API Reference](../API_REFERENCE.md)** for all endpoints
- See **[EXAMPLES.md](./EXAMPLES.md)** for complete code examples
- Check **[TYPES_REFERENCE.md](./TYPES_REFERENCE.md)** for type definitions
