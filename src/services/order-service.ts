import type { PaginatedResponse, Order } from './../types'

import { BaseService } from './base.service'

/**
 * OrderService provides functionality for working with specific resources
 * in the Litekart API.
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
    return this.get(`/api/orders?page=${page}&q=${q}&sort=${sort}`) as Promise<
      PaginatedResponse<Order>
    >
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
    return this.get(
      `/api/orders/list-by-parent?order_no=${orderNo}&cart_id=${cartId}`
    ) as Promise<PaginatedResponse<Order>>
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
    return this.get(`/api/orders/${id}`) as Promise<Order>
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
    return this.get(`/api/orders/${orderNo}`) as Promise<Order>
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
    return this.get(`/api/orders/list-by-parent?id=${id}`) as Promise<
      PaginatedResponse<Order>
    >
  }

  async paySuccessPageHit(orderId: string) {
    return this.get(`/api/orders/${orderId}`) as Promise<Order>
  }

  async codCheckout({
    address,
    cartId,
    origin,
    paymentMethod,
    paymentProviderId,
    prescription
  }: any) {
    return this.post<Order>(`/api/carts/${cartId}/payment-sessions`, {
      provider_id: paymentProviderId
    })
  }

  async cashfreeCheckout({
    address,
    paymentMethod,
    prescription,
    origin
  }: any) {
    return this.get('/api/orders/me') as Promise<Order>
  }

  async razorpayCheckout({
    address,
    paymentMethod,
    prescription,
    origin
  }: any) {
    return this.get('/api/orders/me') as Promise<Order>
  }

  async stripeCheckout({ address, paymentMethod, prescription, origin }: any) {
    return this.get('/api/orders/me') as Promise<Order>
  }

  async razorCapture({ rpPaymentId, rpOrderId, origin }: any) {
    return this.get('/api/orders/me') as Promise<Order>
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

  async listPublic() {
    return this.get('/api/orders/public/list') as Promise<
      PaginatedResponse<Order>
    >
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

  async getOrderByEmailAndOTP({ email, otp }: { email: string; otp: string }) {
    return this.get(
      `/api/orders-public/list?otp=${otp}&email=${email}&sort=-createdAt`
    ) as Promise<PaginatedResponse<Order>>
  }

  async buyAgain() {
    return this.get('/api/orders/buy-again') as Promise<
      PaginatedResponse<Order>
    >
  }

  async submitReview({ rating, review, productId, variantId, uploadedImages }: any) {
		return this.post<any>(`/api/products/ratings-and-reviews`, {
			rating,
			review,
			productId,
			variantId,
			uploadedImages
		})
	}
}

// Use singleton instance
export const orderService = OrderService.getInstance()
