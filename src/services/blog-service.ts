import type { Blog, PaginatedResponse } from './../types'
import { BaseService } from './base.service'

/**
 * BlogService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class BlogService extends BaseService {
  private static instance: BlogService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {BlogService} The singleton instance of BlogService
 */
  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService()
    }
    return BlogService.instance
  }

  /**
 * Fetches Blog from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/blog Get blog
 * 
 * @example
 * // Example usage
 * const result = await blogService.list({ page: 1 });
 */

  async list({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<Blog>>(
      `/api/blogs?page=${page}&q=${q}&sort=${sort}`
    )
  }

  /**
 * Fetches a single Blog by ID
 * 
 * @param {string} id - The ID of the blog to fetch
 * @returns {Promise<any>} The requested blog
 * @api {get} /api/blog/:id Get blog by ID
 * 
 * @example
 * // Example usage
 * const blog = await blogService.getOne('123');
 */

  async getOne(id: string) {
    return this.get<Blog>(`/api/blogs/${id}`)
  }
}

// // Use singleton instance
export const blogService = BlogService.getInstance()
