import { isRestPath, resolveRestLocally } from './rest-guard'
/**
 * BaseService provides core HTTP functionality for all service classes in this connector.
 *
 * This service helps with:
 * - Performing standardized HTTP requests (GET, POST, PUT, PATCH, DELETE)
 * - Handling response parsing and type conversion
 * - Providing a configurable fetch implementation
 */
export class BaseService {
  private _fetch: typeof fetch
  private static _authToken?: string
  private static _channelToken?: string
  private static _languageCode?: string
  private static _baseUrl?: string

  /**
   * Creates a new BaseService instance
   *
   * @param {typeof fetch} [fetchFn] - Optional custom fetch implementation
   */
  constructor(fetchFn?: typeof fetch) {
    // Use provided fetch or global fetch as fallback
    this._fetch = fetchFn || fetch

    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = window.localStorage.getItem('vendure_auth_token')
      if (storedToken) {
        BaseService._authToken = storedToken
      }
    }
  }

  /**
   * Set the fetch instance to be used by this service
   *
   * @param {typeof fetch} fetchFn - The fetch implementation to use
   * @returns {BaseService} The service instance for chaining
   */
  setFetch(fetchFn: typeof fetch) {
    this._fetch = fetchFn
    return this
  }

  /**
   * Get the current fetch instance
   *
   * @returns {typeof fetch} The current fetch implementation
   */
  getFetch(): typeof fetch {
    return this._fetch
  }

  setAuthToken(token?: string) {
    BaseService._authToken = token
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem('vendure_auth_token', token)
      } else {
        window.localStorage.removeItem('vendure_auth_token')
      }
    }
    return this
  }

  getAuthToken() {
    return BaseService._authToken
  }

  setChannelToken(token?: string) {
    BaseService._channelToken = token
    return this
  }

  getChannelToken() {
    return BaseService._channelToken
  }

  setLanguageCode(code?: string) {
    BaseService._languageCode = code
    return this
  }

  getLanguageCode() {
    return BaseService._languageCode
  }

  setBaseUrl(url?: string) {
    BaseService._baseUrl = url
    return this
  }

  getBaseUrl() {
    return BaseService._baseUrl
  }

  private async safeFetch(url: URL | string, data?: any) {
    try {
      //@todo: remove this
      console.log("Making request to------------->", url)
      return await this._fetch(url, data)
    } catch(e: any) {
      if (navigator.onLine) {
			  throw { message: 'Please check your internet connection and try again' }
      }
      throw { message: 'Unable to reach the server. Please try again in a moment' }
    }
  }

  private async handleError(response: Response) {
    //@todo: remove this
    console.log("Response error-------------->", response)

    if (response.headers.get("Content-Type") != "application/json")
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`)

		if (response.status === 401) {
			throw { message: 'Session expired. Please login again' }
		}

    const data = await response.json()
		throw { message: 'Something went wrong. Please try again', ...data }
  }

  /**
   * Perform a GraphQL request to Vendure's Shop API
   *
   * @param {string} url - The URL to request
   * @param {string} document - The GraphQL query/mutation document
   * @param {Record<string, any>} variables - The variables for the GraphQL request
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async query<T>(url: string, document: string, variables: Record<string, any> = {}): Promise<T> {
    let endpoint = url
    if (BaseService._baseUrl) {
      if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
        if (endpoint.startsWith('/') && BaseService._baseUrl.endsWith('/')) {
          endpoint = BaseService._baseUrl + endpoint.substring(1)
        } else if (!endpoint.startsWith('/') && !BaseService._baseUrl.endsWith('/')) {
          endpoint = BaseService._baseUrl + '/' + endpoint
        } else {
          endpoint = BaseService._baseUrl + endpoint
        }
      }
    }
    
    if (BaseService._languageCode) {
      const separator = endpoint.includes('?') ? '&' : '?'
      endpoint += `${separator}languageCode=${BaseService._languageCode}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (BaseService._authToken) {
      headers['authorization'] = `Bearer ${BaseService._authToken}`
    }
    if (BaseService._channelToken) {
      headers['vendure-token'] = BaseService._channelToken
    }

    const response = await this.safeFetch(endpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        query: document,
        variables
      })
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    const newAuthToken = response.headers.get('vendure-auth-token')
    if (newAuthToken) {
      this.setAuthToken(newAuthToken)
    }

    const result = await response.json()
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0].message || 'GraphQL Error'
      if (errorMessage === 'error.no-customer-found-for-current-user') {
        this.setAuthToken(undefined)
        if (typeof window !== 'undefined') {
          window.document.cookie = 'me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }
      throw new Error(errorMessage)
    }

    return result.data as T
  }

  /**
   * Perform a GET request
   *
   * @param {string} url - The URL to request
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async get<T>(url: string): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('get', url)) as T
    const response = await this.safeFetch(url)

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a POST request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async post<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('post', url)) as T
    const response = await this.safeFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a PUT request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async put<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('put', url)) as T
    const response = await this.safeFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a PATCH request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async patch<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('patch', url)) as T
    const response = await this.safeFetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a DELETE request
   *
   * @param {string} url - The URL to request
   * @returns {Promise<T>} Promise resolving to the response data or status
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async delete<T>(url: string): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('delete', url)) as T
    const response = await this.safeFetch(url, {
      method: 'DELETE'
    })

    if (!response.ok && response.status !== 204) {
      await this.handleError(response)
    }

    if (response.status === 204) return response as T
    return (await response.json()) as T
  }
}
