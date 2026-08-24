import type { Address } from '../types/address-types'
import type { PaginatedResponse } from '../types/pagination-types'
import { BaseService } from './base.service'

const ACTIVE_CUSTOMER_ADDRESSES_QUERY = `
  query ActiveCustomerAddresses {
    activeCustomer {
      id
      addresses {
        id fullName company streetLine1 streetLine2 city province postalCode country { code } phoneNumber defaultShippingAddress defaultBillingAddress createdAt updatedAt
      }
    }
  }
`;

const CREATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      id fullName company streetLine1 streetLine2 city province postalCode country { code } phoneNumber defaultShippingAddress defaultBillingAddress createdAt updatedAt
    }
  }
`;

const UPDATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      id fullName company streetLine1 streetLine2 city province postalCode country { code } phoneNumber defaultShippingAddress defaultBillingAddress createdAt updatedAt
    }
  }
`;

const DELETE_CUSTOMER_ADDRESS_MUTATION = `
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`;

/**
 * Parameters for listing addresses with pagination and filtering
 */
interface ListAddressesParams {
  /** The page number to fetch (1-based) */
  page?: number
  /** Search query string */
  q?: string
  /** Sort order (e.g., '-createdAt' for newest first) */
  sort?: string
  /** Filter by user ID */
  user?: string
}

/**
 * Parameters for creating a new address
 */
type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'active'>

/**
 * Parameters for updating an existing address
 */
type UpdateAddressParams = Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>


/**
 * AddressService provides functionality for managing user addresses,
 * adapted for the Vendure API.
 */
export class AddressService extends BaseService {
  private static instance: AddressService

  /**
   * Get the singleton instance
   */
  static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }
    return AddressService.instance
  }

  private mapVendureAddress(vendureAddress: any, customerId: string | null = null): Address {
    if (!vendureAddress) return {} as Address;
    
    const names = (vendureAddress.fullName || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    return {
      id: vendureAddress.id,
      active: true,
      address_1: vendureAddress.streetLine1 || null,
      address_2: vendureAddress.streetLine2 || null,
      city: vendureAddress.city || null,
      country: vendureAddress.country?.code || null,
      countryCode: vendureAddress.country?.code || null,
      deliveryInstructions: null,
      email: null,
      firstName: firstName || null,
      lastName: lastName || null,
      isPrimary: vendureAddress.defaultShippingAddress || vendureAddress.defaultBillingAddress || false,
      isResidential: true,
      lat: null,
      lng: null,
      locality: null,
      phone: vendureAddress.phoneNumber || null,
      state: vendureAddress.province || null,
      userId: customerId,
      zip: vendureAddress.postalCode || null,
      createdAt: vendureAddress.createdAt || new Date().toISOString(),
      updatedAt: vendureAddress.updatedAt || new Date().toISOString()
    }
  }

  /**
   * Fetches a paginated list of addresses
   */
  async list(params: ListAddressesParams = {}): Promise<PaginatedResponse<Address>> {
    const res = await this.query<any>('/shop-api', ACTIVE_CUSTOMER_ADDRESSES_QUERY);
    const customer = res?.activeCustomer;
    if (!customer || !customer.addresses) {
      return { data: [], count: 0, pageSize: 20, noOfPage: 1, page: 1 };
    }
    const addresses = customer.addresses.map((a: any) => this.mapVendureAddress(a, customer.id));
    
    return {
      data: addresses,
      count: addresses.length,
      pageSize: addresses.length || 20,
      noOfPage: 1,
      page: 1
    };
  }

  /**
   * Fetches a single address by ID
   */
  async fetchAddress(id: string): Promise<Address> {
    const res = await this.query<any>('/shop-api', ACTIVE_CUSTOMER_ADDRESSES_QUERY);
    const customer = res?.activeCustomer;
    const vendureAddress = customer?.addresses?.find((a: any) => a.id === id);
    if (!vendureAddress) throw new Error(`Address with id ${id} not found`);
    return this.mapVendureAddress(vendureAddress, customer?.id);
  }

  /**
   * Creates a new address for the current user
   */
  async saveAddress(address: CreateAddressParams): Promise<Address> {
    const fullName = `${address.firstName || ''} ${address.lastName || ''}`.trim();
    
    const input = {
      fullName: fullName,
      company: '',
      streetLine1: address.address_1 || '',
      streetLine2: address.address_2 || '',
      city: address.city || '',
      province: address.state || '',
      postalCode: address.zip || '',
      countryCode: address.countryCode || address.country || 'IN',
      phoneNumber: address.phone || '',
      defaultShippingAddress: address.isPrimary || false,
      defaultBillingAddress: address.isPrimary || false
    };

    const res = await this.query<any>('/shop-api', CREATE_CUSTOMER_ADDRESS_MUTATION, { input });
    return this.mapVendureAddress(res.createCustomerAddress);
  }

  /**
   * Updates an existing address
   */
  async editAddress(id: string, address: UpdateAddressParams): Promise<Address> {
    const input: any = { id };
    
    if (address.firstName !== undefined || address.lastName !== undefined) {
      let fName = address.firstName;
      let lName = address.lastName;
      if (fName === undefined || lName === undefined) {
        const existing = await this.fetchAddress(id).catch(() => null);
        if (existing) {
          fName = fName !== undefined ? fName : existing.firstName;
          lName = lName !== undefined ? lName : existing.lastName;
        }
      }
      input.fullName = `${fName || ''} ${lName || ''}`.trim();
    }
    
    if (address.address_1 !== undefined) input.streetLine1 = address.address_1 || '';
    if (address.address_2 !== undefined) input.streetLine2 = address.address_2 || '';
    if (address.city !== undefined) input.city = address.city || '';
    if (address.state !== undefined) input.province = address.state || '';
    if (address.zip !== undefined) input.postalCode = address.zip || '';
    if (address.countryCode !== undefined || address.country !== undefined) {
      input.countryCode = address.countryCode || address.country || 'IN';
    }
    if (address.phone !== undefined) input.phoneNumber = address.phone || '';
    if (address.isPrimary !== undefined) {
      input.defaultShippingAddress = address.isPrimary;
      input.defaultBillingAddress = address.isPrimary;
    }

    const res = await this.query<any>('/shop-api', UPDATE_CUSTOMER_ADDRESS_MUTATION, { input });
    return this.mapVendureAddress(res.updateCustomerAddress);
  }

  /**
   * Deletes an address
   */
  async deleteAddress(id: string): Promise<void> {
    await this.query<any>('/shop-api', DELETE_CUSTOMER_ADDRESS_MUTATION, { id });
  }
}

// Use singleton instance
export const addressService = AddressService.getInstance()
