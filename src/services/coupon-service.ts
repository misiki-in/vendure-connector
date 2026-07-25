import type { Coupon, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CouponService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CouponService extends BaseService {
  private static instance: CouponService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CouponService} The singleton instance of CouponService
 */
  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService()
    }
    return CouponService.instance
  }
  /**
 * Fetches Coupon from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/coupon Get coupon
 * 
 * @example
 * // Example usage
 * const result = await couponService.listCoupons({ page: 1 });
 */
  async listCoupons({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<Coupon>>(
      `/api/coupons?page=${page}&q=${q}&sort=${sort}`
    )
  }

  async searchCoupons({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get<PaginatedResponse<Coupon>>(
      `/api/coupons?page=${page}&q=${q}&sort=${sort}`
    )
  }

  /**
 * Fetches a single Coupon by ID
 * 
 * @param {string} id - The ID of the coupon to fetch
 * @returns {Promise<any>} The requested coupon
 * @api {get} /api/coupon/:id Get coupon by ID
 * 
 * @example
 * // Example usage
 * const coupon = await couponService.getCoupon('123');
 */

  async getCoupon(id: string) {
    return this.get<Coupon>(`/api/coupons/${id}`)
  }

  /**
 * Creates a new Coupon
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created coupon
 * @api {post} /api/coupon Create coupon
 * 
 * @example
 * // Example usage
 * const newCoupon = await couponService.createCoupon({ 
 *   // required fields
 * });
 */

  async createCoupon(coupons: Omit<Coupon, 'id'>) {
    return this.post<Coupon>('/api/coupons', coupons)
  }

  async patchCoupon(id: string, coupons: Partial<Coupon>) {
    return this.put<Coupon>(`/api/coupons/${id}`, coupons)
  }

  async deleteCoupon(id: string) {
    return this.delete<Coupon>(`/api/coupons/${id}`)
  }
}

// // Use singleton instance
export const couponService = CouponService.getInstance()
