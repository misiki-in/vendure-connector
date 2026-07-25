import { BaseService } from './base.service'

/**
 * Interface representing the store details returned by the API
 */
export interface StoreDetails {
  id: string
  name: string
  domain: string
  logo?: string
  favicon?: string
  description?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  contact?: {
    email?: string
    phone?: string
    website?: string
  }
  settings?: {
    currency?: string
    timezone?: string
    language?: string
    [key: string]: unknown
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Parameters for fetching store details
 */
export interface GetStoreParams {
  /** The ID of the store to fetch */
  storeId?: string
  /** The domain name of the store to fetch */
  domain?: string
}

/**
 * StoreService provides functionality for retrieving store information
 * in the Litekart platform.
 *
 * This service helps with:
 * - Retrieving store details by ID or domain
 * - Accessing store configuration and settings
 * - Facilitating multi-store operations
 */
export class StoreService extends BaseService {
  private static instance: StoreService

  /**
   * Get the singleton instance
   *
   * @returns {StoreService} The singleton instance of StoreService
   */
  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService()
    }
    return StoreService.instance
  }

  /**
   * Retrieves store details by ID or domain name
   *
   * @param {GetStoreParams} params - The parameters for fetching the store
   * @returns {Promise<StoreDetails>} The store details
   * @api {get} /api/stores/public-details Get store details
   *
   * @example
   * // Get store by ID
   * const store = await storeService.getStoreByIdOrDomain({
   *   storeId: '123'
   * });
   *
   * // Get store by domain
   * const store = await storeService.getStoreByIdOrDomain({
   *   domain: 'mystore.example.com'
   * });
   */
  async getStoreByIdOrDomain({
    storeId,
    domain
  }: GetStoreParams): Promise<StoreDetails> {
    if (!storeId && !domain) {
      throw new Error('Either storeId or domain must be provided')
    }

    let url = '/api/stores/public-details?'
    if (storeId) {
      url += `store_id=${encodeURIComponent(storeId)}`
    } else if (domain) {
      url += `domain=${encodeURIComponent(domain)}`
    }

    return this.get<StoreDetails>(url)
  }
}

// Use singleton instance
export const storeService = StoreService.getInstance()
