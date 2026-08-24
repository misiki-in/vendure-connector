import type { PaymentMethod, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

const ELIGIBLE_PAYMENT_METHODS_QUERY = `
  query GetEligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      code
      name
      description
      isEligible
      eligibilityMessage
    }
  }
`;

/**
 * PaymentMethodService provides functionality for working with payment methods,
 * adapted for the Vendure API.
 */
export class PaymentMethodService extends BaseService {
  private static instance: PaymentMethodService

  /**
   * Get the singleton instance
   * 
   * @returns {PaymentMethodService} The singleton instance of PaymentMethodService
   */
  static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService()
    }
    return PaymentMethodService.instance
  }

  private mapVendurePaymentMethod(quote: any): any {
    if (!quote) return {};

    let rawCode = (quote.code || '').toLowerCase();
    let name = quote.name || '';
    
    // Map Vendure's default standard payment to COD
    if (rawCode === 'standard-payment') {
      rawCode = 'COD';
      if (name.toLowerCase() === 'standard payment') {
        name = 'COD';
      }
    }


    return {
      name: name,
      description: quote.description || '',
      apiKey: null,
      isTest: false,
      code: rawCode,
      // No icon URL is invented here: `/static/payment/*` is served by the storefront REST API, which a
      // Vendure storefront does not run, and only the storefront knows which marks it ships.
      // Consumers map `code` to their own asset.
      img: null
    }
  }

  /**
   * Fetches PaymentMethod from the API (Mapped to Vendure's eligiblePaymentMethods)
   * 
   * @param {Object} options - The request options
   * @param {number} [options.page=1] - The page number for pagination
   * @param {string} [options.q=''] - Search query string
   * @param {string} [options.sort='-createdAt'] - Sort order
   * @returns {Promise<any>} The requested data
   */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    const res = await this.query<any>('/shop-api', ELIGIBLE_PAYMENT_METHODS_QUERY);
    const quotes = res?.eligiblePaymentMethods || [];

    // Filter to only include eligible methods and map to the connector's payment-method type
    const mappedMethods = quotes
      .filter((q: any) => q.isEligible)
      .map((q: any) => this.mapVendurePaymentMethod(q));

    return {
      data: mappedMethods,
      count: mappedMethods.length,
      pageSize: mappedMethods.length || 20,
      noOfPage: 1,
      page: 1
    } as PaginatedResponse<PaymentMethod>
  }
}

// Use singleton instance
export const paymentMethodService = PaymentMethodService.getInstance()
