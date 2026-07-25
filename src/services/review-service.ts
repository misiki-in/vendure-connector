import type { Feedback, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * ReviewService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class ReviewService extends BaseService {
  private static instance: ReviewService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {ReviewService} The singleton instance of ReviewService
 */
  static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService()
    }
    return ReviewService.instance
  }
  /**
 * Fetches a single Review by ID
 * 
 * @param {string} id - The ID of the review to fetch
 * @returns {Promise<any>} The requested review
 * @api {get} /api/review/:id Get review by ID
 * 
 * @example
 * // Example usage
 * const review = await reviewService.fetchReviews('123');
 */
  async fetchReviews({
    productId,
    search = '',
    sort = '-createdAt',
    currentPage = 1
  }: {
    productId: string
    search: string
    sort: string
    currentPage: number
  }) {
    return this.get<PaginatedResponse<Feedback>>(
      `/api/reviews/me?product_id=${productId}&q=${search}&sort=${sort}&page=${currentPage}`
    )
  }
  async allReviews({
    search = '',
    sort = '-createdAt',
    currentPage = 1
  }: {
    search: string
    sort: string
    currentPage: number
  }) {
    return this.get<PaginatedResponse<Feedback>>('/api/products/all-ratings')
  }

  /**
 * Fetches a single Review by ID
 * 
 * @param {string} id - The ID of the review to fetch
 * @returns {Promise<any>} The requested review
 * @api {get} /api/review/:id Get review by ID
 * 
 * @example
 * // Example usage
 * const review = await reviewService.fetchProducrReviews('123');
 */

  async fetchProducrReviews(productId: string) {
    return this.get<PaginatedResponse<Feedback>>(
      `/api/reviews?product-id=${productId}`
    )
  }

  /**
 * Creates a new Review
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created review
 * @api {post} /api/review Create review
 * 
 * @example
 * // Example usage
 * const newReview = await reviewService.saveReview({ 
 *   // required fields
 * });
 */

  async saveReview(review: Omit<Feedback, 'id'>) {
    return this.post<Feedback>('/api/reviews', review)
  }
}

// Use singleton instance
export const reviewService = ReviewService.getInstance()
