import type { Collection, PaginatedResponse } from './../types'
import { BaseService } from './base.service'

const GET_COLLECTIONS_QUERY = `
  query GetCollections($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset { preview }
      }
      totalItems
    }
  }
`;

const GET_COLLECTION_QUERY = `
  query GetCollection($id: ID!) {
    collection(id: $id) {
      id
      name
      slug
      description
      featuredAsset { preview }
    }
  }
`;

/**
 * CollectionService provides functionality for working with specific resources
 * in the Vendure API.
 */
export class CollectionService extends BaseService {
  private static instance: CollectionService

  /**
   * Get the singleton instance
   * 
   * @returns {CollectionService} The singleton instance of CollectionService
   */
  static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService()
    }
    return CollectionService.instance
  }

  private mapVendureCollection(item: any): Collection {
    if (!item) return null as any;

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || null,
      isActive: true,
      isFeatured: false,
      userId: '',
      productCount: 0, // Mocked as discussed
      thumbnail: item.featuredAsset?.preview || null,
      metaTitle: null,
      metaDescription: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async list({ page = 1, q = '', sort = '-createdAt' }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    if (q) {
      options.filter = { name: { contains: q } }
    }
    
    // Sort logic, defaulting to ID since Vendure Collections don't natively expose createdAt in sorting
    if (sort) {
      options.sort = { id: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_COLLECTIONS_QUERY, { options });
    const items = res?.collections?.items || [];
    const count = res?.collections?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureCollection(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<Collection>
  }

  async getOne(id: string) {
    const res = await this.query<any>('/shop-api', GET_COLLECTION_QUERY, { id });
    const item = res?.collection;
    
    if (!item) {
      throw new Error(`Collection with ID ${id} not found`);
    }

    return this.mapVendureCollection(item)
  }

  async getAllRatings() {
    // Mocking an empty collection as discussed
    return {
      id: 'mock-ratings-id',
      name: 'All Ratings',
      slug: 'all-ratings',
      description: null,
      isActive: true,
      isFeatured: false,
      userId: '',
      productCount: 0,
      thumbnail: null,
      metaTitle: null,
      metaDescription: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Collection
  }
}

// Use singleton instance
export const collectionService = CollectionService.getInstance()
