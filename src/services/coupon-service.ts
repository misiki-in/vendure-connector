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
    // Vendure applies coupon codes at the cart, but exposes no list of them to a shopper.
    return { data: [], count: 0 } as any
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

  // Coupon records are admin data on Vendure; a shopper only ever applies a code to their order.
  async getCoupon(id: string) {
    throw new Error('Coupons cannot be read individually on this store.')
    return undefined as unknown as Coupon
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

  async createCoupon(_coupons: Omit<Coupon, 'id'>) {
    throw new Error('Coupons are managed in the Vendure admin, not from the storefront.')
    return undefined as unknown as Coupon
  }

  async patchCoupon(id: string, coupons: Partial<Coupon>) {
    throw new Error('Coupons are managed in the Vendure admin, not from the storefront.')
  }

  async deleteCoupon(id: string) {
    throw new Error('Coupons are managed in the Vendure admin, not from the storefront.')
  }
}

// // Use singleton instance
export const couponService = CouponService.getInstance()
