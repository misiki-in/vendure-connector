import type { Category, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CategoryService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CategoryService extends BaseService {
  private static instance: CategoryService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CategoryService} The singleton instance of CategoryService
 */
  static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService()
    }
    return CategoryService.instance
  }
  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.fetchFooterCategories('123');
 */
  async fetchFooterCategories({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get(
      `/api/categories?page=${page}&q=${q}&sort=${sort}`
    ) as Promise<PaginatedResponse<Category>>
  }
  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.fetchFeaturedCategories('123');
 */
  async fetchFeaturedCategories({ limit = 100 }) {
    return this.get(`/api/categories/featured?limit=${limit}`) as Promise<
      PaginatedResponse<Category>
    >
  }

  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.fetchCategory('123');
 */

  async fetchCategory(id: string) {
    return this.get(`/api/product-categories?handle=${id}`) as Promise<Category>
  }

  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.fetchAllCategories('123');
 */

  async fetchAllCategories() {
    return this.get('/api/categories') as Promise<PaginatedResponse<Category>>
  }

  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.fetchAllProductsOfCategories('123');
 */

  async fetchAllProductsOfCategories(id: string) {
    return this.get(`/api/product-categories?handle=${id}`) as Promise<
      PaginatedResponse<Category>
    >
  }

  /**
 * Fetches a single Category by ID
 * 
 * @param {string} id - The ID of the category to fetch
 * @returns {Promise<any>} The requested category
 * @api {get} /api/category/:id Get category by ID
 * 
 * @example
 * // Example usage
 * const category = await categoryService.getMegamenu('123');
 */

  async getMegamenu() {
    return this.get('/api/categories/megamenu') as Promise<
      PaginatedResponse<Category>
    >
  }
}

// // Use singleton instance
export const categoryService = CategoryService.getInstance()
