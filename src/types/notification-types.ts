/**
 * Notification-related type definitions
 */

export type Notification = {
  id?: string
  name: string
  slug: string
  apiKey: string
  apiSecret: string
  senderAddress: string
  webhookUrl: string
  trackingUrl: string
  type: string
  rank: number
  active: boolean
  storeId: string
  userId: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  description: string
}

export type Template = {
  id?: string
  templateId: string
  title: string
  subject: string
  html: string
  description: string
  type: string
  variables?: string[]
  createdAt?: string
  updatedAt?: string
}
