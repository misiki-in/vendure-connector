import type { Demo } from './../types'

import { BaseService } from './base.service'

/**
 * DemoRequestService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class DemoRequestService extends BaseService {
  private static instance: DemoRequestService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {DemoRequestService} The singleton instance of DemoRequestService
 */
  static getInstance(): DemoRequestService {
    if (!DemoRequestService.instance) {
      DemoRequestService.instance = new DemoRequestService()
    }
    return DemoRequestService.instance
  }
  /**
 * Creates a new DemoRequest
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created demorequest
 * @api {post} /api/demorequest Create demorequest
 * 
 * @example
 * // Example usage
 * const newDemoRequest = await demorequestService.saveScheduleDemo({ 
 *   // required fields
 * });
 */
  async saveScheduleDemo() {
    return this.get<Demo>('/api/schedule-demo')
  }
}

// // Use singleton instance
export const demoRequestService = DemoRequestService.getInstance()
