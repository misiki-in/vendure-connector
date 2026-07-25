import type { Category, PaginatedResponse } from './../types'
import { BaseService } from './base.service'

const GET_CATEGORIES_QUERY = `
  query GetCategories($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset { preview }
        parent { id }
      }
      totalItems
    }
  }
`;

const GET_CATEGORY_QUERY = `
  query GetCategory($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset { preview }
      parent { id }
    }
  }
`;

/**
 * CategoryService provides functionality for working with specific resources
 * via the Vendure API.
 */
export class CategoryService extends BaseService {
  private static instance: CategoryService

  /**
   * Get the singleton instance
   * 
   * @returns {CategoryService} The singleton instance of CategoryService
   */
  static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService()
    }
    return CategoryService.instance
  }

  private mapVendureCategory(item: any): Category {
    if (!item) return null as any;

    return {
      id: item.id,
      isActive: true,
      isInternal: false,
      isMegamenu: false, // Mock
      thumbnail: item.featuredAsset?.preview || null,
      path: null,
      level: 0,
      description: item.description || null,
      isFeatured: false,
      keywords: null,
      rank: 0,
      link: null,
      metaDescription: null,
      metaKeywords: null,
      metaTitle: null,
      name: item.name,
      parentCategoryId: item.parent?.id || null,
      store: null,
      slug: item.slug,
      userId: '',
      activeProducts: 0, // Mock
      inactiveProducts: 0, // Mock
      createdAt: new Date().toISOString(), // Mock
      updatedAt: new Date().toISOString() // Mock
    }
  }

  async fetchFooterCategories({ page = 1, q = '', sort = '-createdAt' }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    if (q) {
      options.filter = { name: { contains: q } }
    }
    
    if (sort) {
      options.sort = { id: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_CATEGORIES_QUERY, { options });
    const items = res?.collections?.items || [];
    const count = res?.collections?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureCategory(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<Category>
  }

  async fetchFeaturedCategories({ limit = 100 }) {
    const options: any = { skip: 0, take: limit };
    
    const res = await this.query<any>('/shop-api', GET_CATEGORIES_QUERY, { options });
    const items = res?.collections?.items || [];
    const count = res?.collections?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureCategory(i)),
      count,
      pageSize: limit,
      noOfPage: 1,
      page: 1
    } as PaginatedResponse<Category>
  }

  async fetchCategory(id: string) {
    // Treating 'id' as 'slug' since litekart passes a handle
    const res = await this.query<any>('/shop-api', GET_CATEGORY_QUERY, { slug: id });
    const item = res?.collection;
    
    if (!item) {
       // Return empty mock if not found to prevent crashes, as requested
       return this.mapVendureCategory({ id, name: 'Unknown Category', slug: id });
    }

    return this.mapVendureCategory(item)
  }

  async fetchAllCategories() {
    const options: any = { skip: 0, take: 100 };
    
    const res = await this.query<any>('/shop-api', GET_CATEGORIES_QUERY, { options });
    const items = res?.collections?.items || [];
    const count = res?.collections?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureCategory(i)),
      count,
      pageSize: 100,
      noOfPage: Math.ceil(count / 100) || 1,
      page: 1
    } as PaginatedResponse<Category>
  }

  async fetchAllProductsOfCategories(id: string) {
    // The original method returns PaginatedResponse<Category>. 
    // Returning an empty mock as requested.
    return {
      data: [],
      count: 0,
      pageSize: 20,
      noOfPage: 0,
      page: 1
    } as PaginatedResponse<Category>
  }

  async getMegamenu() {
    // Fetch all categories to act as the megamenu.
    const options: any = { skip: 0, take: 50 };
    
    const res = await this.query<any>('/shop-api', GET_CATEGORIES_QUERY, { options });
    const items = res?.collections?.items || [];
    const count = res?.collections?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureCategory(i)),
      count,
      pageSize: 50,
      noOfPage: 1,
      page: 1
    } as PaginatedResponse<Category>
  }
}

// Use singleton instance
export const categoryService = CategoryService.getInstance()
