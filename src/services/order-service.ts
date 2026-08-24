import type { PaginatedResponse, Order } from './../types'

import { BaseService } from './base.service'
import { fromMinorUnits } from '../utils/money'

// Vendure serves a guest the order it just placed by code (two hours by default), which covers the
// confirmation page; order history hangs off the signed-in customer.
const ORDER_FIELDS = `
  id
  code
  state
  createdAt
  currencyCode
  subTotalWithTax
  shippingWithTax
  totalWithTax
  customer { id emailAddress firstName lastName phoneNumber }
  shippingAddress { fullName streetLine1 streetLine2 city province postalCode countryCode phoneNumber }
  shippingLines { priceWithTax shippingMethod { name description } }
  lines {
    id
    quantity
    unitPriceWithTax
    linePriceWithTax
    featuredAsset { preview }
    productVariant { name sku featuredAsset { preview } product { slug featuredAsset { preview } } }
  }
`

const ORDER_BY_CODE_QUERY = `
  query OrderByCode($code: String!) {
    orderByCode(code: $code) { ${ORDER_FIELDS} }
  }
`

const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        totalItems
        items { ${ORDER_FIELDS} }
      }
    }
  }
`

const PAGE_SIZE = 10

// Vendure keeps one `fullName`; the storefront prints first and last separately.
const splitName = (fullName?: string, customer?: { firstName?: string; lastName?: string }) => {
  if (customer?.firstName || customer?.lastName) {
    return { firstName: customer.firstName || '', lastName: customer.lastName || '' }
  }
  const parts = (fullName || '').trim().split(/\s+/)
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') }
}

// Vendure's Order -> the shape the storefront reads (orderNo, lineItems, shippingAddress.address_1,
// ...), matching the field names this connector's cart mapping already uses.
const mapVendureOrder = (order: any): Order => {
  const currencyCode = order?.currencyCode
  const { firstName, lastName } = splitName(order?.shippingAddress?.fullName, order?.customer)

  return {
    id: order?.id,
    orderNo: order?.code,
    order_no: order?.code,
    // /my/orders links the detail page by parentOrderNo; the code is the handle here.
    parentOrderNo: order?.code,
    status: order?.state,
    paymentStatus: order?.state,
    createdAt: order?.createdAt,
    userEmail: order?.customer?.emailAddress || '',
    subtotal: fromMinorUnits(order?.subTotalWithTax, currencyCode),
    shippingCharges: fromMinorUnits(order?.shippingWithTax, currencyCode),
    total: fromMinorUnits(order?.totalWithTax, currencyCode),
    currencyCode,
    shippingRate: order?.shippingLines?.[0]
      ? {
          name: order.shippingLines[0]?.shippingMethod?.name || '',
          description: order.shippingLines[0]?.shippingMethod?.description || ''
        }
      : null,
    shippingAddress: {
      firstName,
      lastName,
      email: order?.customer?.emailAddress || '',
      phone: order?.shippingAddress?.phoneNumber || order?.customer?.phoneNumber || '',
      address_1: order?.shippingAddress?.streetLine1 || '',
      address_2: order?.shippingAddress?.streetLine2 || '',
      city: order?.shippingAddress?.city || '',
      state: order?.shippingAddress?.province || '',
      zip: order?.shippingAddress?.postalCode || '',
      countryCode: order?.shippingAddress?.countryCode || ''
    },
    lineItems: (order?.lines || []).map((line: any) => ({
      id: line?.id,
      title: line?.productVariant?.name || '',
      variantTitle: line?.productVariant?.sku || '',
      slug: line?.productVariant?.product?.slug || '',
      thumbnail:
        line?.featuredAsset?.preview ||
        line?.productVariant?.featuredAsset?.preview ||
        line?.productVariant?.product?.featuredAsset?.preview ||
        null,
      qty: line?.quantity,
      price: fromMinorUnits(line?.unitPriceWithTax, currencyCode),
      subtotal: fromMinorUnits(line?.linePriceWithTax, currencyCode),
      // The orders list prints `total`; the confirmation page prints `subtotal`.
      total: fromMinorUnits(line?.linePriceWithTax, currencyCode)
    }))
  } as unknown as Order
}

const emptyOrders = (page = 1): PaginatedResponse<Order> =>
  ({ data: [], count: 0, pageSize: PAGE_SIZE, noOfPage: 0, page }) as unknown as PaginatedResponse<Order>

/**
 * OrderService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class OrderService extends BaseService {
  private static instance: OrderService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {OrderService} The singleton instance of OrderService
 */
  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }
  /**
 * Fetches Order from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/order Get order
 * 
 * @example
 * // Example usage
 * const result = await orderService.list({ page: 1 });
 */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    const current = Number(page) > 0 ? Number(page) : 1
    const res = await this.query<{
      activeCustomer?: { orders?: { totalItems?: number; items?: any[] } } | null
    }>('/shop-api', CUSTOMER_ORDERS_QUERY, {
      options: { skip: (current - 1) * PAGE_SIZE, take: PAGE_SIZE, sort: { createdAt: 'DESC' } }
    })

    const orders = res?.activeCustomer?.orders
    if (!orders?.items?.length) return emptyOrders(current)

    const count = orders.totalItems ?? orders.items.length
    return {
      data: orders.items.map(mapVendureOrder),
      count,
      pageSize: PAGE_SIZE,
      noOfPage: Math.ceil(count / PAGE_SIZE) || 1,
      page: current
    } as unknown as PaginatedResponse<Order>
  }

  /**
 * Fetches Order from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/order Get order
 * 
 * @example
 * // Example usage
 * const result = await orderService.listOrdersByParent({ page: 1 });
 */

  async listOrdersByParent({
    orderNo,
    cartId
  }: {
    orderNo: string | null
    cartId: string | null
  }) {
    // 'undefined' can arrive as a literal: the confirmation URL is built by interpolation upstream.
    const code = orderNo && orderNo !== 'undefined' ? orderNo : ''
    if (!code) return emptyOrders()

    const res = await this.query<{ orderByCode?: any }>('/shop-api', ORDER_BY_CODE_QUERY, { code })
    if (!res?.orderByCode) return emptyOrders()

    return {
      data: [mapVendureOrder(res.orderByCode)],
      count: 1,
      pageSize: 1,
      noOfPage: 1,
      page: 1
    } as unknown as PaginatedResponse<Order>
  }

  /**
 * Fetches a single Order by ID
 * 
 * @param {string} id - The ID of the order to fetch
 * @returns {Promise<any>} The requested order
 * @api {get} /api/orders/:id Get order by ID
 * 
 * @example
 * // Example usage
 * const order = await orderService.fetchOrder('123');
 */

  async fetchOrder(id: string) {
    return this.getOrder(id)
  }

  /**
 * Fetches a single Order by ID
 * 
 * @param {string} id - The ID of the order to fetch
 * @returns {Promise<any>} The requested order
 * @api {get} /api/orders/:id Get order by ID
 * 
 * @example
 * // Example usage
 * const order = await orderService.getOrder('123');
 */

  async getOrder(orderNo: string) {
    const code = orderNo && orderNo !== 'undefined' ? orderNo : ''
    if (!code) return {} as Order

    const res = await this.query<{ orderByCode?: any }>('/shop-api', ORDER_BY_CODE_QUERY, { code })
    return (res?.orderByCode ? mapVendureOrder(res.orderByCode) : ({} as Order)) as Order
  }

  /**
 * Fetches a single Order by ID
 * 
 * @param {string} id - The ID of the order to fetch
 * @returns {Promise<any>} The requested order
 * @api {get} /api/orders/:id Get order by ID
 * 
 * @example
 * // Example usage
 * const order = await orderService.fetchTrackOrder('123');
 */

  async fetchTrackOrder(id: string) {
    return this.listOrdersByParent({ orderNo: id, cartId: null })
  }

  async paySuccessPageHit(orderId: string) {
    return this.getOrder(orderId)
  }

  // Checkout runs through CheckoutService on Vendure; these legacy REST entry points have no
  // equivalent here and must not fall back to an API a Vendure store does not run.
  async codCheckout(_params: any): Promise<Order> {
    throw new Error('Use checkoutService.checkoutCOD() on Vendure.')
  }

  async cashfreeCheckout(_params: any): Promise<Order> {
    throw new Error('Cashfree checkout is not implemented for Vendure.')
  }

  async razorpayCheckout(_params: any): Promise<Order> {
    throw new Error('Use checkoutService.checkoutRazorpay() on Vendure.')
  }

  async stripeCheckout(_params: any): Promise<Order> {
    throw new Error('Use checkoutService.checkoutStripe() on Vendure.')
  }

  async razorCapture(_params: any): Promise<Order> {
    throw new Error('Use checkoutService.captureRazorpayPayment() on Vendure.')
  }

  /**
 * Fetches Order from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/order Get order
 * 
 * @example
 * // Example usage
 * const result = await orderService.listPublic({ page: 1 });
 */

  // Vendure has no public order feed.
  async listPublic() {
    return emptyOrders()
  }

  /**
 * Fetches a single Order by ID
 * 
 * @param {string} id - The ID of the order to fetch
 * @returns {Promise<any>} The requested order
 * @api {get} /api/orders/:id Get order by ID
 * 
 * @example
 * // Example usage
 * const order = await orderService.getOrderByEmailAndOTP('123');
 */

  // Vendure has no email+OTP order lookup; a guest reaches an order by its code instead.
  async getOrderByEmailAndOTP({ email, otp }: { email: string; otp: string }) {
    return emptyOrders()
  }

  // No Vendure equivalent; the shopper's past orders come from `list()`.
  async buyAgain() {
    return emptyOrders()
  }

  // Vendure ships no product review API, and a silent success would tell the shopper their review
  // was saved when nothing left the browser.
  async submitReview(_params: any): Promise<any> {
    throw new Error('Product reviews are not available on this store.')
  }
}

// Use singleton instance
export const orderService = OrderService.getInstance()
