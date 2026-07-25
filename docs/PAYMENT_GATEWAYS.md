# Payment Gateways Guide

Comprehensive guide for implementing payment gateways with LiteKart Connector.

---

## Overview

LiteKart supports multiple payment gateways out of the box. The `checkoutService` provides methods for:

- ✅ **Razorpay** - India's leading payment gateway
- ✅ **Stripe** - Global credit card payments
- ✅ **PhonePe** - UPI and card payments (India)
- ✅ **Cashfree** - Indian payment gateway
- ✅ **PayPal** - International payments
- ✅ **Cash on Delivery (COD)** - Traditional payment
- ✅ **Affirm** - Buy now, pay later

---

## Payment Flow Architecture

### Standard Payment Flow

```
1. Customer clicks "Place Order"
              ↓
2. Create checkout session → checkoutService.checkout[GATEWAY]()
              ↓
3. Gateway returns authorization URL or popup config
              ↓
4. Customer completes payment on gateway's site
              ↓
5. Gateway redirects to your callback URL
              ↓
6. Verify payment status → orderService.getOrder()
              ↓
7. Show success/failure page
```

### Universal Checkout Handler

```typescript
interface PaymentConfig {
  cartId: string
  origin: string
  email?: string
  phone?: string
  return_url?: string
  storeId?: string
  addressId?: string
}

interface PaymentResult {
  success: boolean
  orderId?: string
  redirectUrl?: string
  paymentUrl?: string
  authorizationUrl?: string
  widgetOptions?: Record<string, any>
  error?: string
}
```

---

## Razorpay Integration

### Setup Configuration

```typescript
// 1. Store these in your environment
RAZORPAY_KEY_ID = 'rzp_live_xxxxxxxxxxxx'
RAZORPAY_KEY_SECRET = 'xxxxxxxxxxxxxxxxxxxx'

// 2. Configure in LiteKart backend
// - Go to Admin → Payment Methods
// - Enable Razorpay
// - Enter Key ID and Key Secret
// - Set webhook URL: https://yourstore.com/api/webhooks/razorpay
```

### Checkout Implementation

```typescript
// checkout/razorpay/[cartId].tsx (Next.js App Router)
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { checkoutService } from '@misiki/litekart-connector'
import Razorpay from 'razorpay'  // npm i razorpay

export default function RazorpayCheckout() {
  const router = useRouter()
  const { cartId } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cartId || typeof cartId !== 'string') return

    initiateRazorpay(cartId)
  }, [cartId])

  const initiateRazorpay = async (cartId: string) => {
    try {
      setLoading(true)

      // Get checkout session
      const checkout = await checkoutService.checkoutRazorpay({
        cartId,
        origin: window.location.origin
      })

      // Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: checkout.amount, // in paise (multiply by 100)
        currency: checkout.currency || 'INR',
        name: 'Your Store Name',
        description: `Order #${checkout.orderNo}`,
        order_id: checkout.razorpayOrderId,
        handler: function (response: any) {
          // Payment successful - capture payment
          captureRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id
          )
        },
        prefill: {
          name: checkout.customerName,
          email: checkout.email,
          contact: checkout.phone
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          // Prevent closing
          ondismiss: function () {
            router.push('/checkout/failed')
          }
        }
      }

      // Open Razorpay checkout
      const razorpay = new Razorpay(options)
      razorpay.open()

      // Cleanup on unmount
      return () => razorpay.close()
    } catch (error: any) {
      setError(error.message || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  const captureRazorpayPayment = async (
    orderId: string,
    paymentId: string
  ) => {
    try {
      const result = await checkoutService.captureRazorpayPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId
      })

      // Payment successful
      router.push(`/order/confirmation/${result.orderNo}`)
    } catch (error: any) {
      router.push(`/order/failed?reason=${encodeURIComponent(error.message)}`)
    }
  }

  if (loading) return <div>Redirecting to payment...</div>
  if (error) return <div className="error">{error}</div>

  return null
}
```

### Server-Side Webhook (Optional)

```typescript
// pages/api/webhooks/razorpay.ts (Next.js API Route)
import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default async function razorpayWebhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'] as string
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    const body = JSON.stringify(req.body)

    const expectedSignature = crypto
      .createHmac('sha256', secret!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body.event

    switch (event) {
      case 'payment.captured':
        // Update order status
        await updateOrderFromRazorpay(req.body.payload)
        break

      case 'payment.failed':
        // Handle failed payment
        await handleFailedPayment(req.body.payload)
        break
    }

    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    res.status(500).json({ error: 'Webhook failed' })
  }
}
```

---

## Stripe Integration

### Checkout Session

```typescript
async function initiateStripeCheckout(cartId: string) {
  try {
    const checkout = await checkoutService.checkoutStripe({
      cartId,
      origin: window.location.origin
    })

    // Redirect to Stripe Checkout
    if (checkout.sessionId) {
      const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

      await stripe.redirectToCheckout({
        sessionId: checkout.sessionId
      })
    }
  } catch (error) {
    console.error('Stripe checkout failed:', error)
  }
}
```

### Stripe Webhook Configuration

```typescript
// pages/api/webhooks/stripe.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { stripeWebhookHandler } from '@/lib/stripe-handler'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      webhookSecret
    )
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  await stripeWebhookHandler(event)

  res.json({ received: true })
}
```

---

## PhonePe Integration

### Checkout Flow

```typescript
import { checkoutService } from '@misiki/litekart-connector'

async function initiatePhonePeCheckout(cartId: string) {
  try {
    // Get user data for prefill
    const cart = await cartService.fetchCartData()

    const checkout = await checkoutService.checkoutPhonepe({
      cartId,
      email: cart.email || 'customer@example.com',
      phone: cart.phone || '9999999999',
      origin: window.location.origin
    })

    // PhonePe returns a redirect URL
    if (checkout.redirectUrl) {
      window.location.href = checkout.redirectUrl
    } else {
      // Or embedded widget options
      renderPhonePeWidget(checkout.widgetOptions)
    }
  } catch (error: any) {
    console.error('PhonePe checkout failed:', error)
    showError('PhonePe payment is currently unavailable')
  }
}
```

---

## PayPal Integration

### PayPal Checkout

```typescript
import { loadScript } from '@/utils/load-script'

async function initiatePayPalCheckout(cartId: string) {
  try {
    // Load PayPal SDK
    await loadScript('https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD')

    const checkout = await checkoutService.checkoutPaypal({
      cartId,
      origin: window.location.origin,
      return_url: `${window.location.origin}/order/confirm`
    })

    // PayPal will redirect to return_url with payment details
    window.location.href = checkout.approvalUrl
  } catch (error: any) {
    console.error('PayPal checkout failed:', error)
  }
}

// Return page handler
export default async function PayPalReturnPage({ searchParams }) {
  const { paymentId, token, PayerID } = searchParams

  // Capture payment (handled by backend)
  // Show confirmation
  return <OrderConfirmation paymentId={paymentId} />
}
```

---

## Cash on Delivery (COD)

### Simple COD Checkout

```typescript
async function initiateCOD(cartId: string) {
  try {
    // Check if COD is available
    const cart = await cartService.fetchCartData()

    if (!cart.isCodAvailable) {
      return {
        success: false,
        error: 'Cash on delivery is not available for your location or order value'
      }
    }

    const checkout = await checkoutService.checkoutCOD({
      cartId,
      origin: window.location.origin
    })

    // COD order created - no payment required immediately
    return {
      success: true,
      orderId: checkout.orderId,
      orderNo: checkout.orderNo
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create COD order'
    }
  }
}

// COD Confirmation Page
export default function CODOrderPage({ params }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Order already created, just fetch details
    orderService.getOrder(params.orderNo).then(setOrder).finally(() => setLoading(false))
  }, [params.orderNo])

  if (loading) return <div>Loading...</div>

  return (
    <div className="order-confirmation">
      <h1>Order Placed Successfully!</h1>

      <div className="order-details">
        <p><strong>Order Number:</strong> #{order.orderNo}</p>
        <p><strong>Total Amount:</strong> {order.total} {order.currencySymbol}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
      </div>

      <div className="instructions">
        <h3>What's Next?</h3>
        <ul>
          <li>Keep cash ready at the time of delivery</li>
          <li>Our delivery partner will call you to confirm</li>
          <li>You can track your order in "My Orders"</li>
        </ul>
      </div>

      <a href="/account/orders" className="button">
        View My Orders
      </a>
    </div>
  )
}
```

---

## Universal Payment Handler

### Abstract Payment Logic

```typescript
enum PaymentMethod {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
  PHONEPE = 'phonepe',
  CASHFREE = 'cashfree',
  PAYPAL = 'paypal',
  COD = 'cod',
  AFFIRM = 'affirm'
}

interface AvailablePaymentMethod {
  id: string
  name: string
  code: PaymentMethod
  icon?: string
  isActive: boolean
  config?: Record<string, any>  // Gateway-specific config
}

class PaymentHandler {
  private cartId: string
  private origin: string

  constructor(cartId: string, origin: string = window.location.origin) {
    this.cartId = cartId
    this.origin = origin
  }

  async process(method: PaymentMethod, params?: Record<string, any>): Promise<PaymentResult> {
    switch (method) {
      case PaymentMethod.RAZORPAY:
        return this.handleRazorpay(params)
      case PaymentMethod.STRIPE:
        return this.handleStripe(params)
      case PaymentMethod.PHONEPE:
        return this.handlePhonePe(params)
      case PaymentMethod.COD:
        return this.handleCOD(params)
      case PaymentMethod.PAYPAL:
        return this.handlePayPal(params)
      default:
        return {
          success: false,
          error: `Unsupported payment method: ${method}`
        }
    }
  }

  private async handleRazorpay(params?: Record<string, any>): Promise<PaymentResult> {
    try {
      const checkout = await checkoutService.checkoutRazorpay({
        cartId: this.cartId,
        origin: this.origin
      })

      return {
        success: true,
        orderId: checkout.orderId,
        redirectUrl: checkout.razorpayRedirectUrl,
        paymentUrl: checkout.paymentUrl,
        widgetOptions: {
          key: checkout.razorpayKeyId,
          order_id: checkout.razorpayOrderId,
          amount: checkout.amount,
          currency: checkout.currency
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        errorType: 'gateway'
      }
    }
  }

  private async handleStripe(params?: Record<string, any>): Promise<PaymentResult> {
    try {
      const checkout = await checkoutService.checkoutStripe({
        cartId: this.cartId,
        origin: this.origin
      })

      return {
        success: true,
        sessionId: checkout.sessionId,
        redirectUrl: checkout.url
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        errorType: 'gateway'
      }
    }
  }

  private async handleCOD(params?: Record<string, any>): Promise<PaymentResult> {
    try {
      const checkout = await checkoutService.checkoutCOD({
        cartId: this.cartId,
        origin: this.origin
      })

      return {
        success: true,
        orderId: checkout.orderId,
        orderNo: checkout.orderNo,
        requiresAction: false  // No payment action needed
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        errorType: 'validation'
      }
    }
  }

  // Implement other payment methods...
}

// Usage in checkout page
export default function CheckoutPage() {
  const [availableMethods, setAvailableMethods] = useState<AvailablePaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    const response = await paymentMethodService.list({})
    setAvailableMethods(response.data)
  }

  const handlePayment = async (method: PaymentMethod) => {
    setSelectedMethod(method)

    const handler = new PaymentHandler(cartId, window.location.origin)
    const result = await handler.process(method)

    setPaymentResult(result)

    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl
    } else if (result.success && !result.requiresAction) {
      // COD or similar - show success
      router.push(`/order/confirmation/${result.orderNo}`)
    }
  }

  return (
    <div>
      <h2>Payment Method</h2>

      {availableMethods.map(method => (
        <div
          key={method.id}
          className={`payment-option ${selectedMethod === method.code ? 'selected' : ''}`}
          onClick={() => handlePayment(method.code)}
        >
          {method.icon && <img src={method.icon} alt={method.name} />}
          <span>{method.name}</span>
          {!method.isActive && <span className="unavailable">(Unavailable)</span>}
        </div>
      ))}

      {paymentResult?.error && (
        <div className="payment-error">
          {paymentResult.error}
        </div>
      )}
    </div>
  )
}
```

---

## Payment Status Handling

```typescript
async function verifyPaymentStatus(orderId: string): Promise<{
  paid: boolean
  status: string
  amount: number
  paymentMethod?: string
  paidAt?: string
}> {
  try {
    const order = await orderService.getOrder(orderId)

    return {
      paid: order.paid,
      status: order.paymentStatus || order.status,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      paidAt: order.paymentDate
    }
  } catch (error: any) {
    console.error('Failed to verify payment:', error)
    return {
      paid: false,
      status: 'failed',
      amount: 0
    }
  }
}

// Payment status page
export default function PaymentStatusPage({ params }) {
  const [status, setStatus] = useState(null)
  const [order, setOrder] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Poll for payment confirmation
    const poll = setInterval(async () => {
      const result = await verifyPaymentStatus(params.orderId)
      setStatus(result)

      // Stop polling if payment is final
      if (result.paid || ['failed', 'cancelled', 'refunded'].includes(result.status)) {
        clearInterval(poll)
        setChecking(false)
        // Fetch full order details
        const orderData = await orderService.getOrder(params.orderId)
        setOrder(orderData)
      }
    }, 2000)

    return () => clearInterval(poll)
  }, [params.orderId])

  if (checking && !status) return <div>Checking payment status...</div>

  return (
    <div className="payment-status">
      {status?.paid ? (
        <div className="success">
          <h1>Payment Successful! ✓</h1>
          <p>Order #{order.orderNo} has been placed.</p>
          <p>Total: {order.total} {order.currencySymbol}</p>
          <a href={`/order/${order.orderNo}`}>View Order</a>
        </div>
      ) : status?.status === 'failed' ? (
        <div className="failed">
          <h1>Payment Failed</h1>
          <p>We couldn't process your payment.</p>
          <p>Please try again or use a different payment method.</p>
          <button onClick={() => router.push('/checkout')}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="processing">
          <h1>Processing Payment...</h1>
          <p>Please wait while we confirm your payment.</p>
          <div className="spinner" />
        </div>
      )}
    </div>
  )
}
```

---

## Affirm (BNPL) Integration

```typescript
async function initiateAffirmCheckout(cartId: string, addressId: string) {
  try {
    const storeId = getStoreId()

    // Create Affirm order
    const affirmCheckout = await checkoutService.createAffirmPayOrder({
      cartId,
      addressId,
      origin: window.location.origin,
      storeId,
      paymentMethodId: 'affirm'  // Find this ID from payment methods API
    })

    // Redirect to Affirm
    if (affirmCheckout.redirectUrl) {
      window.location.href = affirmCheckout.redirectUrl
    } else if (affirmCheckout.token) {
      // Embed Affirm modal
      affirmCheckout.show()
    }
  } catch (error: any) {
    console.error('Affirm checkout failed:', error)
  }
}

// After user approves on Affirm
async function confirmAffirmOrder(affirmToken: string, orderId: string) {
  const storeId = getStoreId()

  const result = await checkoutService.confirmAffirmOrder({
    affirmToken,
    orderId,
    storeId,
    origin: window.location.origin
  })

  if (result.success) {
    window.location.href = `/order/confirmation/${orderId}`
  }
}
```

---

## Multiple Payment Options Display

```typescript
function PaymentMethodSelector({ selected, onChange, availableMethods }) {
  const getIcon = (methodCode: string) => {
    const icons = {
      razorpay: '/icons/razorpay.svg',
      stripe: '/icons/stripe.svg',
      phonepe: '/icons/phonepe.svg',
      paypal: '/icons/paypal.svg',
      cod: '/icons/cash.svg'
    }
    return icons[methodCode] || '/icons/payment.png'
  }

  return (
    <div className="payment-methods">
      <h3>Select Payment Method</h3>

      {availableMethods.map(method => (
        <label
          key={method.id}
          className={`payment-method ${!method.isActive ? 'disabled' : ''} ${
            selected === method.code ? 'selected' : ''
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={method.code}
            checked={selected === method.code}
            onChange={() => onChange(method.code)}
            disabled={!method.isActive}
          />

          <img src={getIcon(method.code)} alt={method.name} />

          <div className="method-info">
            <span className="method-name">{method.name}</span>
            {method.description && (
              <small className="method-desc">{method.description}</small>
            )}
          </div>

          {!method.isActive && (
            <span className="unavailable-badge">Unavailable</span>
          )}
        </label>
      ))}
    </div>
  )
}
```

---

## Payment Security Best Practices

### 1. Use Server-Side Verification

```typescript
// Never trust client-side payment status
// Always verify on server

const verifyPaymentOnServer = async (paymentId: string, gateway: string) => {
  const response = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, gateway })
  })

  return response.json()
}
```

### 2. Validate Cart Before Checkout

```typescript
async function validateCartBeforePayment(cartId: string): Promise<{
  valid: boolean
  error?: string
}> {
  try {
    const cart = await cartService.fetchCartData()

    // Check cart belongs to user
    if (cart.userId !== getCurrentUserId()) {
      return { valid: false, error: 'Invalid cart' }
    }

    // Check cart not empty
    if (cart.lineItems.length === 0) {
      return { valid: false, error: 'Cart is empty' }
    }

    // Check stock
    for (const item of cart.lineItems) {
      if (item.qty > (item.variant?.stock || item.product?.stock || 0)) {
        return {
          valid: false,
          error: `"${item.product?.title}" is out of stock`
        }
      }
    }

    return { valid: true }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
```

### 3. Prevent Duplicate Payments

```typescript
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Use before processing payment
const key = generateIdempotencyKey()
localStorage.setItem('payment_idempotency_key', key)

// Send with request
await checkoutService.checkoutRazorpay({
  cartId,
  origin,
  idempotencyKey: key
})
```

---

## Testing Payments

### Sandbox Testing

```typescript
// Use sandbox keys in development
if (process.env.NODE_ENV === 'development') {
  process.env.RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxxxxxx'
  process.env.STRIPE_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxx'
}

// Mock payment responses in tests
jest.mock('checkoutService', () => ({
  checkoutRazorpay: jest.fn().mockResolvedValue({
    orderId: 'test_order_123',
    razorpayOrderId: 'order_test123',
    amount: 50000
  }),
  captureRazorpayPayment: jest.fn().mockResolvedValue({
    orderId: 'test_order_123',
    paymentId: 'pay_test123'
  })
}))
```

---

## Troubleshooting

### Razorpay

| Issue | Solution |
|-------|----------|
| "Invalid key" error | Verify KEY_ID in frontend and backend |
| Payment not captured | Check webhook URL configuration |
| Amount mismatch | Ensure amount is in paise (×100) |
| CORS error | Configure Razorpay dashboard for your domain |

### Stripe

| Issue | Solution |
|-------|----------|
| "No such payment_intent" | Use correct publishable key |
| Webhook not firing | Add endpoint to Stripe dashboard |
| Currency mismatch | Set currency in checkout options |

### PhonePe

| Issue | Solution |
|-------|----------|
| "Merchant not found" | Verify merchant ID and mid |
| UPI not showing | Ensure UPI is enabled in PhonePe dashboard |

---

## Next Steps

- See **[API_REFERENCE.md](./API_REFERENCE.md)** for all checkout methods
- Review **[EXAMPLES.md](./EXAMPLES.md)** for complete checkout flow examples
- Check **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** for payment error handling
