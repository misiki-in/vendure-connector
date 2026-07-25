/**
 * Menu-related type definitions
 */

export type Menu = {
  id: string
  active: boolean
  name: string | null
  menuId: string | null
  link: string | null
  items: Record<string, unknown>[]
  storeId: string
  userId: string | null
  createdAt: string
  updatedAt: string
}
