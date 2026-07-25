import type { PaginatedResponse, Product, ProductStatus } from '../types'
import { BaseService } from './base.service'

const GET_PRODUCTS_QUERY = `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset { preview }
        assets { preview }
        variants {
          id
          sku
          price
          priceWithTax
          currencyCode
          stockLevel
          name
        }
        optionGroups {
          id
          code
          name
          options {
            id
            code
            name
          }
        }
      }
      totalItems
    }
  }
`;

const GET_PRODUCT_QUERY = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset { preview }
      assets { preview }
      variants {
        id
        sku
        price
        priceWithTax
        currencyCode
        stockLevel
        name
        options {
          id
          code
          name
          groupId
        }
      }
      optionGroups {
        id
        code
        name
        options {
          id
          code
          name
        }
      }
    }
  }
`;

/**
 * ProductService provides functionality for accessing and managing products
 * via the Vendure GraphQL API.
 */
export class ProductService extends BaseService {
  private static instance: ProductService

  /**
   * Get the singleton instance
   */
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  private mapVendureProduct(item: any): Product {
    if (!item) return null as any;

    let minPrice = 0;
    if (item.variants && item.variants.length > 0) {
       const firstVar = item.variants[0];
       minPrice = firstVar.priceWithTax ?? firstVar.price ?? 0;
    }

    return {
        id: item.id,
        title: item.name,
        slug: item.slug,
        description: item.description || '',
        price: minPrice,
        mrp: minPrice,
        featuredImage: item.featuredAsset?.preview || null,
        active: true,
        status: 'published' as ProductStatus,
        type: 'physical',
        vendorId: '',
        categoryId: null,
        currency: null,
        instructions: null,
        hsnCode: null,
        images: item.assets?.map((a: any) => a.preview).join(',') || '',
        thumbnail: item.featuredAsset?.preview || null,
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
        sku: item.variants?.[0]?.sku || null,
        stock: item.variants?.[0]?.stockLevel === 'IN_STOCK' ? 100 : 0,
        allowBackorder: false,
        manageInventory: true,
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
        collectionId: null,
        options: item.optionGroups?.map((og: any) => ({
            id: og.id,
            title: og.name,
            type: 'radio',
            values: og.options.map((o: any) => ({ id: o.id, value: o.name }))
        })) || [],
        variants: item.variants?.map((v: any) => ({
            id: v.id,
            title: v.name,
            productId: item.id,
            sku: v.sku,
            barcode: null,
            batchNo: null,
            stock: v.stockLevel === 'IN_STOCK' ? 100 : (v.stockLevel === 'OUT_OF_STOCK' ? 0 : 10),
            allowBackorder: false,
            manageInventory: true,
            hsCode: null,
            originCountry: null,
            midCode: null,
            material: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            price: v.priceWithTax ?? v.price ?? 0,
            costPerItem: 0,
            mfgDate: null,
            expiryDate: null,
            returnAllowed: false,
            replaceAllowed: false,
            mrp: v.priceWithTax ?? v.price ?? 0,
            img: null,
            description: null,
            storeId: null,
            len: null,
            rank: 0,
            shippingWeight: null,
            shippingHeight: null,
            shippingLen: null,
            shippingWidth: null,
            shippingCost: null,
            metadata: null,
            variantRank: 0,
            options: v.options?.map((o: any) => ({
                id: o.id,
                optionId: o.groupId || '', 
                value: o.name,
                variantId: v.id
            })) || []
        })) || []
    }
  }

  async listFeaturedProducts({ page = 1, sort = '-createdAt' }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    // Sort logic
    if (sort) {
      options.sort = { createdAt: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_PRODUCTS_QUERY, { options });
    const items = res?.products?.items || [];
    const count = res?.products?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureProduct(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<[Product]>
  }

  async listTrendingProducts({ page = 1, search = '', sort = '-createdAt' }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    if (search) {
      options.filter = { name: { contains: search } }
    }
    
    if (sort) {
      options.sort = { createdAt: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_PRODUCTS_QUERY, { options });
    const items = res?.products?.items || [];
    const count = res?.products?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureProduct(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<[Product]>
  }

  async listRelatedProducts({
    page = 1,
    categoryId = '',
    sort = '-createdAt'
  }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    if (sort) {
      options.sort = { createdAt: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_PRODUCTS_QUERY, { options });
    const items = res?.products?.items || [];
    const count = res?.products?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureProduct(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<[Product]>
  }

  async list({ page = 1, search = '', sort = '-createdAt' }) {
    const take = 20;
    const skip = (page - 1) * take;
    const options: any = { skip, take };
    
    if (search) {
      options.filter = { name: { contains: search } }
    }
    
    if (sort) {
      options.sort = { createdAt: sort.startsWith('-') ? 'DESC' : 'ASC' }
    }

    const res = await this.query<any>('/shop-api', GET_PRODUCTS_QUERY, { options });
    const items = res?.products?.items || [];
    const count = res?.products?.totalItems || 0;
    
    return {
      data: items.map((i: any) => this.mapVendureProduct(i)),
      count,
      pageSize: take,
      noOfPage: Math.ceil(count / take) || 1,
      page
    } as PaginatedResponse<[Product]>
  }

  async getOne(slug: string) {
    const res = await this.query<any>('/shop-api', GET_PRODUCT_QUERY, { slug });
    const item = res?.product;
    
    const mappedProduct = this.mapVendureProduct(item);
    return mappedProduct
  }

  async addReview({
    productId,
    variantId,
    review,
    rating,
    uploadedImages
  }: {
    productId: string
    variantId: string
    review: string
    rating: number
    uploadedImages: string[]
  }) {
    // Mocking success response as discussed
    return {
      success: true,
      message: 'Review submitted successfully',
      data: {
        productId,
        variantId,
        review,
        rating,
        uploadedImages
      }
    }
  }

  async fetchReels() {
    // Mocking empty reels array as discussed
    return {
      data: [],
      count: 0
    }
  }
}

// Use singleton instance
export const productService = ProductService.getInstance()
