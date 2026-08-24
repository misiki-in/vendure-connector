/**
 * Vendure returns every monetary value as an integer in the currency's minor
 * units — 155880 for $1,558.80. The storefront expects major units,
 * so amounts read off the Shop API are scaled down as they leave a mapper.
 *
 * Amounts derived from several Vendure values (discounts, tax) are computed in
 * minor units first and converted once, so the arithmetic stays on integers.
 */

const DEFAULT_FRACTION_DIGITS = 2

const fractionDigitsCache = new Map<string, number>()

/**
 * Number of decimals a currency's minor units carry — 2 for USD/INR, 0 for
 * JPY/KRW, 3 for KWD/BHD.
 *
 * @param {string} [currencyCode] - ISO 4217 code, e.g. 'USD'
 * @returns {number} The currency's fraction digits, 2 when unknown
 */
export function currencyFractionDigits(currencyCode?: string | null): number {
  if (!currencyCode) return DEFAULT_FRACTION_DIGITS

  const code = currencyCode.toUpperCase()
  const cached = fractionDigitsCache.get(code)
  if (cached !== undefined) return cached

  let digits = DEFAULT_FRACTION_DIGITS
  try {
    const resolved = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code
    }).resolvedOptions().maximumFractionDigits
    if (typeof resolved === 'number') digits = resolved
  } catch {
    // Unrecognised code — the two-decimal majority is the safest guess.
  }

  fractionDigitsCache.set(code, digits)
  return digits
}

/**
 * Converts a Vendure minor-unit amount into major units.
 *
 * @param {unknown} value - The minor-unit amount, e.g. 155880
 * @param {string} [currencyCode] - ISO 4217 code the amount is denominated in
 * @returns {number} The amount in major units, e.g. 1558.8; 0 when not numeric
 */
export function fromMinorUnits(
  value: unknown,
  currencyCode?: string | null
): number {
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount)) return 0

  const digits = currencyFractionDigits(currencyCode)
  return digits === 0 ? amount : amount / 10 ** digits
}
