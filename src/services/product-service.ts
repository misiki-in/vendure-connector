import type { PaginatedResponse, Product } from '../types'
import { BaseService } from './base.service'

/**
 * ProductService provides functionality for accessing and managing products
 * in the Litekart platform.
 *
 * This service helps with:
 * - Retrieving product listings with various filtering options
 * - Fetching detailed product information
 * - Managing product reviews and ratings
 * - Accessing product-related content like reels
 */
export class ProductService extends BaseService {
  private static instance: ProductService

  /**
   * Get the singleton instance
   *
   * @returns {ProductService} The singleton instance of ProductService
   */
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  /**
   * Retrieves a list of featured products
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of featured products
   * @api {get} /api/products?search=Featured List featured products
   *
   * @example
   * // Get the first page of featured products
   * const featuredProducts = await productService.listFeaturedProducts({});
   */
  async listFeaturedProducts({ page = 1, sort = '-createdAt' }) {
    const search = '' // "Featured"
    return this.get(
      `/api/products/featured?page=${page}&search=${search}&sort=${sort}`
    ) as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves a list of trending products
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.search=''] - Additional search query
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of trending products
   * @api {get} /api/products?search=Trending List trending products
   *
   * @example
   * // Get trending products with additional filtering
   * const trendingProducts = await productService.listTrendingProducts({
   *   page: 1,
   *   search: 'shoes'
   * });
   */
  async listTrendingProducts({ page = 1, search = '', sort = '-createdAt' }) {
    const q = 'Trending'
    return this.get(
      `/api/products?page=${page}&search=${search}&sort=${sort}`
    ) as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves products related to a specific category
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.categoryId=''] - ID of the category to filter by
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of related products
   * @api {get} /api/products?categories=:categoryId List related products
   *
   * @example
   * // Get products related to a specific category
   * const relatedProducts = await productService.listRelatedProducts({
   *   categoryId: '123'
   * });
   */
  async listRelatedProducts({
    page = 1,
    categoryId = '',
    sort = '-createdAt'
  }) {
    return this.get(
      `/api/products?page=${page}&categories=${categoryId}&sort=${sort}`
    ) as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves a general list of products with search and pagination
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.search=''] - Search query for filtering products
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of products
   * @api {get} /api/products List products
   *
   * @example
   * // Search for products with a query
   * const products = await productService.list({
   *   search: 'red shoes',
   *   sort: 'price'
   * });
   */
  async list({ page = 1, search = '', sort = '-createdAt' }) {
    return this.get(
      `/api/products?page=${page}&search=${search}&sort=${sort}`
    ) as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves detailed information for a single product
   *
   * @param {string} slug - The slug of the product to fetch
   * @returns {Promise<PaginatedResponse<Product>>} The product details
   * @api {get} /api/products/:slug Get product details
   *
   * @example
   * // Get details for a specific product
   * const product = await productService.getOne('red-running-shoes');
   */
  async getOne(slug: string) {
    return this.get(`/api/products/${slug}`) as Promise<
      PaginatedResponse<Product>
    >
  }

  /**
   * Adds a review and rating for a product
   *
   * @param {object} reviewData - The review data to submit
   * @param {string} reviewData.productId - ID of the product being reviewed
   * @param {string} reviewData.variantId - ID of the specific product variant
   * @param {string} reviewData.review - Text content of the review
   * @param {number} reviewData.rating - Numerical rating (typically 1-5)
   * @param {string[]} reviewData.uploadedImages - Array of image URLs to attach to the review
   * @returns {Promise<any>} The created review
   * @api {post} /api/products/ratings-and-reviews Add product review
   *
   * @example
   * // Add a product review with rating and images
   * await productService.addReview({
   *   productId: '123',
   *   variantId: '456',
   *   review: 'Great product, very comfortable!',
   *   rating: 5,
   *   uploadedImages: ['http://example.com/image1.jpg']
   * });
   */
  async addReview({
    productId,
    variantId,
    review,
    rating,
    uploadedImages
  }: {
    productId: string
    variantId: string
    review: string
    rating: number
    uploadedImages: string[]
  }) {
    return this.post('/api/products/ratings-and-reviews', {
      productId,
      variantId,
      review,
      rating,
      uploadedImages
    })
  }

  /**
   * Fetches product-related reels/short videos
   *
   * @returns {Promise<any>} Collection of product reels
   * @api {get} /api/reels Get product reels
   *
   * @example
   * // Get product video reels
   * const reels = await productService.fetchReels();
   */
  async fetchReels() {
    try {
      const res = await this.get('api/reels')
      return res
    } catch (e: unknown) {
      const error = e as {
        status?: string | number
        data?: { message?: string }
        message?: string
      }
      throw new Error(
        error.data?.message || error.message || 'Failed to fetch reels'
      )
    }
  }
}

// Use singleton instance
export const productService = ProductService.getInstance()

// // Export the instance methods for backward compatibility
// export const listFeaturedProducts = () => productService.listFeaturedProducts({})
