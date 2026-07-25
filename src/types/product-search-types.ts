import type { Product } from './product-types'

/**
 * Interface for page metadata information
 * Used for SEO and display purposes in search result pages
 *
 * @property {string} [metaDescription] - SEO meta description for the page
 * @property {string} [metaKeywords] - SEO meta keywords for the page
 * @property {string} [logo] - URL to the logo image
 */
export interface PageMetadata {
  metaDescription?: string
  metaKeywords?: string
  logo?: string
}

/**
 * Search parameters for Meilisearch queries
 * These parameters are used to construct search requests to Meilisearch
 *
 * @property {string} query - Main search query text
 * @property {string} [categories] - Category slug(s) to filter by
 * @property {string} [price] - Price range in format "min,max"
 * @property {string} [keywords] - Additional keywords to include in search
 * @property {string} [tags] - Tag names to filter by
 * @property {string} [originCountry] - Country of origin filter
 * @property {number} [page] - Page number for pagination
 * @property {string} [sort] - Sort order (e.g., "price:asc")
 * @property {Record<string, string>} [otherParams] - Additional misc parameters
 * @property {Record<string, string>} [attributeParams] - Product attribute filters (attributes.*)
 * @property {Record<string, string>} [optionParams] - Product option filters (option.*)
 */
export interface MsSearchParams {
  query: string
  categories?: string
  price?: string
  keywords?: string
  tags?: string
  originCountry?: string
  page?: number
  sort?: string
  // Regular additional parameters
  otherParams?: Record<string, string>
  // Dynamic attribute parameters (attributes.*)
  attributeParams?: Record<string, string>
  // Dynamic option parameters (option.*)
  optionParams?: Record<string, string>
}

/**
 * Response type from Meilisearch API
 * This represents the raw response structure returned by Meilisearch
 *
 * @property {Product[]} hits - Array of product objects matching the search
 * @property {number} [totalHits] - Exact total number of matching products
 * @property {number} [estimatedTotalHits] - Estimated total for very large result sets
 * @property {number} [totalPages] - Total number of pages available
 * @property {number} [page] - Current page number
 * @property {Record<string, Record<string, number>>} [facetDistribution] - Distribution of facet values
 * @property {Record<string, Record<string, number>>} [facetStats] - Statistics for numeric facets
 * @property {number} [limit] - Max number of hits per page
 * @property {number} [offset] - Offset in the result set
 * @property {number} processingTimeMs - Time taken to process the search in milliseconds
 * @property {string} query - The query that was executed
 * @property {Record<string, Record<string, number>>} [allfacetDistribution] - Complete facet distribution
 * @property {Record<string, Record<string, number>>} [allfacetStats] - Complete statistics for numeric facets
 * @property {Record<string, unknown>[]} categories - Array of category objects
 */
export type MeilisearchResponse = {
  hits: Product[]
  totalHits?: number
  estimatedTotalHits?: number
  totalPages?: number
  page?: number
  facetDistribution?: Record<string, Record<string, number>>
  facetStats?: Record<string, Record<string, number>>
  limit?: number
  offset?: number
  processingTimeMs: number
  query: string
  allfacetDistribution?: Record<string, Record<string, number>>
  allfacetStats?: Record<string, Record<string, number>>
  categories: Record<string, unknown>[]
}

/**
 * Structured product search results for UI consumption
 * This is a cleaned and normalized format of search results that's easier
 * to work with in frontend applications.
 *
 * @property {Product[]} data - Array of product objects matching the search
 * @property {number} count - Total number of matching products
 * @property {number} totalPages - Total number of pages available
 * @property {Record<string, any>[]} categoryHierarchy - Array of category objects showing hierarchy
 * @property {object} facets - Filter options derived from the result set
 * @property {object} facets.priceStat - Price range statistics
 * @property {number} [facets.priceStat.min] - Minimum price in result set
 * @property {number} [facets.priceStat.max] - Maximum price in result set
 * @property {Array<{name: string, count: number}>} facets.categories - Available category filters
 * @property {Array<{name: string, count: number}>} facets.tags - Available tag filters
 * @property {Record<string, Record<string, number>>} [facets.allFilters] - All available filters
 */
export interface ProductSearchResult {
  data: Product[]
  count: number
  totalPages: number
  categoryHierarchy: Record<string, any>[]
  facets: {
    priceStat: { min?: number; max?: number }
    categories: { name: string; count: number }[]
    tags: { name: string; count: number }[]
    allFilters?: Record<string, Record<string, number>>
  }
}

/**
 * Complete page data structure for product pages
 * Combines search results with page metadata
 *
 * @property {ProductSearchResult} products - Search results with product data
 * @property {PageMetadata} [page] - Optional page metadata for SEO and display
 */
export interface PageData {
  products: ProductSearchResult
  page?: PageMetadata
}
