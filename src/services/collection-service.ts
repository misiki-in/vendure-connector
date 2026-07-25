import type { Collection, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CollectionService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CollectionService extends BaseService {
  private static instance: CollectionService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CollectionService} The singleton instance of CollectionService
 */
  static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService()
    }
    return CollectionService.instance
  }
  /**
 * Fetches Collection from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/collection Get collection
 * 
 * @example
 * // Example usage
 * const result = await collectionService.list({ page: 1 });
 */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get(
      `/api/collections?page=${page}&q=${q}&sort=${sort}`
    ) as Promise<PaginatedResponse<Collection>>
  }

  /**
 * Fetches a single Collection by ID
 * 
 * @param {string} id - The ID of the collection to fetch
 * @returns {Promise<any>} The requested collection
 * @api {get} /api/collection/:id Get collection by ID
 * 
 * @example
 * // Example usage
 * const collection = await collectionService.getOne('123');
 */

  async getOne(id: string) {
    return this.get(`/api/collections/${id}`) as Promise<Collection>
  }

  /**
 * Fetches a single Collection by ID
 * 
 * @param {string} id - The ID of the collection to fetch
 * @returns {Promise<any>} The requested collection
 * @api {get} /api/collection/:id Get collection by ID
 * 
 * @example
 * // Example usage
 * const collection = await collectionService.getAllRatings('123');
 */

  async getAllRatings() {
    return this.get('/api/collections/all-ratings') as Promise<Collection>
  }
}

// // Use singleton instance
export const collectionService = CollectionService.getInstance()
