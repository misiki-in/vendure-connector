import type { Collection, PaginatedResponse } from './../types'
import { BaseService } from './base.service'
import { fromMinorUnits } from '../utils/money'

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

// Vendure resolves a collection by id or by slug; the storefront links collections by slug
// (`/collections/<slug>`), so both arguments are declared and exactly one is sent.
const GET_COLLECTION_QUERY = `
  query GetCollection($id: ID, $slug: String) {
    collection(id: $id, slug: $slug) {
      id
      name
      slug
      description
      featuredAsset { preview }
      productVariants(options: { take: 100 }) {
        totalItems
        items {
          id
          priceWithTax
          currencyCode
          product {
            id
            name
            slug
            featuredAsset { preview }
          }
        }
      }
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
      thumbnail: item.featuredAsset?.preview || null,
      metaTitle: null,
      metaDescription: null,
      // The storefront renders a collection's products as `collectionvalues[].products`, where each
      // value points at one product. Vendure holds the membership on
      // variants, so they are folded back to one entry per product (a product with three variants in
      // the collection must not appear three times).
      collectionvalues: this.mapCollectionProducts(item?.productVariants?.items),
      productCount: item?.productVariants?.totalItems ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as Collection
  }

  private mapCollectionProducts(variants: any[] | undefined) {
    const byProduct = new Map<string, any>();

    for (const variant of variants || []) {
      const product = variant?.product;
      if (!product?.id || byProduct.has(product.id)) continue;

      byProduct.set(product.id, {
        products: {
          id: product.id,
          name: product.name,
          title: product.name,
          slug: product.slug,
          thumbnail: product.featuredAsset?.preview || null,
          price: fromMinorUnits(variant?.priceWithTax, variant?.currencyCode),
          mrp: fromMinorUnits(variant?.priceWithTax, variant?.currencyCode)
        }
      });
    }

    return [...byProduct.values()];
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

  async getOne(idOrSlug: string) {
    // Vendure ids are numeric by default, or UUIDs when configured that way; anything else is a slug.
    const looksLikeId =
      /^[0-9]+$/.test(idOrSlug) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const lookup = async (variables: Record<string, string>) => {
      const res = await this.query<any>('/shop-api', GET_COLLECTION_QUERY, variables);
      return res?.collection;
    };

    // Try the shape the value looks like, then the other — a store may well use all-digit slugs.
    const item =
      (await lookup(looksLikeId ? { id: idOrSlug } : { slug: idOrSlug })) ??
      (await lookup(looksLikeId ? { slug: idOrSlug } : { id: idOrSlug }));

    if (!item) {
      throw new Error(`Collection ${idOrSlug} not found`);
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
