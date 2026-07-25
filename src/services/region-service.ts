import type { Region } from './../types'

import { BaseService } from './base.service'

/**
 * RegionService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class RegionService extends BaseService {
  private static instance: RegionService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {RegionService} The singleton instance of RegionService
 */
  static getInstance(): RegionService {
    if (!RegionService.instance) {
      RegionService.instance = new RegionService()
    }
    return RegionService.instance
  }
  /**
 * Fetches a single Region by ID
 * 
 * @param {string} id - The ID of the region to fetch
 * @returns {Promise<any>} The requested region
 * @api {get} /api/region/:id Get region by ID
 * 
 * @example
 * // Example usage
 * const region = await regionService.getRegionByRegionId('123');
 */
  async getRegionByRegionId(id: string) {
    return this.get<Region>('/api/settings')
  }
}

// Use singleton instance
export const regionService = RegionService.getInstance()
