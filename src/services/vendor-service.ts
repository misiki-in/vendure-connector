import type { PaginatedResponse, Product, Vendor } from './../types'

import { BaseService } from './base.service'

/**
 * VendorService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class VendorService extends BaseService {
  private static instance: VendorService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {VendorService} The singleton instance of VendorService
 */
  static getInstance(): VendorService {
    if (!VendorService.instance) {
      VendorService.instance = new VendorService()
    }
    return VendorService.instance
  }
  // Save a new vendor
  /**
 * Creates a new Vendor
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created vendor
 * @api {post} /api/vendor Create vendor
 * 
 * @example
 * // Example usage
 * const newVendor = await vendorService.save({ 
 *   // required fields
 * });
 */
  async save(data: Partial<Vendor>) {
    return this.post('/api/vendors', data) as Promise<Vendor>
  }

  // Update vendor details by ID
  async update(data: Partial<Vendor> & { id: string }) {
    return this.patch(`/api/vendors/${data.id}`, data) as Promise<Vendor>
  }

  // List vendors with optional pagination and query
  /**
 * Fetches Vendor from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/vendor Get vendor
 * 
 * @example
 * // Example usage
 * const result = await vendorService.list({ page: 1 });
 */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    return this.get(`/api/vendors?page=${page}&q=${q}&sort=${sort}`) as Promise<
      PaginatedResponse<Vendor>
    >
  }

  // Get vendor details by ID
  /**
 * Fetches a single Vendor by ID
 * 
 * @param {string} id - The ID of the vendor to fetch
 * @returns {Promise<any>} The requested vendor
 * @api {get} /api/vendor/:id Get vendor by ID
 * 
 * @example
 * // Example usage
 * const vendor = await vendorService.getVendor('123');
 */
  async getVendor(id: string) {
    return this.get(`/api/vendors/${id}`) as Promise<Vendor>
  }

  // Fetch current vendor's details
  /**
 * Fetches a single Vendor by ID
 * 
 * @param {string} id - The ID of the vendor to fetch
 * @returns {Promise<any>} The requested vendor
 * @api {get} /api/vendor/:id Get vendor by ID
 * 
 * @example
 * // Example usage
 * const vendor = await vendorService.fetchMyVendorDetails('123');
 */
  async fetchMyVendorDetails() {
    return this.get('/api/vendors/me') as Promise<Vendor>
  }

  // Fetch vendor dashboard summary data
  /**
 * Fetches a single Vendor by ID
 * 
 * @param {string} id - The ID of the vendor to fetch
 * @returns {Promise<any>} The requested vendor
 * @api {get} /api/vendor/:id Get vendor by ID
 * 
 * @example
 * // Example usage
 * const vendor = await vendorService.fetchDashboard('123');
 */
  async fetchDashboard() {
    return this.get('/api/dashboard/summary') as Promise<Vendor>
  }

  // Fetch all products of a specific vendor by vendor ID
  /**
 * Fetches a single Vendor by ID
 * 
 * @param {string} id - The ID of the vendor to fetch
 * @returns {Promise<any>} The requested vendor
 * @api {get} /api/vendor/:id Get vendor by ID
 * 
 * @example
 * // Example usage
 * const vendor = await vendorService.fetchProductsOfVendor('123');
 */
  async fetchProductsOfVendor(vendorId: string) {
    return this.get(`/api/products?vendor_id=${vendorId}`) as Promise<Product[]>
  }

  // Fetch all products of a specific vendor by vendor ID
  /**
 * Fetches a single Vendor by ID
 * 
 * @param {string} id - The ID of the vendor to fetch
 * @returns {Promise<any>} The requested vendor
 * @api {get} /api/vendor/:id Get vendor by ID
 * 
 * @example
 * // Example usage
 * const vendor = await vendorService.getAllVendorRatings('123');
 */
  async getAllVendorRatings(vendorId: string) {
    return this.get(
      `/api/vendors/all-ratings?vendor_id=${vendorId}`
    ) as Promise<Product[]>
  }
}

// Use singleton instance
export const vendorService = VendorService.getInstance()
