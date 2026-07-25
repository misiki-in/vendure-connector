import type { User } from './../types'
import { BaseService } from './base.service'

/**
 * UserService provides functionality for user account management
 * in the Litekart platform.
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
    return this.get<User>('/api/users/me')
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
    return this.get<User>(`/api/users/${id}`)
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
      return this.post<User>('/api/auth/signup', {
        firstName,
        lastName,
        phone,
        email,
        password,
        cartId,
        origin
      })
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
    return this.post<User>('/api/auth/login', { email, password })
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
    return this.post<User>('/api/auth/forgot-password', {
      email,
      referrer
    })
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
    return this.delete('/api/auth/logout')
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
    return this.put(`/api/admin/users/${id}`, {
      firstName,
      lastName,
      email,
      phone,
      avatar
    })
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
    return this.post<User>('/api/auth/join-as-vendor', {
      firstName,
      lastName,
      businessName,
      phone,
      email,
      password,
      cartId,
      origin
    })
  }

  async changePassword(body: { old: string; password: string }) {
    return this.post<User>('/api/auth/change-password', body)
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
    return this.post<User>('/api/auth/reset-password', {
      userId,
      token,
      password
    })
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
    return this.post<{ otp: string }>('/api/auth/get-otp', {
      firstName,
      lastName,
      phone,
      email,
      password,
      passwordConfirmation
    })
  }

  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    return this.post<User>('/api/auth/verify-otp', { phone, otp })
  }

  async checkEmail(email: string) {
    try {
      const res = await this.post('/api/users/check-email', { email })
      return res
    } catch (e: unknown) {
      const error = e as { message?: string }
      throw new Error(error?.message || 'Failed to check email')
    }
  }

  async deleteUser(id: string) {
    return this.delete(`/api/delete/user/${id}`)
  }
}

// Use singleton instance
export const userService = UserService.getInstance()
