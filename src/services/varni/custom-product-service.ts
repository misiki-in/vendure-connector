import { BaseService } from "../base.service";

export class VarniCustomProductService extends BaseService {
  private static instance: VarniCustomProductService

  static getInstance(): VarniCustomProductService {
    if (!VarniCustomProductService.instance) {
      VarniCustomProductService.instance = new VarniCustomProductService()
    }
    return VarniCustomProductService.instance
  }

  async checkForCombinationWith(args: {
    color: string;
    stone_quality: string;
    stone_type: string;
    finishing: string;
    size: string;
    metal_color: string;
    metal_type: string;
    style: string;
    word: string;
  }) {
    return this.post('varni/check-customized-product-combinations', args)
  }

  async createCustomOrderChat(productId: string) {
    return this.post('custom-order-chats/create-chat', { productId })
  }

  async sendMessageToCustomOrderChat(chatId: string, vendor: string, message: string) {
    return this.post('custom-order-chats', {
      chatId,
      vendor,
      message
    })
  }
}

export const varniCustomProductService = VarniCustomProductService.getInstance()
