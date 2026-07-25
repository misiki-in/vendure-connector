import type { Faq, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * FaqService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class FaqService extends BaseService {
  private static instance: FaqService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {FaqService} The singleton instance of FaqService
 */
  static getInstance(): FaqService {
    if (!FaqService.instance) {
      FaqService.instance = new FaqService()
    }
    return FaqService.instance
  }
  /**
 * Fetches Faq from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/faq Get faq
 * 
 * @example
 * // Example usage
 * const result = await faqService.listFaqs({ page: 1 });
 */
  async listFaqs({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<Faq>>(
      `/api/faqs?page=${page}&q=${q}&sort=${sort}`
    )
  }
}

// // Use singleton instance
export const faqService = FaqService.getInstance()
