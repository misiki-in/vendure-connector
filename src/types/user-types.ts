export type User = {
	id: string
	phone?: string | null
	email: string
	status?: string | null
	avatar?: string | null
	cartId?: string | null
	verifiedAt?: string | null // ISO timestamp
	currentSignInAt?: string | null // ISO timestamp
	currentSignInIp?: string | null
	firstName?: string | null
	lastName?: string | null
	ipCity?: string | null
	ipCountry?: string | null
	ipLatitude?: number | null
	ipLongitude?: number | null
	ipRegion?: string | null
	ipTimezone?: string | null
	isApproved: boolean
	isDeleted: boolean
	lastSignInAt?: string | null // ISO timestamp
	lastSignInIp?: string | null
	lastSignIn?: string | null // ISO timestamp
	otp?: string | null
	otpAttempt: number
	otpTime?: string | null // ISO timestamp
	password?: string | null // Should not be exposed in select schemas
	isEmailVerified: boolean
	isPhoneVerified: boolean
	role?: string | null
	signInCount: number
	userAuthToken?: string | null
	createdAt: string // ISO timestamp
	updatedAt: string // ISO timestamp
}

export type verifyEmail = {
	email: string
	token: string
}

export type Role = {
	name: string
	description: string
	permissions: string[]
	createdAt: string
	updatedAt: string
}
