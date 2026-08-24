import type { Address, Cart, CartLineItem } from './../types'
const REGION_ID = ''

import { currencyFractionDigits, fromMinorUnits } from '../utils/money'
import { BaseService } from './base.service'

const ACTIVE_ORDER_QUERY = `
  query ActiveOrder {
    activeOrder {
      id code state couponCodes subTotal subTotalWithTax shipping shippingWithTax total totalWithTax currencyCode createdAt updatedAt
      customer { id emailAddress firstName lastName phoneNumber }
      shippingAddress { fullName company streetLine1 streetLine2 city province postalCode countryCode phoneNumber }
      billingAddress { fullName company streetLine1 streetLine2 city province postalCode countryCode phoneNumber }
      shippingLines { shippingMethod { id } }
      lines { id quantity linePrice linePriceWithTax unitPrice unitPriceWithTax 
        productVariant { id sku name price 
          product { id slug featuredAsset { preview } }
          featuredAsset { preview }
        }
      }
    }
  }
`;

const ADD_ITEM_MUTATION = `
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const ADJUST_ORDER_LINE_MUTATION = `
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const REMOVE_ORDER_LINE_MUTATION = `
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const APPLY_COUPON_MUTATION = `
  mutation ApplyCouponCode($couponCode: String!) {
    applyCouponCode(couponCode: $couponCode) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const REMOVE_COUPON_MUTATION = `
  mutation RemoveCouponCode($couponCode: String!) {
    removeCouponCode(couponCode: $couponCode) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_SHIPPING_ADDRESS_MUTATION = `
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_BILLING_ADDRESS_MUTATION = `
  mutation SetOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_CUSTOMER_FOR_ORDER_MUTATION = `
  mutation SetCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ... on Order { id customer { id } }
      ... on ErrorResult { errorCode message }
    }
  }
`;

// Vendure will not transition an order to ArrangingPayment without a customer, and setCustomerForOrder
// is the only way one gets attached. Dropping its result on the floor turned a refusal here into
// `State Transition Failed: Cannot transition Order to the "ArrangingPayment" state without Customer
// details` at the payment step, with nothing pointing at the cause.
export const customerForOrderError = (errorCode: string, message?: string) =>
  new Error(
    errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR'
      ? 'That email address already has an account on this store. Log in to place the order.'
      : errorCode === 'ALREADY_LOGGED_IN_ERROR'
        ? // Usually the Vendure admin UI signed in on the same host: the shop API shares its cookie,
          // `activeCustomer` is null because an administrator has no Customer record, and every guest
          // order silently ends up with none.
          'Another Vendure session is signed in on this browser — often the admin UI on the same host. Sign out there or use a private window, then retry.'
        : message || `Could not attach your details to this order (${errorCode}).`
  );

const TRANSITION_ORDER_TO_STATE_MUTATION = `
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order { id }
      ... on OrderStateTransitionError { errorCode message transitionError fromState toState }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_ORDER_SHIPPING_METHOD_MUTATION = `
  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`;

/**
 * CartService provides functionality for managing shopping carts,
 * powered by Vendure.
 *
 * This service helps with:
 * - Retrieving cart data and contents
 * - Adding, updating, and removing items from the cart
 * - Managing cart operations such as checkout preparation
 */
export class CartService extends BaseService {
  private static instance: CartService

  /**
   * Get the singleton instance
   *
   * @returns {CartService} The singleton instance of CartService
   */
  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService()
    }
    return CartService.instance
  }

  private mapVendureOrder(order: any): Cart {
    if (!order) return {} as Cart;
    const lines = order.lines || [];
    const totalQty = lines.reduce((sum: number, l: any) => sum + l.quantity, 0);

    const mapAddress = (addr: any) => {
      if (!addr || !addr.streetLine1) return null;
      const names = (addr.fullName || '').split(' ');
      return {
        id: `addr_${order.id}`,
        address_1: addr.streetLine1 || '',
        address_2: addr.streetLine2 || '',
        city: addr.city || '',
        deliveryInstructions: null,
        email: null,
        phone: addr.phoneNumber || order.customer?.phoneNumber || '',
        firstName: names[0] || '',
        isPrimary: false,
        isResidential: true,
        lastName: names.slice(1).join(' ') || '',
        state: addr.province || '',
        countryCode: addr.countryCode || 'IN',
        userId: order.customer?.id || null,
        zip: addr.postalCode || ''
      };
    };

    const mappedShippingAddress = mapAddress(order.shippingAddress);
    const mappedBillingAddress = mapAddress(order.billingAddress);

    // Order totals stay in Vendure's minor units while they are added up, so
    // the derived discount and tax figures are exact before being scaled down.
    const currencyCode = order.currencyCode || 'INR';
    const minor = (value: any) => (typeof value === 'number' ? value : 0);
    const subTotalMinor = minor(order.subTotalWithTax) || minor(order.subTotal);
    const shippingMinor = minor(order.shippingWithTax) || minor(order.shipping);
    const totalMinor = minor(order.totalWithTax) || minor(order.total);
    const discountMinor = subTotalMinor + shippingMinor - totalMinor;
    const taxMinor = minor(order.totalWithTax) - minor(order.total);

    return {
      id: order.id || '',
      email: order.customer?.emailAddress || null,
      phone: order.customer?.phoneNumber || null,
      billingAddressId: mappedBillingAddress ? mappedBillingAddress.id : null,
      shippingAddressId: mappedShippingAddress ? mappedShippingAddress.id : null,
      regionId: REGION_ID || null,
      userId: order.customer?.id || null,
      couponCode: order.couponCodes?.[0] || null,
      discountAmount: fromMinorUnits(discountMinor, currencyCode),
      couponAppliedDate: null,
      needAddress: !order.shippingAddress?.streetLine1,
      isCodAvailable: false,
      paymentId: null,
      type: null,
      completedAt: null,
      paymentAuthorizedAt: null,
      idempotencyKey: null,
      salesChannelId: null,
      qty: totalQty,
      shippingCharges: fromMinorUnits(shippingMinor, currencyCode),
      paymentMethod: null,
      shippingMethod: null,
      subtotal: fromMinorUnits(subTotalMinor, currencyCode),
      codCharges: 0,
      tax: fromMinorUnits(taxMinor, currencyCode),
      total: fromMinorUnits(totalMinor, currencyCode),
      savingAmount: fromMinorUnits(discountMinor, currencyCode),
      userAuthToken: null,
      currencyCode,
      currencySymbol: "₹",
      shippingRateId: order.shippingLines?.[0]?.shippingMethod?.id || null,
      currencyDecimalDigits: currencyFractionDigits(currencyCode),
      storeId: null,
      createdAt: order.createdAt || null,
      updatedAt: order.updatedAt || null,
      deletedAt: null,
      lineItems: lines.map((l: any) => ({
        id: l.id,
        productId: l.productVariant?.product?.id || '',
        variantId: l.productVariant?.id || '',
        qty: l.quantity,
        subtotal: fromMinorUnits(l.linePriceWithTax || l.linePrice, currencyCode),
        discount: 0,
        tax: 0,
        shippingCharges: 0,
        total: fromMinorUnits(l.linePriceWithTax || l.linePrice, currencyCode),
        price: fromMinorUnits(l.unitPriceWithTax || l.unitPrice, currencyCode),
        mrp: fromMinorUnits(l.unitPriceWithTax || l.unitPrice, currencyCode),
        title: l.productVariant?.name || '',
        slug: l.productVariant?.product?.slug || '',
        sku: l.productVariant?.sku || '',
        description: null,
        thumbnail: l.productVariant?.featuredAsset?.preview || l.productVariant?.product?.featuredAsset?.preview || null,
        metadata: null,
        vendorId: null,
        weight: null,
        dimensionUnit: 'cm',
        height: null,
        width: null,
        len: null,
        shippingWeight: null,
        shippingHeight: null,
        shippingLen: null,
        shippingWidth: null,
        isSelectedForCheckout: true,
        createdAt: null,
        product: {
          id: l.productVariant?.product?.id || '',
          title: l.productVariant?.name || '',
          thumbnail: l.productVariant?.featuredAsset?.preview || l.productVariant?.product?.featuredAsset?.preview || null,
          slug: l.productVariant?.product?.slug || '',
          sku: l.productVariant?.sku || '',
          categories: []
        },
        variant: {
          id: l.productVariant?.id || '',
          price: fromMinorUnits(l.unitPriceWithTax || l.unitPrice, currencyCode),
          mrp: fromMinorUnits(l.unitPriceWithTax || l.unitPrice, currencyCode),
          weight: null,
          height: null,
          width: null,
          len: null,
          shippingWeight: null,
          shippingHeight: null,
          shippingLen: null,
          shippingWidth: null,
          sku: l.productVariant?.sku || '',
          title: l.productVariant?.name || 'default',
          options: []
        }
      })),
      shippingAddress: mappedShippingAddress,
      billingAddress: mappedBillingAddress
    } as any
  }

  /**
   * Fetches the current user's cart data (Vendure Active Order)
   *
   * @returns {Promise<Cart>} The cart data
   * @api {get} /api/cart Get current cart
   */
  async fetchCartData() {
    const res = await this.query<any>('/shop-api', ACTIVE_ORDER_QUERY);
    return this.mapVendureOrder(res?.activeOrder);
  }

  /**
   * Refreshes the cart data from the server
   *
   * @returns {Promise<Cart>} The refreshed cart data
   * @api {get} /api/carts/refresh/:cartId Refresh cart
   */
  async refereshCart() {
    return this.fetchCartData();
  }

  /**
   * Fetches a cart by its ID (Relies on session in Vendure)
   *
   * @param {string} cartId - The ID of the cart to fetch
   * @returns {Promise<Cart>} The requested cart
   * @api {get} /api/carts/:id Get cart by ID
   */
  async getCartByCartId(cartId: string) {
    return this.fetchCartData();
  }

  /**
   * Adds a product to the cart or updates its quantity
   *
   * @param {object} params - The product details to add to cart
   * @param {string} params.productId - The ID of the product to add
   * @param {string} params.variantId - The variant ID of the product
   * @param {number} params.qty - The quantity to add (or -9999999 to remove)
   * @param {string|null} [params.cartId] - Optional cart ID, will use from localStorage if not provided
   * @param {string|null} params.lineId - Line item ID if updating an existing item
   * @returns {Promise<Cart>} The updated cart
   * @api {post} /api/carts/:cartId/line-items Add item to cart
   */
  async addToCart({
    productId,
    variantId,
    qty,
    cartId,
    lineId
  }: {
    productId: string
    variantId: string
    qty: number
    cartId?: string | null
    lineId: string | null
  }) {
    if (qty === -9999999 && lineId) {
      await this.query('/shop-api', REMOVE_ORDER_LINE_MUTATION, { orderLineId: lineId });
    } else if (lineId) {
      await this.query('/shop-api', ADJUST_ORDER_LINE_MUTATION, { orderLineId: lineId, quantity: qty });
    } else {
      await this.query('/shop-api', ADD_ITEM_MUTATION, { productVariantId: variantId, quantity: qty });
    }
    const order = await this.fetchCartData();
    if (order?.id && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('cart_id', order.id);
    }
    return order;
  }

  async removeCart({
    cartId,
    lineId = null
  }: {
    cartId: string
    lineId: string | null
  }) {
    if (lineId) {
      await this.query('/shop-api', REMOVE_ORDER_LINE_MUTATION, { orderLineId: lineId });
    }
    return this.fetchCartData();
  }

  async applyCoupon({
    cartId,
    couponCode
  }: {
    cartId: string
    couponCode: string
  }) {
    await this.query('/shop-api', APPLY_COUPON_MUTATION, { couponCode });
    return this.fetchCartData();
  }

  async removeCoupon() {
    const currentOrder = await this.fetchCartData();
    if (currentOrder?.couponCode) {
       await this.query('/shop-api', REMOVE_COUPON_MUTATION, { couponCode: currentOrder.couponCode });
    }
    return this.fetchCartData();
  }

  async updateCart2({
    storeId,
    cartId,
    email,
    billingAddress,
    customer_id,
    shippingAddress,
    phone,
    isBillingAddressSameAsShipping
  }: any) {
    if (email) {
      const customerInput = {
        emailAddress: email,
        firstName: shippingAddress?.firstName || billingAddress?.firstName || '',
        lastName: shippingAddress?.lastName || billingAddress?.lastName || '',
        phoneNumber: phone || shippingAddress?.phone || billingAddress?.phone || ''
      };
      const customerRes = await this.query<{
        setCustomerForOrder?: { errorCode?: string; message?: string };
      }>('/shop-api', SET_CUSTOMER_FOR_ORDER_MUTATION, { input: customerInput });
      const customerResult = customerRes?.setCustomerForOrder;

      if (customerResult?.errorCode) {
        // Two of Vendure's refusals here are ordinary, not failures worth showing a shopper:
        //
        // NO_ACTIVE_ORDER_ERROR — there is no cart yet, so there is nothing to attach a customer to.
        //   The storefront calls this right after login (`cartState.updateEmail`), which for a shopper
        //   with an empty cart otherwise surfaced "There is no active Order associated with the
        //   current session" as a login error.
        //
        // ALREADY_LOGGED_IN_ERROR — the shopper is signed in, and Vendure associates the order with
        //   their account itself. The same code means something quite different when no customer is
        //   attached to the session (typically the admin UI signed in on the same host), which is a
        //   real dead end and still reported.
        if (customerResult.errorCode === 'NO_ACTIVE_ORDER_ERROR') {
          // nothing to do
        } else if (customerResult.errorCode === 'ALREADY_LOGGED_IN_ERROR') {
          const who = await this.query<{ activeCustomer?: { id: string } | null }>(
            '/shop-api',
            '{ activeCustomer { id } }'
          );
          if (!who?.activeCustomer?.id) {
            throw customerForOrderError(customerResult.errorCode, customerResult.message);
          }
        } else {
          throw customerForOrderError(customerResult.errorCode, customerResult.message);
        }
      }
    }

    if (shippingAddress) {
      const addressInput = {
        fullName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        company: '',
        streetLine1: shippingAddress.address_1 || '',
        streetLine2: shippingAddress.address_2 || '',
        city: shippingAddress.city || '',
        province: shippingAddress.state || '',
        postalCode: shippingAddress.zip || '',
        countryCode: shippingAddress.countryCode || 'IN',
        phoneNumber: shippingAddress.phone || phone || ''
      };
      await this.query('/shop-api', SET_SHIPPING_ADDRESS_MUTATION, { input: addressInput });
    }

    if (billingAddress && !isBillingAddressSameAsShipping) {
      const addressInput = {
        fullName: `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}`.trim(),
        company: '',
        streetLine1: billingAddress.address_1 || '',
        streetLine2: billingAddress.address_2 || '',
        city: billingAddress.city || '',
        province: billingAddress.state || '',
        postalCode: billingAddress.zip || '',
        countryCode: billingAddress.countryCode || 'IN',
        phoneNumber: billingAddress.phone || phone || ''
      };
      await this.query('/shop-api', SET_BILLING_ADDRESS_MUTATION, { input: addressInput });
    } else if (shippingAddress && isBillingAddressSameAsShipping) {
      const addressInput = {
        fullName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        company: '',
        streetLine1: shippingAddress.address_1 || '',
        streetLine2: shippingAddress.address_2 || '',
        city: shippingAddress.city || '',
        province: shippingAddress.state || '',
        postalCode: shippingAddress.zip || '',
        countryCode: shippingAddress.countryCode || 'IN',
        phoneNumber: shippingAddress.phone || phone || ''
      };
      await this.query('/shop-api', SET_BILLING_ADDRESS_MUTATION, { input: addressInput });
    }

    return this.fetchCartData();
  }

  async completeCart(cart_id: string) {
    const res = await this.query<any>('/shop-api', TRANSITION_ORDER_TO_STATE_MUTATION, { state: 'ArrangingPayment' });
    const result = res?.transitionOrderToState;
    if (result?.errorCode) {
      if (result.errorCode === 'ORDER_STATE_TRANSITION_ERROR' && result.fromState === 'ArrangingPayment' && result.toState === 'ArrangingPayment') {
        return this.fetchCartData();
      }
      const detailedError = result.transitionError || result.message;
      throw new Error(`State Transition Failed: ${detailedError}`);
    }
    return this.fetchCartData();
  }

  async updateCart({
    qty,
    cartId,
    lineId = null,
    productId,
    variantId,
    isSelectedForCheckout
  }: any) {
    return this.addToCart({ productId, variantId, qty, cartId, lineId });
  }

  async updateShippingRate({
    cartId,
    shippingRateId
  }: {
    cartId: string
    shippingRateId: string
  }) {
    await this.query('/shop-api', SET_ORDER_SHIPPING_METHOD_MUTATION, { shippingMethodId: [shippingRateId] });
    return this.fetchCartData();
  }
}

// Use singleton instance
export const cartService = CartService.getInstance()
