import type { Init } from '../types'
import { MsSearchParams } from '../types/product-search-types'
import { MeilisearchResponse } from '../types/product-search-types'

import { BaseService } from './base.service'

/**
 * MeilisearchService provides direct access to Meilisearch functionality
 * for product searches and autocomplete features.
 *
 * This service helps with:
 * - Performing product searches with complex filtering options
 * - Converting search parameters into Meilisearch-compatible queries
 * - Providing autocomplete functionality for search fields
 */
export class MeilisearchService extends BaseService {
  private static instance: MeilisearchService

  /**
   * Get the singleton instance
   *
   * @returns {MeilisearchService} The singleton instance of MeilisearchService
   */
  static getInstance(): MeilisearchService {
    if (!MeilisearchService.instance) {
      MeilisearchService.instance = new MeilisearchService()
    }
    return MeilisearchService.instance
  }

  /**
   * Performs a product search via Meilisearch
   *
   * This method converts the provided search parameters into URL query parameters
   * and sends the request to the Meilisearch API endpoint.
   *
   * @param {MsSearchParams} params - The search parameters to use
   * @returns {Promise<MeilisearchResponse>} Promise resolving to search results
   * @api {get} /api/ms/products Product search endpoint
   *
   * @example
   * // Search for products in a specific category
   * const results = await meilisearchService.search({
   *   query: "shoes",
   *   categories: "footwear"
   * });
   */
  async search(params: MsSearchParams): Promise<MeilisearchResponse> {
    const {
      query,
      categories,
      price,
      keywords,
      tags,
      originCountry,
      page,
      otherParams,
      attributeParams,
      optionParams,
      sort
    } = params
    const searchParams = new URLSearchParams()

    // Add standard parameters with null/undefined checking
    const addParam = (
      key: string,
      value: string | number | undefined | null
    ) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(
          key,
          typeof value === 'string' ? value : String(value)
        )
      }
    }

    // Add all standard parameters
    addParam('search', query)
    addParam('categories', categories)
    addParam('price', price)
    addParam('keywords', keywords)
    addParam('tags', tags)
    addParam(
      'originCountry',
      originCountry ? decodeURIComponent(originCountry) : undefined
    )
    addParam('page', page)
    addParam('sort', sort)

    // Helper to process parameter groups
    const addParamGroup = (params: Record<string, string> | undefined) => {
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          addParam(key, value ? decodeURIComponent(value) : undefined)
        }
      }
    }

    // Process all the dynamic parameters
    addParamGroup(otherParams)
    addParamGroup(attributeParams)
    addParamGroup(optionParams)

    return this.get<MeilisearchResponse>(
      `/api/ms/products?${searchParams?.toString()}`
    )
  }

  /**
   * Performs an autocomplete search for product suggestions
   *
   * This method provides type-ahead functionality by searching for products
   * that match a partial query string.
   *
   * @param {object} params - The search parameters
   * @param {string} params.query - The partial search query to get suggestions for
   * @returns {Promise<MeilisearchResponse>} Promise resolving to search results
   * @api {get} /api/ms-autocomplete/products Autocomplete search endpoint
   *
   * @example
   * // Get autocomplete suggestions for "red sh"
   * const suggestions = await meilisearchService.searchAutoComplete({
   *   query: "red sh"
   * });
   */
  async searchAutoComplete(params: {
    query: string
  }): Promise<MeilisearchResponse> {
    const { query } = params
    const searchParams = new URLSearchParams()
    searchParams.append('search', query)
    return this.get<MeilisearchResponse>(
      `/api/ms-autocomplete/products?${searchParams?.toString()}`
    )
  }
}

// Use singleton instance
export const meilisearchService = MeilisearchService.getInstance()
