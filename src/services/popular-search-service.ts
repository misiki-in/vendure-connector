import type { PopularSearch, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * PopularSearchService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class PopularSearchService extends BaseService {
  private static instance: PopularSearchService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {PopularSearchService} The singleton instance of PopularSearchService
 */
  static getInstance(): PopularSearchService {
    if (!PopularSearchService.instance) {
      PopularSearchService.instance = new PopularSearchService()
    }
    return PopularSearchService.instance
  }
  /**
 * Fetches PopularSearch from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/popularsearch Get popularsearch
 * 
 * @example
 * // Example usage
 * const result = await popularsearchService.listPopularSearch({ page: 1 });
 */
  async listPopularSearch({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<PopularSearch>>(
      `/api/popular-search?page=${page}&q=${q}&sort=${sort}`
    )
  }
}

// Use singleton instance
export const popularSearchService = PopularSearchService.getInstance()
