import type { Reels, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * ReelsService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class ReelsService extends BaseService {
  private static instance: ReelsService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {ReelsService} The singleton instance of ReelsService
 */
  static getInstance(): ReelsService {
    if (!ReelsService.instance) {
      ReelsService.instance = new ReelsService()
    }
    return ReelsService.instance
  }
  /**
 * Fetches Reels from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/reels Get reels
 * 
 * @example
 * // Example usage
 * const result = await reelsService.list({ page: 1 });
 */
  async list() {
    return this.get<PaginatedResponse<Reels>>('/api/reels')
  }
}

// Use singleton instance
export const reelsService = ReelsService.getInstance()
