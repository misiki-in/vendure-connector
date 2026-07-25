import type { Banner, PaginatedResponse } from './../types'
import { BaseService } from './base.service'

/**
 * BannerService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class BannerService extends BaseService {
  private static instance: BannerService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {BannerService} The singleton instance of BannerService
 */
  static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService()
    }
    return BannerService.instance
  }

  /**
 * Fetches Banner from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/banner Get banner
 * 
 * @example
 * // Example usage
 * const result = await bannerService.list({ page: 1 });
 */

  async list() {
    return this.get<PaginatedResponse<Banner>>('/api/banners')
  }

  /**
 * Fetches a single Banner by ID
 * 
 * @param {string} id - The ID of the banner to fetch
 * @returns {Promise<any>} The requested banner
 * @api {get} /api/banner/:id Get banner by ID
 * 
 * @example
 * // Example usage
 * const banner = await bannerService.fetchBannersGroup('123');
 */

  async fetchBannersGroup() {
    return this.get<PaginatedResponse<Banner>>('/api/banners')
  }
}

// Use singleton instance
export const bannerService = BannerService.getInstance()
