import type { Feedback, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * FeedbackService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class FeedbackService extends BaseService {
  private static instance: FeedbackService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {FeedbackService} The singleton instance of FeedbackService
 */
  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService()
    }
    return FeedbackService.instance
  }
  /**
 * Fetches Feedback from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/feedback Get feedback
 * 
 * @example
 * // Example usage
 * const result = await feedbackService.listFeedbacks({ page: 1 });
 */
  async listFeedbacks({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<Feedback[]>(
      `/api/feedbacks?page=${page}&q=${q}&sort=${sort}`
    )
  }
}

// // Use singleton instance
export const feedbackService = FeedbackService.getInstance()
