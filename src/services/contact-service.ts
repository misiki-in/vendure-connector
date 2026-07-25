import type { Contact } from './../types'

import { BaseService } from './base.service'

/**
 * ContactService provides functionality for managing contact requests
 * in the Litekart platform.
 *
 * This service helps with:
 * - Submitting contact form data to the API
 * - Processing user inquiries and feedback
 * - Managing customer communication touchpoints
 */
export class ContactService extends BaseService {
  private static instance: ContactService

  /**
   * Get the singleton instance
   *
   * @returns {ContactService} The singleton instance of ContactService
   */
  static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService()
    }
    return ContactService.instance
  }

  /**
   * Submits a contact form to the API
   *
   * @param {object} params - The contact form data
   * @param {string} params.name - The name of the person submitting the form
   * @param {string} params.email - The email address for correspondence
   * @param {string} params.message - The content of the contact message
   * @returns {Promise<Contact>} The created contact request
   * @api {post} /api/contact-us Submit contact form
   *
   * @example
   * // Submit a contact form
   * const result = await contactService.submitContactUsForm({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   message: 'I have a question about your services'
   * });
   */
  async submitContactUsForm({
    name,
    email,
    message
  }: {
    name: string
    email: string
    message: string
  }) {
    return this.post<Contact>('/api/contact-us', { name, email, message })
  }
}

// // Use singleton instance
export const contactService = ContactService.getInstance()
