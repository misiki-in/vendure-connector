import type { User } from './../types'
import { BaseService } from './base.service'

/**
 * UserService provides functionality for user account management.
 *
 * This service helps with:
 * - User authentication (registration, login, logout)
 * - Profile management and updates
 * - Password reset and account recovery workflows
 */
export class UserService extends BaseService {
  private static instance: UserService

  /**
   * Get the singleton instance
   *
   * @returns {UserService} The singleton instance of UserService
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  /**
   * Retrieves the currently authenticated user's profile
   *
   * @returns {Promise<User>} The current user's profile data
   * @api {get} /api/users/me Get current user
   *
   * @example
   * // Get current user profile
   * const currentUser = await userService.getMe();
   */
  async getMe() {
    const document = `
      query GetActiveCustomer {
        activeCustomer {
          id
          firstName
          lastName
          emailAddress
          phoneNumber
        }
      }
    `
    const data = await this.query<{ activeCustomer: any }>('/shop-api', document)
    const customer = data?.activeCustomer
    if (!customer) return null as unknown as User
    
    const user = {
      userId: customer.id,
      phone: customer.phoneNumber || null,
      email: customer.emailAddress,
      firstName: customer.firstName,
      lastName: customer.lastName,
      avatar: null,
      role: 'USER',
      storeId: null
    }

    if (typeof window !== 'undefined') {
      window.document.cookie = `me=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=31536000`
      window.document.cookie = `connect.sid=vendure-session-${customer.id}; path=/; max-age=31536000`
    }

    return user as unknown as User
  }

  /**
   * Retrieves a specific user by ID
   *
   * @param {string} id - The ID of the user to fetch
   * @returns {Promise<User>} The requested user's profile data
   * @api {get} /api/users/:id Get user by ID
   *
   * @example
   * // Get a specific user
   * const user = await userService.getUser('123');
   */
  async getUser(id: string) {
    throw new Error('getUser by ID is not supported in Vendure Shop API')
  }

  /**
   * Registers a new user account
   *
   * @param {Object} params - The user registration data
   * @param {string} params.firstName - User's first name
   * @param {string} params.lastName - User's last name
   * @param {string} params.phone - User's phone number
   * @param {string} params.email - User's email address
   * @param {string} params.password - User's password
   * @param {string|null} params.passwordConfirmation - Password confirmation
   * @param {string|null} [params.cartId] - Optional cart ID to associate with the new account
   * @param {string} params.origin - Origin URL for email verification
   * @returns {Promise<User>} The created user account
   * @api {post} /api/signup Register new user
   *
   * @example
   * // Register a new user
   * const newUser = await userService.signup({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   phone: '1234567890',
   *   email: 'john@example.com',
   *   password: 'secure-password',
   *   passwordConfirmation: 'secure-password',
   *   origin: 'https://example.com'
   * });
   */
  async signup({
    firstName,
    lastName,
    phone,
    email,
    password,
    passwordConfirmation,
    cartId = null,
    origin
  }: {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string | null
    cartId?: string | null
    origin: string
  }) {
    try {
      const document = `
        mutation RegisterCustomerAccount($input: RegisterCustomerInput!) {
          registerCustomerAccount(input: $input) {
            ... on Success {
              success
            }
            ... on ErrorResult {
              errorCode
              message
            }
          }
        }
      `
      const data = await this.query<any>('/shop-api', document, {
        input: {
          emailAddress: email,
          firstName,
          lastName,
          password,
          phoneNumber: phone
        }
      })
      
      if (data?.registerCustomerAccount?.errorCode) {
        throw new Error(data.registerCustomerAccount.message)
      }
      
      return this.login({ email, password, cartId })
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to signup'
      throw new Error(errorMessage)
    }
  }

  /**
   * Authenticates a user with email and password
   *
   * @param {Object} params - The login credentials
   * @param {string} params.email - User's email address
   * @param {string} params.password - User's password
   * @param {string|null} [params.cartId] - Optional cart ID to associate with the session
   * @returns {Promise<any>} Authentication result with tokens and user data
   * @api {post} /api/login User login
   *
   * @example
   * // Login a user
   * const authResult = await userService.login({
   *   email: 'john@example.com',
   *   password: 'secure-password'
   * });
   */
  async login({
    email,
    password,
    cartId = null
  }: {
    email: string
    password: string
    cartId?: string | null
  }) {
    const document = `
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          ... on CurrentUser {
            id
            identifier
          }
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    const data = await this.query<any>('/shop-api', document, {
      username: email,
      password
    })
    
    if (data?.login?.errorCode) {
      throw new Error(data.login.message)
    }
    
    return this.getMe()
  }

  /**
   * Initiates a password reset workflow
   *
   * @param {Object} params - Password reset request parameters
   * @param {string} params.email - User's email address
   * @param {string} params.referrer - URL to include in reset email
   * @returns {Promise<any>} Result of the password reset request
   * @api {post} /api/forgot-password Request password reset
   *
   * @example
   * // Request password reset
   * const result = await userService.forgotPassword({
   *   email: 'john@example.com',
   *   referrer: 'https://example.com/reset-password'
   * });
   */
  async forgotPassword({
    email,
    referrer
  }: {
    email: string
    referrer: string
  }) {
    const document = `
      mutation RequestPasswordReset($emailAddress: String!) {
        requestPasswordReset(emailAddress: $emailAddress) {
          ... on Success {
            success
          }
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    const data = await this.query<any>('/shop-api', document, {
      emailAddress: email
    })
    return data?.requestPasswordReset as User
  }

  /**
   * Logs out the current user
   *
   * @returns {Promise<any>} Logout result
   * @api {post} /api/logout User logout
   *
   * @example
   * // Logout the current user
   * await userService.logout();
   */
  async logout() {
    const document = `
      mutation Logout {
        logout {
          success
        }
      }
    `
    const res = await this.query<any>('/shop-api', document)
    if (typeof window !== 'undefined') {
      window.document.cookie = 'me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      window.document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    return res
  }

  /**
   * Updates a user's profile information
   *
   * @param {Object} params - The profile data to update
   * @param {string} params.id - User ID
   * @param {string} params.firstName - Updated first name
   * @param {string} params.lastName - Updated last name
   * @param {string} params.email - Updated email address
   * @param {string} params.phone - Updated phone number
   * @param {string} [params.avatar] - Optional avatar URL
   * @returns {Promise<User>} The updated user profile
   * @api {put} /api/users/:id Update user profile
   *
   * @example
   * // Update user profile
   * const updatedUser = await userService.updateProfile({
   *   id: '123',
   *   firstName: 'John',
   *   lastName: 'Smith',
   *   email: 'john@example.com',
   *   phone: '9876543210'
   * });
   */
  async updateProfile({
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar
  }: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar?: string
  }) {
    const document = `
      mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
          id
          firstName
          lastName
          emailAddress
          phoneNumber
        }
      }
    `
    // Vendure's UpdateCustomerInput accepts title, firstName, lastName, phoneNumber and customFields
    // — and nothing else. Sending `emailAddress` fails the whole mutation before it runs:
    // `Field "emailAddress" is not defined by type "UpdateCustomerInput"`, which is what a profile
    // save did. Changing an email is a separate, password-protected flow
    // (requestUpdateCustomerEmailAddress -> emailed token -> updateCustomerEmailAddress), so it is
    // refused here with an explanation rather than silently dropped.
    if (email) {
      const current = await this.query<{ activeCustomer?: { emailAddress?: string } | null }>(
        '/shop-api',
        '{ activeCustomer { emailAddress } }'
      )
      const currentEmail = current?.activeCustomer?.emailAddress
      if (currentEmail && email.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
        throw new Error(
          'Changing your email address needs to be confirmed with your password and a verification email, so it cannot be updated from here.'
        )
      }
    }

    const input: Record<string, unknown> = {}
    if (firstName !== undefined && firstName !== null) input.firstName = firstName
    if (lastName !== undefined && lastName !== null) input.lastName = lastName
    if (phone !== undefined && phone !== null) input.phoneNumber = phone

    const data = await this.query<any>('/shop-api', document, { input })
    return data?.updateCustomer as User
  }

  async joinAsVendor({
    firstName,
    lastName,
    businessName,
    phone,
    email,
    password,
    passwordConfirmation,
    cartId = null,
    origin
  }: {
    firstName: string
    lastName: string
    businessName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string
    cartId?: string | null
    origin: string
  }) {
    throw new Error('Not implemented for Vendure')
  }

  async changePassword(body: { old: string; password: string }) {
    const document = `
      mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
        updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
          ... on Success {
            success
          }
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    const data = await this.query<any>('/shop-api', document, {
      currentPassword: body.old,
      newPassword: body.password
    })
    return data?.updateCustomerPassword as User
  }

  async resetPassword({
    userId,
    token,
    password
  }: {
    userId: string
    token: string
    password: string
  }) {
    const document = `
      mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
          ... on CurrentUser {
            id
            identifier
          }
          ... on ErrorResult {
            errorCode
            message
          }
        }
      }
    `
    const data = await this.query<any>('/shop-api', document, {
      token,
      password
    })
    return data?.resetPassword as User
  }

  async getOtp({
    firstName,
    lastName,
    phone,
    email,
    password,
    passwordConfirmation
  }: {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string
  }) {
    throw new Error('Not implemented for Vendure')
  }

  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    throw new Error('Not implemented for Vendure')
  }

  async checkEmail(email: string) {
    throw new Error('Not implemented for Vendure')
  }

  async deleteUser(id: string) {
    throw new Error('Not implemented for Vendure')
  }
}

// Use singleton instance
export const userService = UserService.getInstance()
