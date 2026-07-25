import { BaseService } from './base.service'

/**
 * ChatService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class ChatService extends BaseService {
	private static instance: ChatService

	/**
	 * Get the singleton instance
	 */
	/**
 * Get the singleton instance
 * 
 * @returns {ChatService} The singleton instance of ChatService
 */
	static getInstance(): ChatService {
		if (!ChatService.instance) {
			ChatService.instance = new ChatService()
		}
		return ChatService.instance
	}
	/**
 * Fetches Chat from the API
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/chat Get chat
 * 
 * @example
 * // Example usage
 * const result = await chatService.list({ page: 1 });
 */
	async list() {
		return this.get<Record<string, any>[]>('/api/chats')
	}
}

// // Use singleton instance
export const chatService = ChatService.getInstance()
