import type { State } from './../types'

import { BaseService } from './base.service'

/**
 * StateService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class StateService extends BaseService {
  private static instance: StateService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {StateService} The singleton instance of StateService
 */
  static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService()
    }
    return StateService.instance
  }
  /**
 * Fetches State from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/state Get state
 * 
 * @example
 * // Example usage
 * const result = await stateService.list({ page: 1 });
 */
  async list() {
    return this.get<State[]>('/api/states')
  }
}

// Use singleton instance
export const stateService = StateService.getInstance()
