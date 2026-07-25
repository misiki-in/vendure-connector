import type { User, verifyEmail } from '../types'
import { BaseService } from './base.service'

/**
 * AuthService provides functionality for user authentication and profile management
 * in the Litekart platform.
 *
 * This service helps with:
 * - User registration and login processes
 * - Password management and recovery
 * - User profile management
 * - Authentication verification
 * - Vendor and admin registration
 */
export class AuthService extends BaseService {
  private static instance: AuthService

  /**
   * Get the singleton instance
   *
   * @returns {AuthService} The singleton instance of AuthService
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Retrieves the current authenticated user's profile
   *
   * @returns {Promise<User>} The current user's profile data
   * @api {get} /api/admin/users/me Get current user profile
   *
   * @example
   * // Get the current user's profile
   * const currentUser = await authService.getMe();
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
   * Fetches a user by ID
   *
   * @param {string} id - The ID of the user to fetch
   * @returns {Promise<User>} The requested user
   * @api {get} /api/users/:id Get user by ID
   *
   * @example
   * // Example usage
   * const user = await authService.getUser('123');
   */
  async getUser(id: string): Promise<User> {
    throw new Error('getUser by ID is not supported in Vendure Shop API')
  }

  /**
   * Verifies a user's email with the provided token
   *
   * @param {string} email - The email address to verify
   * @param {string} token - The verification token
   * @returns {Promise<verifyEmail>} The verification result
   * @api {post} /api/auth/verify-email Verify email address
   *
   * @example
   * // Verify a user's email
   * const result = await authService.verifyEmail('user@example.com', 'verification-token');
   */
  async verifyEmail(email: string, token: string) {
    const document = `
      mutation VerifyCustomerAccount($token: String!) {
        verifyCustomerAccount(token: $token) {
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
    const data = await this.query<any>('/shop-api', document, { token })
    return data?.verifyCustomerAccount as verifyEmail
  }

  /**
   * Registers a new user account
   *
   * @param {object} userData - The user registration data
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.lastName - User's last name
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's chosen password
   * @param {string} userData.passwordConfirmation - Password confirmation
   * @param {string} [userData.cartId] - Optional cart ID to associate with the account
   * @returns {Promise<User>} The created user profile
   * @api {post} /api/auth/signup Register new user
   *
   * @example
   * // Register a new user
   * const newUser = await authService.signup({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   phone: '+1234567890',
   *   email: 'john.doe@example.com',
   *   password: 'SecurePassword123',
   *   passwordConfirmation: 'SecurePassword123'
   * });
   */
  async signup({
    firstName,
    lastName,
    phone,
    email,
    password,
    passwordConfirmation,
    cartId = null
  }: {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string
    cartId?: string | null
  }) {
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
  }

  /**
   * Registers a new vendor account
   *
   * @param {object} vendorData - The vendor registration data
   * @param {string} vendorData.firstName - Vendor's first name
   * @param {string} vendorData.lastName - Vendor's last name
   * @param {string} vendorData.businessName - Vendor's business name
   * @param {string} vendorData.phone - Vendor's phone number
   * @param {string} vendorData.email - Vendor's email address
   * @param {string} vendorData.password - Vendor's chosen password
   * @param {string} [vendorData.cartId] - Optional cart ID to associate with the account
   * @param {string} vendorData.role - Vendor's role in the system
   * @param {string} vendorData.origin - Origin of the registration request
   * @returns {Promise<User>} The created vendor profile
   * @api {post} /api/auth/join-as-vendor Register new vendor
   *
   * @example
   * // Register a new vendor
   * const newVendor = await authService.joinAsVendor({
   *   firstName: 'Jane',
   *   lastName: 'Smith',
   *   businessName: 'Smith Enterprises',
   *   phone: '+1234567890',
   *   email: 'jane.smith@example.com',
   *   password: 'SecurePassword123',
   *   role: 'vendor',
   *   origin: 'website'
   * });
   */
  async joinAsVendor({
    firstName,
    lastName,
    businessName,
    phone,
    email,
    password,
    cartId = null,
    role,
    origin
  }: {
    firstName: string
    lastName: string
    businessName: string
    phone: string
    email: string
    password: string
    cartId?: string | null
    role: string
    origin: string
  }) {
    throw new Error('Not implemented for Vendure')
  }

  /**
   * Registers a new admin account
   *
   * @param {object} adminData - The admin registration data
   * @param {string} adminData.firstName - Admin's first name
   * @param {string} adminData.lastName - Admin's last name
   * @param {string} adminData.businessName - Admin's business name
   * @param {string} adminData.phone - Admin's phone number
   * @param {string} adminData.email - Admin's email address
   * @param {string} adminData.password - Admin's chosen password
   * @param {string} adminData.origin - Origin of the registration request
   * @returns {Promise<User>} The created admin profile
   * @api {post} /api/auth/join-as-admin Register new admin
   *
   * @example
   * // Register a new admin
   * const newAdmin = await authService.joinAsAdmin({
   *   firstName: 'Admin',
   *   lastName: 'User',
   *   businessName: 'Admin Company',
   *   phone: '+1234567890',
   *   email: 'admin@example.com',
   *   password: 'SecurePassword123',
   *   origin: 'website'
   * });
   */
  async joinAsAdmin({
    firstName,
    lastName,
    businessName,
    phone,
    email,
    password,
    origin
  }: {
    firstName: string
    lastName: string
    businessName: string
    phone: string
    email: string
    password: string
    origin: string
  }) {
    throw new Error('Not implemented for Vendure')
  }

  /**
   * Authenticates a user with email and password
   *
   * @param {object} loginData - The login credentials
   * @param {string} loginData.email - User's email address
   * @param {string} loginData.password - User's password
   * @param {string} [loginData.cartId] - Optional cart ID to associate with the session
   * @returns {Promise<User>} The authenticated user profile
   * @api {post} /api/auth/login User login
   *
   * @example
   * // Login a user
   * const user = await authService.login({
   *   email: 'user@example.com',
   *   password: 'SecurePassword123'
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
   * Initiates the password recovery process
   *
   * @param {object} recoveryData - The recovery request data
   * @param {string} recoveryData.email - User's email address
   * @param {string} recoveryData.referrer - URL referring to the recovery request
   * @returns {Promise<User>} Confirmation of the recovery process
   * @api {post} /api/auth/forgot-password Request password reset
   *
   * @example
   * // Request password recovery
   * await authService.forgotPassword({
   *   email: 'user@example.com',
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
   * Changes the password for the current authenticated user
   *
   * @param {object} passwordData - The password change data
   * @param {string} passwordData.old - Current password
   * @param {string} passwordData.password - New password
   * @returns {Promise<User>} Updated user profile
   * @api {post} /api/admin/auth/change-password Change password
   *
   * @example
   * // Change user password
   * await authService.changePassword({
   *   old: 'OldPassword123',
   *   password: 'NewPassword456'
   * });
   */
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

  /**
   * Resets a user's password using a recovery token
   *
   * @param {object} resetData - The password reset data
   * @param {string} resetData.userId - ID of the user
   * @param {string} resetData.token - Password reset token
   * @param {string} resetData.password - New password
   * @returns {Promise<User>} Updated user profile
   * @api {post} /api/auth/reset-password Reset password
   *
   * @example
   * // Reset a user's password
   * await authService.resetPassword({
   *   userId: '123',
   *   token: 'reset-token',
   *   password: 'NewPassword456'
   * });
   */
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

  /**
   * Requests an OTP (One-Time Password) for phone verification
   *
   * @param {object} otpData - The OTP request data
   * @param {string} otpData.phone - Phone number to send OTP to
   * @returns {Promise<User>} Confirmation of OTP delivery
   * @api {post} /api/auth/get-otp Request OTP
   *
   * @example
   * // Request an OTP
   * await authService.getOtp({
   *   phone: '+1234567890'
   * });
   */
  async getOtp({ phone }: { phone: string }) {
    throw new Error('Not implemented for Vendure')
  }

  /**
   * Verifies a phone number using an OTP
   *
   * @param {object} verifyData - The verification data
   * @param {string} verifyData.phone - Phone number to verify
   * @param {string} verifyData.otp - OTP code received
   * @returns {Promise<User>} Confirmation of verification
   * @api {post} /api/auth/verify-otp Verify OTP
   *
   * @example
   * // Verify an OTP
   * await authService.verifyOtp({
   *   phone: '+1234567890',
   *   otp: '123456'
   * });
   */
  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    throw new Error('Not implemented for Vendure')
  }

  /**
   * Logs out the current user
   *
   * @returns {Promise<any>} Confirmation of logout
   * @api {delete} /api/auth/logout User logout
   *
   * @example
   * // Logout the current user
   * await authService.logout();
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
   * @param {object} profileData - The profile update data
   * @param {string} profileData.id - User ID
   * @param {string} profileData.firstName - User's first name
   * @param {string} profileData.lastName - User's last name
   * @param {string} profileData.email - User's email address
   * @param {string} profileData.phone - User's phone number
   * @param {string} [profileData.avatar] - Optional user avatar URL
   * @returns {Promise<User>} Updated user profile
   * @api {put} /api/users/:id Update user profile
   *
   * @example
   * // Update a user's profile
   * const updatedUser = await authService.updateProfile({
   *   id: '123',
   *   firstName: 'John',
   *   lastName: 'Smith',
   *   email: 'john.smith@example.com',
   *   phone: '+9876543210',
   *   avatar: 'https://example.com/avatar.jpg'
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
    const data = await this.query<any>('/shop-api', document, {
      input: {
        firstName,
        lastName,
        emailAddress: email,
        phoneNumber: phone
      }
    })
    return data?.updateCustomer as User
  }
}

// Use singleton instance
export const authService = AuthService.getInstance()
