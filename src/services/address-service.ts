import type { Address } from '../types/address-types'
import type { PaginatedResponse } from '../types/pagination-types'
import { BaseService } from './base.service'

/**
 * Parameters for listing addresses with pagination and filtering
 */
interface ListAddressesParams {
  /** The page number to fetch (1-based) */
  page?: number
  /** Search query string */
  q?: string
  /** Sort order (e.g., '-createdAt' for newest first) */
  sort?: string
  /** Filter by user ID */
  user?: string
}

/**
 * Parameters for creating a new address
 */
type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'active'>

/**
 * Parameters for updating an existing address
 */
type UpdateAddressParams = Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>


/**
 * AddressService provides functionality for managing user addresses
 * in the Litekart platform.
 *
 * This service helps with:
 * - Retrieving user addresses with pagination and filtering
 * - Creating new addresses for the current user
 * - Updating existing address information
 * - Deleting addresses that are no longer needed
 */
export class AddressService extends BaseService {
  private static instance: AddressService

  /**
   * Get the singleton instance
   *
   * @returns {AddressService} The singleton instance of AddressService
   */
  static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }
    return AddressService.instance
  }

  /**
   * Fetches a paginated list of addresses with optional filtering
   *
   * @param {object} options - The options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.q=''] - Search query for filtering addresses
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @param {string} [options.user=''] - Filter addresses by user ID
   * @returns {Promise<PaginatedResponse<Address>>} Paginated list of addresses
   * @api {get} /api/address List addresses
   *
   * @example
   * // Get the second page of addresses sorted by creation date
   * const addresses = await addressService.list({ page: 2, sort: '-createdAt' });
   */


  /**
   * Fetches a paginated list of addresses with optional filtering
   * 
   * @param {ListAddressesParams} params - The parameters for filtering and pagination
   * @returns {Promise<PaginatedResponse<Address>>} Paginated list of addresses
   * @throws {Error} If the request fails
   * 
   * @example
   * // Get the second page of addresses sorted by creation date
   * const addresses = await addressService.list({ page: 2, sort: '-createdAt' });
   */
  async list(params: ListAddressesParams = {}): Promise<PaginatedResponse<Address>> {
    const { 
      page = 1, 
      q = '', 
      sort = '-createdAt', 
      user = '' 
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      q,
      sort,
      user
    }).toString()
    
    return this.get<PaginatedResponse<Address>>(`/api/address?${queryParams}`)
  }

  /**
   * Fetches a single address by ID
   *
   * @param {string} id - The ID of the address to fetch
   * @returns {Promise<Address>} The address data
   * @api {get} /api/address/:id Get address by ID
   *
   * @example
   * // Fetch a specific address
   * const address = await addressService.fetchAddress('123');
   */
  async fetchAddress(id: string): Promise<Address> {
    return this.get(`/api/address/${id}`) as Promise<Address>
  }

  /**
   * Creates a new address for the current user
   *
   * @param {Omit<Address, 'id'>} address - The address data to save
   * @returns {Promise<Address>} The created address with ID
   * @api {post} /api/address/me Create new address
   *
   * @example
   * // Create a new address
   * const newAddress = await addressService.saveAddress({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   address: '123 Main St',
   *   city: 'Anytown',
   *   zip: '12345',
   *   country: 'US'
   * });
   */
  /**
   * Creates a new address for the current user
   * 
   * @param {Omit<Address, 'id' | 'createdAt' | 'updatedAt'>} address - The address data to save
   * @returns {Promise<Address>} The created address with ID and timestamps
   * @throws {Error} If the request fails or address creation fails
   * 
   * @example
   * // Create a new address
   * const newAddress = await addressService.saveAddress({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   address_1: '123 Main St',
   *   city: 'Anytown',
   *   state: 'CA',
   *   zip: '12345',
   *   country: 'US',
   *   isPrimary: false,
   *   isResidential: true
   * });
   */
  async saveAddress(address: CreateAddressParams): Promise<Address> {
    return this.post<Address>('/api/address/me', address)
  }

  /**
   * Updates an existing address
   *
   * @param {string} id - The ID of the address to update
   * @param {Partial<Address>} address - The address fields to update
   * @returns {Promise<Address>} The updated address
   * @api {put} /api/address/me/:id Update address
   *
   * @example
   * // Update an address
   * const updatedAddress = await addressService.editAddress('123', {
   *   city: 'New City',
   *   zip: '54321'
   * });
   */
  /**
   * Updates an existing address
   * 
   * @param {string} id - The ID of the address to update
   * @param {Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>} address - The address fields to update
   * @returns {Promise<Address>} The updated address
   * @throws {Error} If the request fails or address update fails
   * 
   * @example
   * // Update an address
   * const updatedAddress = await addressService.editAddress('123', {
   *   city: 'New City',
   *   zip: '54321'
   * });
   */
  async editAddress(id: string, address: UpdateAddressParams): Promise<Address> {
    return this.put<Address>(`/api/address/me/${id}`, address)
  }

  /**
   * Deletes an address
   *
   * @param {string} id - The ID of the address to delete
   * @returns {Promise<any>} The deletion response
   * @api {delete} /api/address/:id Delete address
   *
   * @example
   * // Delete an address
   * await addressService.deleteAddress('123');
   */
  /**
   * Deletes an address
   * 
   * @param {string} id - The ID of the address to delete
   * @returns {Promise<void>} Resolves when the address is successfully deleted
   * @throws {Error} If the request fails or address deletion fails
   * 
   * @example
   * // Delete an address
   * await addressService.deleteAddress('123');
   */
  async deleteAddress(id: string): Promise<void> {
    await this.delete<void>(`/api/address/${id}`)
  }
}

// Use singleton instance
export const addressService = AddressService.getInstance()
