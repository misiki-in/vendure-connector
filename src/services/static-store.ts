import type { StoreDetails } from './store-service'

/**
 * Store identity for a Vendure storefront.
 *
 * Vendure has no notion of the record this storefront calls a "store" — name, logo, favicon,
 * currency, menus, plugin toggles, theme variables. On a REST backend that comes from
 * `/api/stores/public-details`; behind Vendure there is no such API, so the storefront supplies it
 * from its own config and registers it here once at boot.
 *
 * Registered by the storefront (see `src/lib/core/connectors/*` in svelte-commerce). Until it is,
 * `StoreService` and `MenuService` behave as before.
 */
export type StaticStoreProvider = () => Promise<Record<string, any>> | Record<string, any>

let provider: StaticStoreProvider | undefined

export const setStaticStore = (fn: StaticStoreProvider) => {
  provider = fn
}

export const hasStaticStore = () => Boolean(provider)

export const readStaticStore = async (): Promise<Record<string, any> | undefined> => {
  if (!provider) return undefined
  return await provider()
}

export const readStaticStoreDetails = async (): Promise<StoreDetails | undefined> =>
  (await readStaticStore()) as StoreDetails | undefined
