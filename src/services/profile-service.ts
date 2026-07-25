import type { User } from './../types'

import { BaseService } from './base.service'

/**
 * ProfileService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class ProfileService extends BaseService {
  private static instance: ProfileService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {ProfileService} The singleton instance of ProfileService
 */
  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }
  /**
 * Fetches a single Profile by ID
 * 
 * @param {string} id - The ID of the profile to fetch
 * @returns {Promise<any>} The requested profile
 * @api {get} /api/profile/:id Get profile by ID
 * 
 * @example
 * // Example usage
 * const profile = await profileService.getOne('123');
 */
  async getOne() {
    return this.get<User>('/api/users/me')
  }

  /**
 * Creates a new Profile
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created profile
 * @api {post} /api/profile Create profile
 * 
 * @example
 * // Example usage
 * const newProfile = await profileService.save({ 
 *   // required fields
 * });
 */

  async save(blog: Omit<User, 'id'>) {
    return this.patch<User>('/api/users', blog)
  }
}

// Use singleton instance
export const profileService = ProfileService.getInstance()
