import type { Enquiry } from './../types'

import { BaseService } from './base.service'

/**
 * EnquiryService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class EnquiryService extends BaseService {
  private static instance: EnquiryService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {EnquiryService} The singleton instance of EnquiryService
 */
  static getInstance(): EnquiryService {
    if (!EnquiryService.instance) {
      EnquiryService.instance = new EnquiryService()
    }
    return EnquiryService.instance
  }
  /**
 * Creates a new Enquiry
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created enquiry
 * @api {post} /api/enquiry Create enquiry
 * 
 * @example
 * // Example usage
 * const newEnquiry = await enquiryService.create({ 
 *   // required fields
 * });
 */
  async create({
    name,
    email,
    phone,
    message,
    productId
  }: {
    name: string
    email: string
    phone: string
    message: string
    productId: string
  }) {
    return this.post<Enquiry>('/api/enquiry', {
      name,
      email,
      phone,
      message,
      productId
    })
  }
}

// // Use singleton instance
export const enquiryService = EnquiryService.getInstance()
