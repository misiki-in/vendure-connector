import type { PaginatedResponse, Wishlist } from './../types'

import { BaseService } from './base.service'

/**
 * WishlistService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Managing user wishlists
 * - Adding and removing products from wishlists
 * - Checking if products are in a user's wishlist
 */
export class WishlistService extends BaseService {
  private static instance: WishlistService

  /**
   * Get the singleton instance
   *
   * @returns {WishlistService} The singleton instance of WishlistService
   */
  static getInstance(): WishlistService {
    if (!WishlistService.instance) {
      WishlistService.instance = new WishlistService()
    }
    return WishlistService.instance
  }

  /**
   * Fetches the user's wishlist with optional search, sorting, and pagination
   *
   * @param {Object} options - The options for fetching the wishlist
   * @param {string} [options.q=''] - Search query string
   * @param {string} [options.sort=''] - Sort order
   * @param {number} [options.page=1] - Page number for pagination
   * @returns {Promise<PaginatedResponse<Wishlist>>} The user's wishlist
   * @api {get} /api/wishlists/me Get user's wishlist
   *
   * @example
   * // Example usage
   * const wishlist = await wishlistService.fetchWishlist({ page: 1 });
   */
  async fetchWishlist({ q = '', sort = '', page = 1 }) {
    return this.get<PaginatedResponse<Wishlist>>('/api/wishlists/me')
  }

  /**
   * Checks if a specific product is in the user's wishlist
   *
   * @param {Object} params - The parameters for checking the wishlist
   * @param {string} params.productId - The product ID to check
   * @param {string} params.variantId - The variant ID to check
   * @returns {Promise<boolean>} True if the product is in the wishlist, false otherwise
   * @api {get} /api/wishlists/me/check Check if product is in wishlist
   *
   * @example
   * // Example usage
   * const isInWishlist = await wishlistService.checkWishlist({
   *   productId: '123',
   *   variantId: '456'
   * });
   */
  async checkWishlist({
    productId,
    variantId
  }: {
    productId: string
    variantId: string
  }) {
    return this.get<boolean>(
      `/api/wishlists/me/check?productId=${productId}&variantId=${variantId}`
    )
  }

  /**
   * Checks in bulk if products are in the user's wishlist
   * @example
   * // Example usage
   * const res = await wishlistService.checkWishlistinBulk([{
   *   productId: '123',
   *   variantId: '456'
   * }]);
   */
  async checkWishlistInBulk(ids: { productId: string, variantId: string }[]) {
    return this.post<{ productId: string, variantId: string, exists: boolean }[]>('/api/wishlists/me/bulk-check', ids)
  }
  /**
   * Toggles a product's presence in the user's wishlist
   * If the product is already in the wishlist, it will be removed
   * If the product is not in the wishlist, it will be added
   *
   * @param {Object} params - The parameters for toggling the wishlist
   * @param {string} params.productId - The product ID to toggle
   * @param {string} params.variantId - The variant ID to toggle
   * @returns {Promise<Wishlist>} The updated wishlist
   * @api {post} /api/wishlists/me/toggle Toggle product in wishlist
   *
   * @example
   * // Example usage
   * const updatedWishlist = await wishlistService.toggleWishlist({
   *   productId: '123',
   *   variantId: '456'
   * });
   */
  async toggleWishlist({
    productId,
    variantId
  }: {
    productId: string
    variantId: string
  }) {
    return this.post<Wishlist>('/api/wishlists/me/toggle', {
      productId,
      variantId
    })
  }
}

// Use singleton instance
export const wishlistService = WishlistService.getInstance()
