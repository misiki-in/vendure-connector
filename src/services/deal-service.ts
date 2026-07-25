import type { Deal, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * DealService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class DealService extends BaseService {
  private static instance: DealService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {DealService} The singleton instance of DealService
 */
  static getInstance(): DealService {
    if (!DealService.instance) {
      DealService.instance = new DealService()
    }
    return DealService.instance
  }
  /**
 * Fetches a single Deal by ID
 * 
 * @param {string} id - The ID of the deal to fetch
 * @returns {Promise<any>} The requested deal
 * @api {get} /api/deal/:id Get deal by ID
 * 
 * @example
 * // Example usage
 * const deal = await dealService.fetchDeals('123');
 */
  async fetchDeals() {
    return this.get<PaginatedResponse<Deal>>('/api/products')
  }
}

// // Use singleton instance
export const dealService = DealService.getInstance()
