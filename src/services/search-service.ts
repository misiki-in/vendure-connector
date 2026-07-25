import { ProductSearchResult } from '../types/product-search-types'
import { BaseService } from './base.service'
import type { Product, ProductStatus } from '../types/product-types'

const SEARCH_QUERY = `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      items {
        productId
        productName
        slug
        description
        price {
          ... on PriceRange { min max }
          ... on SinglePrice { value }
        }
        priceWithTax {
          ... on PriceRange { min max }
          ... on SinglePrice { value }
        }
        productAsset {
          id
          preview
        }
      }
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            name
          }
        }
      }
    }
  }
`;

/**
 * SearchService provides a high-level API for product search operations
 * by leveraging the underlying Vendure GraphQL API.
 *
 * This service helps with:
 * - Converting URL search parameters into Vendure queries
 * - Processing and formatting search results into a consistent format
 * - Handling search-related errors with fallback values
 */
export class SearchService extends BaseService {
  private static instance: SearchService

  constructor(fetchFn?: typeof fetch) {
    super(fetchFn)
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

  private mapVendureSearchToProductSearchResult(vendureResult: any): ProductSearchResult {
    const items = vendureResult?.search?.items || [];
    const totalItems = vendureResult?.search?.totalItems || 0;
    const facetValues = vendureResult?.search?.facetValues || [];
    const take = 20;

    const data: Product[] = items.map((item: any) => {
      // Extract price
      let price = 0;
      if (item.priceWithTax) {
        price = item.priceWithTax.value ?? item.priceWithTax.min ?? 0;
      } else if (item.price) {
        price = item.price.value ?? item.price.min ?? 0;
      }

      return {
        id: item.productId,
        title: item.productName,
        slug: item.slug,
        description: item.description || '',
        price: price,
        mrp: price, // Vendure doesn't have a direct mrp, map price
        featuredImage: item.productAsset?.preview || null,
        active: true,
        // Default necessary values for Product type
        status: 'published' as ProductStatus,
        type: 'physical',
        vendorId: '',
        categoryId: null,
        currency: null,
        instructions: null,
        hsnCode: null,
        images: null,
        thumbnail: item.productAsset?.preview || null,
        keywords: null,
        link: null,
        metaTitle: null,
        metaDescription: null,
        subtitle: null,
        popularity: 0,
        rank: 0,
        expiryDate: null,
        weight: null,
        mfgDate: null,
        costPerItem: 0,
        sku: null,
        stock: 0,
        allowBackorder: false,
        manageInventory: false,
        shippingWeight: null,
        shippingHeight: null,
        shippingLen: null,
        shippingWidth: null,
        height: null,
        width: null,
        len: null,
        barcode: null,
        shippingCost: null,
        returnAllowed: false,
        replaceAllowed: false,
        originCountry: null,
        weightUnit: 'kg',
        dimensionUnit: 'cm',
        metadata: null,
        collectionId: null
      };
    });

    // Extract facets
    const categories = facetValues
      .filter((f: any) => f.facetValue.facet.name.toLowerCase() === 'category')
      .map((f: any) => ({ name: f.facetValue.name, count: f.count }));
      
    const tags = facetValues
      .filter((f: any) => f.facetValue.facet.name.toLowerCase() === 'tag')
      .map((f: any) => ({ name: f.facetValue.name, count: f.count }));

    return {
      data,
      count: totalItems,
      totalPages: Math.ceil(totalItems / take) || 1,
      categoryHierarchy: [],
      facets: {
        priceStat: { min: undefined, max: undefined },
        categories,
        tags,
        allFilters: {}
      }
    };
  }

  /**
   * Performs a product search using URL search parameters
   *
   * @param {URL} url - The URL containing search parameters in its query string
   * @param {string} [slug] - Optional category slug that overrides the one in URL params
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   */
  async searchWithUrl(url: URL, slug?: string): Promise<ProductSearchResult> {
    try {
      const searchParams = new URLSearchParams(url.search)
      const term = searchParams.get('search') || ''
      const page = Number(searchParams.get('page') || 1)
      const take = 20
      const skip = (page - 1) * take

      const collectionSlug = slug || searchParams.get('categories') || undefined

      const input: any = {
        term,
        skip,
        take,
        groupByProduct: true
      }

      if (collectionSlug) {
        input.collectionSlug = collectionSlug
      }

      const res = await this.query<any>('/shop-api', SEARCH_QUERY, { input })
      return this.mapVendureSearchToProductSearchResult(res)
    } catch (error) {
      console.error(error)
      // Return a valid empty result object that matches the expected type
      return this.emptyResult()
    }
  }

  /**
   * Search through Vendure with a simple query string
   *
   * @param {string} query - The search query string
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   */
  async searchWithQuery(query: string): Promise<ProductSearchResult> {
    try {
      const input = { term: query || '', skip: 0, take: 20, groupByProduct: true }
      const res = await this.query<any>('/shop-api', SEARCH_QUERY, { input })
      return this.mapVendureSearchToProductSearchResult(res)
    } catch (error) {
      console.error(error)
      // Return a valid empty result object
      return this.emptyResult()
    }
  }

  /**
   * Create an empty product search result
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
