import type { Country } from './../types'

import { BaseService } from './base.service'

/**
 * CountryService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CountryService extends BaseService {
  private static instance: CountryService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CountryService} The singleton instance of CountryService
 */
  static getInstance(): CountryService {
    if (!CountryService.instance) {
      CountryService.instance = new CountryService()
    }
    return CountryService.instance
  }
  /**
 * Fetches Country from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/country Get country
 * 
 * @example
 * // Example usage
 * const result = await countryService.list({ page: 1 });
 */
  async list() {
    return this.get<Country[]>('/api/countries/all')
  }
}

// // Use singleton instance
export const countryService = CountryService.getInstance()
