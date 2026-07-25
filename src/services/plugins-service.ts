import type { Plugins, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * PluginService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class PluginService extends BaseService {
  private static instance: PluginService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {PluginService} The singleton instance of PluginService
 */
  static getInstance(): PluginService {
    if (!PluginService.instance) {
      PluginService.instance = new PluginService()
    }
    return PluginService.instance
  }
  /**
 * Fetches Plugin from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/plugin Get plugin
 * 
 * @example
 * // Example usage
 * const result = await pluginService.list({ page: 1 });
 */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<Plugins>>(
      `/api/plugins?page=${page}&q=${q}&sort=${sort}`
    )
  }
}

// Use singleton instance
export const pluginService = PluginService.getInstance()
