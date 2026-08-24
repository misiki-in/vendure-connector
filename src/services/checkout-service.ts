import type { Cart, Checkout } from './../types'

import { fromMinorUnits } from '../utils/money'
import { BaseService } from './base.service'

const TRANSITION_ORDER_TO_STATE_MUTATION = `
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order { id state code totalWithTax }
      ... on OrderStateTransitionError { errorCode message transitionError fromState toState }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const ADD_PAYMENT_TO_ORDER_MUTATION = `
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order { id state }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const ELIGIBLE_SHIPPING_METHODS_QUERY = `
  query GetEligibleShippingMethods {
    activeOrder { currencyCode }
    eligibleShippingMethods {
      id
      code
      name
      description
      price
      priceWithTax
    }
  }
`;

/**
 * CheckoutService provides functionality for managing checkout processes,
 * adapted for the Vendure Shop API.
 */
// Read before payment: once payment settles the order is no longer the active one, and its code is
// the only handle the confirmation page has. The customer check is the precondition Vendure enforces
// on the ArrangingPayment transition.
const ACTIVE_ORDER_SUMMARY_QUERY = `
  query ActiveOrderSummary {
    activeOrder { id code customer { id } }
  }
`;

export class CheckoutService extends BaseService {
  private static instance: CheckoutService

  /**
   * Get the singleton instance
   */
  static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService()
    }
    return CheckoutService.instance
  }

  private async prepareForPayment(): Promise<any> {
    // Vendure refuses the ArrangingPayment transition without a customer, and the error it returns
    // names none of that. Check it first, and read the code while this is still the active order —
    // after payment settles it is not, and ADD_PAYMENT_TO_ORDER returns no order number, which left
    // storefronts building `/checkout/success?...&order_no=undefined`.
    const summary = await this.query<{
      activeOrder?: { id: string; code: string; customer?: { id: string } | null } | null;
    }>('/shop-api', ACTIVE_ORDER_SUMMARY_QUERY);
    const activeOrder = summary?.activeOrder;
    if (activeOrder && !activeOrder.customer?.id) {
      throw new Error(
        'This order has no email address yet. Collect the shopper\'s email (setCustomerForOrder) before starting payment.'
      );
    }
    this.activeOrderCode = activeOrder?.code || '';

    const res = await this.query<any>('/shop-api', TRANSITION_ORDER_TO_STATE_MUTATION, { state: 'ArrangingPayment' });
    const result = res?.transitionOrderToState;
    if (result?.errorCode) {
      if (result.errorCode === 'ORDER_STATE_TRANSITION_ERROR' && result.fromState === 'ArrangingPayment' && result.toState === 'ArrangingPayment') {
        const orderRes = await this.query<any>('/shop-api', '{ activeOrder { id state code totalWithTax } }');
        return this.withOrderCode(orderRes?.activeOrder);
      }
      const detailedError = result.transitionError || result.message;
      throw new Error(`State Transition Failed: ${detailedError}`);
    }
    return this.withOrderCode(result);
  }

  // The order number every storefront reads off a checkout result, under the names it looks for.
  private activeOrderCode = '';

  private withOrderCode(result: any) {
    const code = result?.code || this.activeOrderCode;
    if (!code) return result;
    return { ...(result ?? {}), code, orderNo: code, order_no: code };
  }

  private async executePayment(method: string, metadata: any = {}): Promise<any> {
    const res = await this.query<any>('/shop-api', ADD_PAYMENT_TO_ORDER_MUTATION, { input: { method, metadata } });
    if (res?.addPaymentToOrder?.errorCode) {
      throw new Error(res.addPaymentToOrder.message);
    }
    return res?.addPaymentToOrder;
  }

  async checkoutRazorpay({ cartId, origin }: { cartId: string; origin: string }) {
    return this.prepareForPayment();
  }

  async checkoutCOD({ cartId, origin }: { cartId: string; origin: string }) {
    await this.prepareForPayment();
    return this.withOrderCode(await this.executePayment('standard-payment', { origin }));
  }

  async checkoutPOS({ cartId, origin }: { cartId: string; origin: string }) {
    await this.prepareForPayment();
    return this.withOrderCode(await this.executePayment('pos', { origin }));
  }

  async captureRazorpayPayment({
    razorpay_order_id,
    razorpay_payment_id
  }: {
    razorpay_order_id: string
    razorpay_payment_id: string
  }) {
    return this.withOrderCode(await this.executePayment('razorpay', { razorpay_order_id, razorpay_payment_id }));
  }

  async checkoutPhonepe({
    cartId,
    email,
    phone,
    origin
  }: {
    cartId: string
    email: string
    phone: string
    origin: string
  }) {
    return this.prepareForPayment();
  }

  async getShippingRates({ cartId }: { cartId: string }) {
    const res = await this.query<any>('/shop-api', ELIGIBLE_SHIPPING_METHODS_QUERY);
    const methods = res?.eligibleShippingMethods || [];
    const currencyCode = res?.activeOrder?.currencyCode ?? null;

    return {
      message: "Shipping rates fetched successfully",
      success: true,
      error: null,
      data: methods.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description || "",
        active: true,
        zone_type: "domestic",
        taxable: true,
        priority: 0,
        price_adjustment: 0,
        currency_code: null,
        min_order_value: null,
        max_order_value: null,
        restricted_categories: null,
        store_id: null,
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        zone_id: null,
        method_type: "price",
        estimated_min_days: 0,
        estimated_max_days: 5,
        free_shipping_threshold: 0,
        base_rate: fromMinorUnits(m.priceWithTax ?? m.price, currencyCode),
        rate_per_weight: 0,
        rate_per_price: 0,
        max_weight: null,
        max_length: null,
        max_width: null,
        max_height: null,
        handling_fee: 0,
        min_order_amount: 0,
        max_order_amount: null,
        min_weight: 0,
        restricted_items: null,
        provider_id: null,
        provider_service_code: null,
        rank: 0
      }))
    } as any;
  }

  async capturePhonepePayment({
    phonepe_order_id,
    phonepe_payment_id
  }: {
    phonepe_order_id: string
    phonepe_payment_id: string
  }) {
    return this.executePayment('phonepe', { phonepe_order_id, phonepe_payment_id });
  }

  async checkoutPaypal({
    cartId,
    origin,
    return_url
  }: {
    cartId: string
    origin: string
    return_url: string
  }) {
    return this.prepareForPayment();
  }

  async checkoutStripe({ cartId, origin }: { cartId: string; origin: string }) {
    return this.prepareForPayment();
  }

  async checkoutStripeCapture({
    order_no,
    pg,
    payment_session_id,
    storeId
  }: {
    order_no: string
    pg: string
    payment_session_id: string
    storeId: string
  }) {
    return this.executePayment('stripe', { payment_session_id });
  }

  async checkoutCashfree({
    cartId,
    email,
    origin
  }: {
    cartId: string
    email: string
    origin: string
  }) {
    return this.prepareForPayment();
  }

  async captureCashfreePayment({ order_no }: { order_no: string }) {
    return this.executePayment('cashfree', { order_no });
  }

  async createAffirmPayOrder({
    cartId,
    addressId,
    origin,
    storeId,
    paymentMethodId
  }: {
    cartId: string
    addressId: string
    origin: string
    storeId: string
    paymentMethodId: string
  }) {
    return this.prepareForPayment();
  }

  async cancelAffirmOrder({
    orderId,
    storeId,
    origin
  }: {
    orderId: string
    storeId: string
    origin: string
  }) {
    // Usually handled by custom logic, fallback to generic
    return this.executePayment('affirm-cancel', { orderId });
  }

  async confirmAffirmOrder({
    affirmToken,
    orderId,
    storeId,
    origin
  }: {
    affirmToken: string
    orderId: string
    storeId: string
    origin: string
  }) {
    return this.executePayment('affirm', { affirmToken, orderId });
  }
}

// Use singleton instance
export const checkoutService = CheckoutService.getInstance()
