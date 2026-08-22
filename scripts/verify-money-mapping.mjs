/**
 * Ad-hoc check that Shop API minor units land in the storefront as major units.
 * Run with: node scripts/verify-money-mapping.mjs
 */
import assert from 'node:assert/strict'
import { cartService, checkoutService, productService, searchService } from '../dist/index.js'

const respond = (data) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })

const stub = (service, data) => service.setFetch(async () => respond(data))

let failures = 0
const check = (label, actual, expected) => {
  try {
    assert.deepEqual(actual, expected)
    console.log(`  ok   ${label}: ${JSON.stringify(actual)}`)
  } catch {
    failures++
    console.log(`  FAIL ${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`)
  }
}

// --- PDP: the reported $1,558.80 laptop -------------------------------------
stub(productService, {
  product: {
    id: '1',
    name: 'Laptop',
    slug: 'laptop',
    variants: [
      { id: 'v1', sku: 'LP-1', price: 132100, priceWithTax: 155880, currencyCode: 'USD', stockLevel: 'IN_STOCK' }
    ]
  }
})
const product = await productService.getOne('laptop')
console.log('product-service')
check('product.price', product.price, 1558.8)
check('product.mrp', product.mrp, 1558.8)
check('variant.price', product.variants[0].price, 1558.8)

// Zero-decimal currency must pass through untouched.
stub(productService, {
  product: {
    id: '2',
    name: 'Kettle',
    slug: 'kettle',
    variants: [{ id: 'v2', price: 4980, priceWithTax: 5478, currencyCode: 'JPY', stockLevel: 'IN_STOCK' }]
  }
})
check('JPY product.price', (await productService.getOne('kettle')).price, 5478)

// Three-decimal currency.
stub(productService, {
  product: {
    id: '3',
    name: 'Dates',
    slug: 'dates',
    variants: [{ id: 'v3', price: 12500, priceWithTax: 12500, currencyCode: 'KWD', stockLevel: 'IN_STOCK' }]
  }
})
check('KWD product.price', (await productService.getOne('dates')).price, 12.5)

// --- Search -----------------------------------------------------------------
console.log('search-service')
stub(searchService, {
  search: {
    totalItems: 1,
    facetValues: [],
    items: [
      {
        productId: '1',
        productName: 'Laptop',
        slug: 'laptop',
        priceWithTax: { min: 155880, max: 249900 },
        currencyCode: 'USD'
      }
    ]
  }
})
const results = await searchService.searchWithQuery('laptop')
check('search price (PriceRange min)', results.data[0].price, 1558.8)

// --- Cart -------------------------------------------------------------------
console.log('cart-service')
stub(cartService, {
  activeOrder: {
    id: 'o1',
    code: 'C1',
    currencyCode: 'USD',
    subTotal: 264200,
    subTotalWithTax: 311760,
    shipping: 1000,
    shippingWithTax: 1180,
    total: 255200,
    totalWithTax: 301136,
    lines: [
      {
        id: 'l1',
        quantity: 2,
        linePrice: 264200,
        linePriceWithTax: 311760,
        unitPrice: 132100,
        unitPriceWithTax: 155880,
        productVariant: { id: 'v1', sku: 'LP-1', name: 'Laptop', product: { id: '1', slug: 'laptop' } }
      }
    ]
  }
})
const cart = await cartService.fetchCartData()
check('cart.subtotal', cart.subtotal, 3117.6)
check('cart.shippingCharges', cart.shippingCharges, 11.8)
check('cart.total', cart.total, 3011.36)
check('cart.tax', cart.tax, 459.36)
check('cart.discountAmount', cart.discountAmount, 118.04)
check('cart.currencyDecimalDigits', cart.currencyDecimalDigits, 2)
check('line.price', cart.lineItems[0].price, 1558.8)
check('line.total', cart.lineItems[0].total, 3117.6)
check('line.variant.price', cart.lineItems[0].variant.price, 1558.8)

// Derived figures must stay exact rather than drift through float subtraction.
check(
  'discount == subtotal + shipping - total',
  Number((cart.subtotal + cart.shippingCharges - cart.total).toFixed(2)),
  cart.discountAmount
)

// --- Shipping rates ---------------------------------------------------------
console.log('checkout-service')
stub(checkoutService, {
  activeOrder: { currencyCode: 'USD' },
  eligibleShippingMethods: [{ id: 's1', code: 'std', name: 'Standard', price: 1000, priceWithTax: 1180 }]
})
const rates = await checkoutService.getShippingRates({ cartId: 'o1' })
check('shipping base_rate', rates.data[0].base_rate, 11.8)

// --- Empty / missing values -------------------------------------------------
console.log('edge cases')
stub(cartService, { activeOrder: null })
const emptyCart = await cartService.fetchCartData()
check('empty cart maps to {}', Object.keys(emptyCart).length, 0)

stub(productService, { product: { id: '4', name: 'No variants', slug: 'nv', variants: [] } })
check('no-variant product price', (await productService.getOne('nv')).price, 0)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
