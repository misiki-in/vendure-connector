/**
 * FAQ-related type definitions
 */

export type Faq = {
  id: string // Primary key
  question: string // The FAQ question
  answer: string // The answer to the FAQ
  zip: string | null // Optional ZIP code associated with the FAQ
  status: string | null // Optional status of the FAQ (e.g., active, inactive)
  user: string // User ID referencing the User table
  createdAt: string // Timestamp for when the FAQ was created
  updatedAt: string // Timestamp for when the FAQ was last updated
}
