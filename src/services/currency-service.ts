import type { Currency, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CurrencyService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CurrencyService extends BaseService {
  private static instance: CurrencyService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CurrencyService} The singleton instance of CurrencyService
 */
  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }
  /**
 * Fetches Currency from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/currency Get currency
 * 
 * @example
 * // Example usage
 * const result = await currencyService.listCurrencies({ page: 1 });
 */
  async listCurrencies() {
    return this.get<PaginatedResponse<Currency>>('/api/currencies')
  }
}

// // Use singleton instance
export const currencyService = CurrencyService.getInstance()
