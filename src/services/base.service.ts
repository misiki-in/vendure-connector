/**
 * BaseService provides core HTTP functionality for all service classes
 * in the Litekart API client.
 *
 * This service helps with:
 * - Performing standardized HTTP requests (GET, POST, PUT, PATCH, DELETE)
 * - Handling response parsing and type conversion
 * - Providing a configurable fetch implementation
 */
export class BaseService {
  private _fetch: typeof fetch

  /**
   * Creates a new BaseService instance
   *
   * @param {typeof fetch} [fetchFn] - Optional custom fetch implementation
   */
  constructor(fetchFn?: typeof fetch) {
    // Use provided fetch or global fetch as fallback
    this._fetch = fetchFn || fetch
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
   * Perform a GET request
   *
   * @param {string} url - The URL to request
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async get<T>(url: string): Promise<T> {
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
