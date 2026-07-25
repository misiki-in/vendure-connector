/**
 * Feedback-related type definitions
 */

export type Feedback = {
  id: string // Unique identifier for the feedback
  userId: string // ID of the user providing the feedback
  content: string // Feedback or review content
  rating: number // Rating value, e.g., 1-5
  isActive: boolean // Indicates if the feedback is active/visible
  response: string | null // Optional response to the feedback
  feedbackDate: string // Date feedback was provided
  createdAt: string // Timestamp of when the feedback was created
  updatedAt: string // Timestamp of the last update to the feedback
}

export type Contact = {
  id: string // Unique identifier for the contact entry
  name: string // Name of the contact person
  email: string // Email address of the contact person
  phone: string | null // Optional phone number
  subject: string | null // Subject of the contact message
  message: string // Content of the message
  createdAt: string // Timestamp of when the contact entry was created
  updatedAt: string // Timestamp of the last update to the entry
}

export type Demo = {
  id: string // Unique identifier for the demo request
  name: string // Name of the requester
  email: string // Contact email for the demo request
  phone: string | null // Optional phone number for contact
  company: string | null // Company name associated with the demo request
  message: string | null // Additional details or message for the demo
  isActive: boolean // Indicates if the demo request is active
  isCompleted: boolean // Indicates if the demo has been completed
  demoDate: string | null // Scheduled date for the demo
  createdAt: string // Timestamp of when the demo request was created
  updatedAt: string // Timestamp of the last update to the demo request
}
