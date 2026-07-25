import type { Home } from './../types'

import { BaseService } from './base.service'

/**
 * HomeService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class HomeService extends BaseService {
  private static instance: HomeService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {HomeService} The singleton instance of HomeService
 */
  static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService()
    }
    return HomeService.instance
  }
  /**
 * Fetches a single Home by ID
 * 
 * @param {string} id - The ID of the home to fetch
 * @returns {Promise<any>} The requested home
 * @api {get} /api/home/:id Get home by ID
 * 
 * @example
 * // Example usage
 * const home = await homeService.getHome('123');
 */
  async getHome() {
    return this.get<Home[]>('/api/home')
  }
}

// Use singleton instance
export const homeService = HomeService.getInstance()
