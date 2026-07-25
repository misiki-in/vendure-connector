/**
 * Address-related type definitions
 */

export type Address = {
  id: string // Unique identifier for the address
  active: boolean // Indicates if the address is currently active
  address_1: string | null // Primary address line
  address_2: string | null // Secondary address line (optional)
  city: string | null // City of the address
  country: string | null // Country of the address
  deliveryInstructions: string | null // Optional delivery instructions
  email: string | null // Email associated with the address
  firstName: string | null // First name of the address owner
  isPrimary: boolean // Indicates if this is the primary address
  isResidential: boolean // Indicates if the address is residential
  lastName: string | null // Last name of the address owner
  lat: number | null // Latitude for geolocation
  lng: number | null // Longitude for geolocation
  locality: string | null // Locality of the address
  phone: string | null // Phone number associated with the address
  state: string | null // State or region of the address
  userId: string | null // ID of the user associated with the address
  zip: string | null // Zip or postal code
  createdAt: string // Timestamp of when the address was created
  updatedAt: string // Timestamp of the last update to the address
  countryCode: string | null
}
