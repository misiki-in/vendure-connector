import { ProductSearchResult } from '../types/product-search-types'
import { BaseService } from './base.service'
import { MeilisearchService } from './meilisearch-service'

/**
 * SearchService provides a high-level API for product search operations
 * by leveraging the underlying Meilisearch implementation.
 *
 * This service helps with:
 * - Converting URL search parameters into Meilisearch queries
 * - Processing and formatting search results into a consistent format
 * - Handling search-related errors with fallback values
 */
export class SearchService extends BaseService {
  private static instance: SearchService
  private meilisearchService: MeilisearchService

  constructor(fetchFn?: typeof fetch) {
    super(fetchFn)
    // Use provided fetch or global fetch as fallback
    this.meilisearchService = new MeilisearchService(fetchFn)
  }

  /**
   * Get the singleton instance
   *
   * @returns {SearchService} The singleton instance of SearchService
   */
  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  /**
   * Performs a product search using URL search parameters
   *
   * This method parses URL search parameters and organizes them into different types
   * (standard, attribute-based, option-based, etc.) before executing the search.
   *
   * @param {URL} url - The URL containing search parameters in its query string
   * @param {string} [slug] - Optional category slug that overrides the one in URL params
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   * @api {get} /api/ms/products Search products using URL parameters
   *
   * @example
   * // Search using a URL with multiple parameters
   * const searchUrl = new URL('https://example.com/search?search=shoes&categories=footwear&priceFrom=50&priceTo=200');
   * const results = await searchService.searchWithUrl(searchUrl);
   */
  async searchWithUrl(url: URL, slug?: string): Promise<ProductSearchResult> {
    try {
      const searchParams = new URLSearchParams(url.search)

      // Standard search parameters with default values
      const standardParams = {
        query: searchParams.get('search') || '',
        categories: slug || searchParams.get('categories') || '',
        tags: searchParams.get('tags') || '',
        originCountry: searchParams.get('originCountry') || '',
        keywords: searchParams.get('keywords') || '',
        page: Number(searchParams.get('page') || 1),
        sort: searchParams.get('sort') || ''
      }

      // Handle price range specially
      const price =
        searchParams.get('priceFrom') || searchParams.get('priceTo')
          ? `${searchParams.get('priceFrom') || ''},${
              searchParams.get('priceTo') || ''
            }`
          : ''

      // Reserved parameter names that shouldn't be included in the dynamic params
      const reservedParams = [
        'search',
        'categories',
        'priceFrom',
        'priceTo',
        'tags',
        'originCountry',
        'keywords',
        'page',
        'sort'
      ]

      // Dynamic parameters sorted by type
      const attributeParams: Record<string, string> = {}
      const optionParams: Record<string, string> = {}
      const otherParams: Record<string, string> = {}

      // Process all non-reserved parameters
      for (const key of [...searchParams.keys()]) {
        if (!reservedParams.includes(key)) {
          const value = searchParams.get(key) || ''

          if (key.startsWith('attributes.')) {
            attributeParams[key] = value
          } else if (key.startsWith('option.')) {
            optionParams[key] = value
          } else {
            otherParams[key] = value
          }
        }
      }

      const res = await this.meilisearchService.search({
        ...standardParams,
        price,
        otherParams,
        attributeParams,
        optionParams
      })

      return {
        data: res?.hits || [],
        count: res?.totalHits || res?.estimatedTotalHits || 0,
        totalPages: res?.totalPages || 0,
        categoryHierarchy: res?.categories || [],
        facets: {
          priceStat: {
            min: res?.allfacetStats?.price?.min,
            max: res?.allfacetStats?.price?.max
          },
          categories: Object.entries(
            res?.facetDistribution?.['categories.category.slug'] || {}
          ).map(([key, value]) => ({
            name: key,
            count: value
          })),
          tags: Object.entries(res?.facetDistribution?.['tags.name'] || {}).map(
            ([key, value]) => ({
              name: key,
              count: value
            })
          ),
          allFilters: res?.facetDistribution
        }
      }
    } catch (error) {
      console.error(error)
      // Return a valid empty result object that matches the expected type
      return this.emptyResult()
    }
  }

  /**
   * Search through Meilisearch with a simple query string
   *
   * This method is useful for basic search scenarios like autocomplete, search bars,
   * and quick lookups where only a text query is needed.
   *
   * @param {string} query - The search query string
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   * @api {get} /api/ms/products?search={query} Search products with query string
   *
   * @example
   * // Simple search for "red shoes"
   * const results = await searchService.searchWithQuery("red shoes");
   */
  async searchWithQuery(query: string): Promise<ProductSearchResult> {
    try {
      const res = await this.meilisearchService.search({
        query: query || ''
      })

      return {
        data: res?.hits || [],
        count: res?.totalHits || res?.estimatedTotalHits || 0,
        totalPages: res?.totalPages || 0,
        categoryHierarchy: res?.categories || [],
        facets: {
          priceStat: {
            min: res?.allfacetStats?.price?.min,
            max: res?.allfacetStats?.price?.max
          },
          categories: Object.entries(
            res?.facetDistribution?.['categories.category.slug'] || {}
          ).map(([key, value]) => ({
            name: key,
            count: value
          })),
          tags: Object.entries(res?.facetDistribution?.['tags.name'] || {}).map(
            ([key, value]) => ({
              name: key,
              count: value
            })
          ),
          allFilters: res?.facetDistribution
        }
      }
    } catch (error) {
      console.error(error)
      // Return a valid empty result object
      return this.emptyResult()
    }
  }

  /**
   * Create an empty product search result
   *
   * This method is used internally for error handling and as a fallback
   * when search operations fail.
   *
   * @returns {ProductSearchResult} Empty result object with default values
   */
  emptyResult(): ProductSearchResult {
    return {
      data: [],
      count: 0,
      totalPages: 0,
      categoryHierarchy: [],
      facets: {
        priceStat: { min: undefined, max: undefined },
        categories: [],
        tags: [],
        allFilters: {}
      }
    }
  }
}

// Use singleton instance
export const searchService = SearchService.getInstance()
