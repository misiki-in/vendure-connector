import type { AutoComplete, PaginatedResponse } from '../types'
import { BaseService } from './base.service'

/**
 * AutocompleteService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class AutocompleteService extends BaseService {
	private static instance: AutocompleteService

	/**
	 * Get the singleton instance
	 */
	/**
 * Get the singleton instance
 * 
 * @returns {AutocompleteService} The singleton instance of AutocompleteService
 */
	static getInstance(): AutocompleteService {
		if (!AutocompleteService.instance) {
			AutocompleteService.instance = new AutocompleteService()
		}
		return AutocompleteService.instance
	}

	/**
 * Fetches Autocomplete from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/autocomplete Get autocomplete
 * 
 * @example
 * // Example usage
 * const result = await autocompleteService.list({ page: 1 });
 */

	async list({ page = 1, q = '', sort = '-createdAt' }) {
		return this.get<PaginatedResponse<AutoComplete>>(
			`/api/autocomplete?page=${page}&q=${q}&sort=${sort}`
		)
	}
}

// // Use singleton instance
export const autocompleteService = AutocompleteService.getInstance()
