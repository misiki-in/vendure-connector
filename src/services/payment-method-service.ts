import type { PaymentMethod, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * PaymentMethodService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class PaymentMethodService extends BaseService {
  private static instance: PaymentMethodService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {PaymentMethodService} The singleton instance of PaymentMethodService
 */
  static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService()
    }
    return PaymentMethodService.instance
  }
  /**
 * Fetches PaymentMethod from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/paymentmethod Get paymentmethod
 * 
 * @example
 * // Example usage
 * const result = await paymentmethodService.list({ page: 1 });
 */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<PaymentMethod>>(
      `/api/payment-methods?page=${page}&q=${q}&sort=${sort}`
    )
  }
}

// Use singleton instance
export const paymentMethodService = PaymentMethodService.getInstance()
