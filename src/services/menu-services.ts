import type { Menu } from './../types'
import { readStaticStore } from './static-store'

import { BaseService } from './base.service'

/**
 * MenuService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class MenuService extends BaseService {
  private static instance: MenuService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {MenuService} The singleton instance of MenuService
 */
  static getInstance(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService()
    }
    return MenuService.instance
  }
  /**
 * Fetches Menu from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/menu Get menu
 * 
 * @example
 * // Example usage
 * const result = await menuService.list({ page: 1 });
 */
  async list() {
    // The nav reads `response.data` and filters on `menuId`; Vendure has no menu API, so serve the
    // menus recorded with the storefront's store identity.
    const staticStore = await readStaticStore()
    if (staticStore) return { data: staticStore.menu ?? [] } as unknown as Menu[]

    return this.get<Menu[]>('/api/menu')
  }
}

// Use singleton instance
export const menuService = MenuService.getInstance()
