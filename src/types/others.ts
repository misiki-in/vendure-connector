export type Init = {
	name: string
}

export type Home = {
	name: string
}

export type State = {
	name: string
	code: string
}

export type Message = {
	id: string
	name: string
}

export type Enquiry = {
	id: string
	email: string
	phone: string
	message: string
	productId: string
	createdAt: string
	updatedAt: string
}

export type InventoryItem = {
	id: string
	name: string
	description: string | null
	type: string
	productId: string
	location: string
	stock: number
	sku: string
	barcode: string
	batchNo: string
	allowBackorder: boolean
	manageInventory: boolean
	minStockLevel: number
	reorderQuantity: number
	active: boolean
	createdAt: string
	updatedAt: string
}

export type ShippingProvider = {
	id: string
	name: string
}

export type ReturnReason = {
	id: string
	name: string
}

export type Tag = {
	id: string
	name: string
	description: string
	type: string
	colorCode: string
	slug: string
	userId: string
	rank: number
	createdAt: string
	updatedAt: string
}

export type Invoice = {
	id: string
	name: string
}

export type Country = {
	name: string
	iso2: string
}

export type Role = {
	name: string
	description: string
	permissions: string[]
	createdAt: string
	updatedAt: string
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

export type Team = {
	id?: string
	email: string
	phone?: string
	role: string
	vendorId: string
	storeId: string
	avatar?: string
	approved: boolean
	isJoined?: boolean
	isCreator?: boolean
	zips?: string[]
	createdAt?: string
	updatedAt?: string
}

export type Cart = {
	// Primary fields
	id: string
	email: string | null
	phone: string | null
	lineItems: CartLineItem[]
	// References
	billingAddressId: string | null
	shippingAddressId: string | null
	regionId: string | null
	userId: string | null
	salesChannelId: string | null
	storeId: string | null

	// Payment and discount related
	couponCode: string | null
	discountAmount: number
	couponAppliedDate: string | null
	paymentId: string | null
	paymentMethod: string | null
	paymentAuthorizedAt: string | null

	// Cart configuration
	needAddress: boolean
	isCodAvailable: boolean
	type: string
	completedAt: string | null
	idempotencyKey: string | null

	// Shipping related
	shippingCharges: number
	shippingMethod: string | null

	// Quantity and monetary values
	qty: number
	subtotal: number
	codCharges: number
	tax: number
	total: number
	savingAmount: number
}

export type CartLineItem = {
	id: string
	productId: string
	variantId: string
	qty: number
	price: number
	total: number
}

export type ProductAttribute = {
	id: string
	productId: string
	title: string
	value: string
	rank: number
	createdAt: Date
	updatedAt: Date
}

export type ApiKey = {
	id: string
	secret: string
	active: boolean
	public: string
	createdAt: Date
	updatedAt: Date
}

// Enums
enum ProductStatus {
	DRAFT = 'draft',
	PROPOSED = 'proposed',
	PUBLISHED = 'published',
	REJECTED = 'rejected'
}

// Main Product Interface
export type Product = {
	id: string
	active: boolean
	status: ProductStatus
	type: string
	vendorId: string
	categoryId: string | null
	currency: string | null
	instructions: string | null
	description: string | null
	hsnCode: string | null
	images: string | null
	featuredImage: string | null
	thumbnail: string | null
	keywords: string | null
	link: string | null
	metaTitle: string | null
	metaDescription: string | null
	title: string
	subtitle: string | null
	popularity: number
	rank: number
	slug: string | null

	// Dates and Measurements
	expiryDate: string | null
	weight: number | null
	mfgDate: string | null

	// Pricing and Inventory
	mrp: number
	price: number
	costPerItem: number
	sku: string | null
	stock: number
	allowBackorder: boolean
	manageInventory: boolean

	// Shipping Dimensions
	shippingWeight: number | null
	shippingHeight: number | null
	shippingLen: number | null
	shippingWidth: number | null

	// Product Dimensions
	height: number | null
	width: number | null
	len: number | null

	// Additional Details
	barcode: string | null
	shippingCost: number | null
	returnAllowed: boolean
	replaceAllowed: boolean

	// Metadata and References
	originCountry: string | null
	weightUnit: string
	dimensionUnit: string
	metadata: Record<string, any> | null
	collectionId: string | null

	// Variants
	options?: { id: string; title: string; type: string; values: { id: string; value: string }[] }[]
	variants?: Variant[]
}

export type Variant = {
	id: string
	title: string
	productId: string
	sku: string | null
	barcode: string | null
	batchNo: string | null
	stock: number
	allowBackorder: boolean
	manageInventory: boolean
	hsCode: string | null
	originCountry: string | null
	midCode: string | null
	material: string | null
	weight: number | null
	length: number | null
	height: number | null
	width: number | null
	price: number
	costPerItem: number
	mfgDate: string | null
	expiryDate: string | null
	returnAllowed: boolean
	replaceAllowed: boolean
	mrp: number
	img: string | null
	description: string | null
	storeId: string | null
	len: number | null
	rank: number
	shippingWeight: number | null
	shippingHeight: number | null
	shippingLen: number | null
	shippingWidth: number | null
	shippingCost: number | null
	metadata: Record<string, any> | null
	variantRank: number
	options: { id: string; optionId: string; value: string; variantId: string }[]
}

export type CartProduct = {
	id: string
	slug: string
	thumbnail: string
	productId: string
	variantId: string
	item_id: string
	title: string
	price: number
	product: Product
	qty: number
}

export type Dimensions = {
	width: number
	height: number
	depth: number
}

export type Review = {
	rating: number
	comment: string
	date: string
	reviewerName: string
	reviewerEmail: string
}

export type Meta = {
	createdAt: string
	updatedAt: string
	barcode: string
	qrCode: string
}

export type Banner = {
	id: string // Unique identifier for the banner
	active: boolean // Indicates whether the banner is active
	demo: boolean // Indicates if this is a demo banner
	groupId: string | null // Optional group identifier for categorizing banners
	groupTitle: string | null // Optional title for the group of banners
	heading: string | null // Optional heading for the banner
	img: string // Image URL for the banner (required)
	imgCdn: string | null // Optional CDN URL for the image
	link: string | null // Optional link for redirection when the banner is clicked
	pageId: string // Page identifier where the banner will be displayed (defaults to 'home')
	pageType: string | null // Optional type of page for the banner
	isLinkExternal: boolean | null // Indicates if the link is external
	sort: number | null // Optional sorting index for display order
	storeId: number // Required store identifier
	userId: number | null // Optional user identifier for the banner's owner
	type: string // Type of the banner (defaults to 'slider')
	isMobile: boolean // Indicates if the banner is optimized for mobile
	description: string | null // Optional description of the banner
	title: string | null // Optional title for the banner
	bannerId: number | null // Optional identifier for related banners
	fieldGrid: number | null // Optional grid field for layout
	scroll: boolean | null // Indicates if the banner is scrollable
	createdAt: string // Timestamp when the banner was created
	updatedAt: string // Timestamp when the banner was last updated
}

export type Blog = {
	id: string // Unique identifier for the blog post
	status: string | null // Optional status of the blog post (e.g., draft, published)
	title: string // Title of the blog post
	content: string // Content of the blog post
	user: string // Required user ID of the author
	createdAt: string // Timestamp when the blog post was created
	updatedAt: string // Timestamp when the blog post was last updated
}

export type Domain = {
	id: string // Unique identifier for the blog post
	status: string // Optional status of the blog post (e.g., draft, published)
	name: string // Title of the blog post
	description: string
	isPrimary: boolean
	isPropagated: boolean
	isActive: boolean
	isDeleted: boolean
	isVerified: boolean
	storeId: string
	userId: string
	createdAt: string // Timestamp when the blog post was created
	updatedAt: string // Timestamp when the blog post was last updated
}

export type Category = {
	id: string // Unique identifier for the category
	isActive: boolean // Indicates if the category is active
	isInternal: boolean // Indicates if the category is internal
	isMegamenu: boolean // Indicates if the category is part of a megamenu
	thumbnail: string | null // Optional thumbnail image URL
	path: string | null // Optional URL path for the category
	level: number | null // Optional level in the category hierarchy
	description: string | null // Optional description of the category
	isFeatured: boolean // Indicates if the category is featured
	keywords: string | null // Optional keywords for SEO
	rank: number // Rank for sorting, defaulting to 0
	link: string | null // Optional link associated with the category
	metaDescription: string | null // Optional meta description for SEO
	metaKeywords: string | null // Optional meta keywords for SEO
	metaTitle: string | null // Optional meta title for SEO
	name: string // Name of the category
	parentCategoryId: string | null // Optional reference to the parent category
	store: string | null // Optional store associated with the category
	slug: string | null // Optional URL-friendly name
	userId: string // User ID of the creator or owner
	activeProducts: number // Count of active products, defaults to 0
	inactiveProducts: number // Count of inactive products, defaults to 0
	createdAt: string // Timestamp of creation
	updatedAt: string // Timestamp of last update
}

export type Checkout = {
	id: string // Unique identifier for the checkout
	orderId: string // Identifier for the associated order
	userId: string // ID of the user making the checkout
	status: string // Status of the checkout (e.g., pending, completed)
	totalAmount: number // Total amount for the checkout
	paymentMethod: string // Payment method used in the checkout
	paymentStatus: string // Status of payment (e.g., unpaid, paid)
	isConfirmed: boolean // Indicates if the checkout is confirmed
	discount: number // Discount applied to the total amount
	tax: number // Tax applied to the total amount
	shippingCost: number // Shipping cost for the checkout
	createdAt: string // Timestamp of when the checkout was created
	updatedAt: string // Timestamp of the last update to the checkout
}

export type Collection = {
	id: string // Unique identifier for the collection
	name: string // Name of the collection
	slug: string // URL-friendly slug for the collection
	description: string | null // Optional description of the collection
	isActive: boolean // Indicates if the collection is active
	isFeatured: boolean // Indicates if the collection is featured
	userId: string // User ID of the creator or owner
	productCount: number // Number of products in the collection, defaults to 0
	thumbnail: string | null // Optional thumbnail image URL
	metaTitle: string | null // Optional meta title for SEO
	metaDescription: string | null // Optional meta description for SEO
	createdAt: string // Timestamp of when the collection was created
	updatedAt: string // Timestamp of last update to the collection
}

export type CustomerGroup = {
	id: string // Unique identifier for the group
	name: string // Name of the group
	slug: string // URL-friendly slug for the group
	description: string | null // Optional description of the group
	isActive: boolean // Indicates if the group is active
	isFeatured: boolean // Indicates if the group is featured
	userId: string // User ID of the creator or owner
	productCount: number // Number of products in the group, defaults to 0
	thumbnail: string | null // Optional thumbnail image URL
	metaTitle: string | null // Optional meta title for SEO
	metaDescription: string | null // Optional meta description for SEO
	createdAt: string // Timestamp of when the group was created
	updatedAt: string // Timestamp of last update to the group
}

export type Commission = {
	id: string // Unique identifier for the commission
	commissionRate: number // Commission rate, either a percentage or fixed amount
	commissionType: string // Type of commission (e.g., percentage or fixed)
	userId: string // User ID associated with this commission
	isActive: boolean // Indicates if the commission is currently active
	startDate: string // Start date of the commission period
	endDate: string | null // Optional end date of the commission period
	createdAt: string // Timestamp of when the commission record was created
	updatedAt: string // Timestamp of the last update to the commission record
}

export type Coupon = {
	id: string // Unique identifier for the coupon
	code: string // Unique code for the coupon
	amount: number // Discount amount
	type: 'USER' | 'TOTAL' | 'BOGO' // Type of coupon, as defined by the CouponTypeEnum
	maxAmount: number // Maximum discount amount
	createdAt: string // Timestamp of when the coupon was created
	updatedAt: string // Timestamp of the last update to the coupon
}

export type Deal = {
	// Primary fields
	id: string
	title: string
	description: string | null
	storeId: string | null

	// Deal configuration and conditions
	dealType: string // e.g., "discount", "bundle", "BOGO"
	discountPercentage: number | null
	discountAmount: number | null
	minPurchaseAmount: number | null
	startDate: string
	endDate: string | null
	active: boolean
	conditions: Record<string, any> | null // e.g., specific category, user segment, etc.

	// Product associations
	products: string[] // Array of product IDs eligible for the deal
	variants: string[] // Array of variant IDs eligible for the deal

	// Deal limits
	maxUses: number | null // Maximum times the deal can be applied
	perUserLimit: number | null // Maximum times a single user can use this deal

	// Metadata and tracking
	metadata: Record<string, any> | null
	createdAt: string
	updatedAt: string
}

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

export type Fulfillment = {
	id: string // Primary key for the fulfillment record
	shippingSync: boolean // Indicates if shipping is synchronized
	store: string | null // Optional store identifier
	active: boolean // Indicates if the fulfillment is active
	orderNo: number // Order number associated with the fulfillment
	trackingNumber: string | null // Optional tracking number for the shipment
	trackingUrl: string | null // Optional URL for tracking the shipment
	vendorId: string | null // Optional vendor ID for the fulfillment
	orderId: string | null // Optional order ID for the fulfillment
	batchNo: string // Batch number for the fulfillment (required)
	fulfillmentOrderId: string | null // Optional fulfillment order ID
	shipmentId: string | null // Optional shipment ID
	shippingProvider: string | null // Optional shipping provider name
	shipmentLabel: string | null // Optional label for the shipment
	invoiceUrl: string | null // Optional URL for the invoice
	courierName: string | null // Optional name of the courier
	courierId: string | null // Optional ID of the courier
	shippingStatus: string | null // Optional shipping status
	status: string // Current status of the fulfillment (default: 'confirmed')
	shippingInfo: string | null // Optional additional shipping information
	manifest: string | null // Optional manifest details
	userId: number | null // Optional user ID associated with the fulfillment
	pickup: Record<string, any> | null // Optional JSON object for pickup details
	weight: number | null // Weight in grams
	length: number | null // Length dimension
	breadth: number | null // Breadth dimension
	height: number | null // Height dimension
	createdAt: string // Timestamp for when the fulfillment was created
	updatedAt: string // Timestamp for when the fulfillment was last updated
}

export type Page = {
	id: string // Unique identifier for the page
	name: string // Name of the page (must be unique)
	slug: string // Slug for the page URL (must be unique)
	content?: string // Content of the page
	metaDescription?: string // Meta description for the page
	metaKeywords?: string // Meta keywords for the page
	createdAt: string // Timestamp for when the page was created
	updatedAt: string // Timestamp for when the page was last updated
}

export type PaymentMethod = {
	id: string // Unique identifier for the payment method
	name: string // Name of the payment method (must be unique)
	type: string // Type of payment method (e.g., credit card, PayPal)
	active: boolean // Indicates if the payment method is active
	isTest: boolean // Indicates if the payment method is in test mode
	manualCapture: boolean // Indicates if the payment method requires manual capture
	value: string
	createdAt: string // Timestamp for when the payment method was created
	updatedAt: string // Timestamp for when the payment method was last updated
}

export type Plugins = {
	id: string // Unique identifier for the plugin
	name: string // Name of the plugin (must be unique)
	code: string // Type of plugin (e.g., credit card, PayPal)
	short_description: string // Short description of the plugin
	inputs: Record<string, any> // Indicates if the plugin is active
	active: boolean // Indicates if the plugin is active
	createdAt: string // Timestamp for when the plugin was created
	updatedAt: string // Timestamp for when the plugin was last updated
}

export type PopularSearch = {
	id: string // Unique identifier for the popular search entry
	searchTerm: string // The search term that is popular
	popularityScore: number // Score indicating how popular the search term is
	createdAt: string // Timestamp for when the popular search entry was created
	updatedAt: string // Timestamp for when the popular search entry was last updated
}

export type Report = {
	id: string // Unique identifier for the report
	title: string // Title of the report
	description: string // Detailed description of the report
	createdBy: string // Identifier for the user who created the report
	status: string // Current status of the report (e.g., pending, completed, reviewed)
	createdAt: string // Timestamp for when the report was created
	updatedAt: string // Timestamp for when the report was last updated
}

export type Return = {
	id: string // Unique identifier for the return
	orderId: string // Identifier for the associated order
	reason: string // Reason for the return
	status: string // Current status of the return (e.g., pending, approved, rejected)
	createdBy: string // Identifier for the user who initiated the return
	createdAt: string // Timestamp for when the return was created
	updatedAt: string // Timestamp for when the return was last updated
}

export type Order = {
	id: string // Unique identifier for the order
	orderNo: number // Unique serial order number
	storeId: string | null // Identifier for the store associated with the order
	batchNo: string | null // Batch number for the order
	amount: Record<string, any> | null // JSON object representing the amount breakdown
	parentOrderNo: string | null // Parent order number, if applicable
	vendorId: string // Identifier for the vendor, references Vendor.id
	isEmailSentToVendor: boolean // Flag to check if an email was sent to the vendor
	status: string // Status of the order (e.g., created, processing, completed)
	cartId: string // Cart ID associated with the order, references Cart.id
	userId: string | null // User ID who placed the order
	userPhone: string | null // User phone number
	userFirstName: string | null // First name of the user
	userLastName: string | null // Last name of the user
	userEmail: string | null // User email address
	comment: string | null // Any comment provided with the order
	needAddress: boolean // Flag indicating if an address is needed for the order
	selfTakeout: boolean // Flag for self-takeout orders
	shippingCharges: number // Charges for shipping
	total: number | null // Total amount for the order
	subtotal: number | null // Subtotal amount for the order
	discount: number | null // Discount applied to the order
	tax: number | null // Tax amount for the order
	currencySymbol: string | null // Symbol for the currency used
	currencyCode: string | null // Currency code (e.g., USD, EUR)
	codCharges: number | null // Cash on Delivery charges, if applicable
	codPaid: number | null // Amount paid for COD
	paid: boolean // Flag indicating if the order is fully paid
	paySuccess: number // Payment success flag or count
	amountRefunded: number | null // Total amount refunded
	amountDue: number | null // Remaining amount due
	amountPaid: number | null // Total amount paid so far
	totalDiscount: number | null // Total discount on the order
	totalAmountRefunded: number | null // Total refunded amount on the order
	paymentMethod: string | null // Payment method used
	platform: string | null // Platform through which the order was placed
	couponUsed: string | null // Coupon code used
	coupon: string | null // Coupon details
	paymentStatus: string | null // Status of the payment
	paymentCurrency: string | null // Currency in which the payment was made
	paymentMsg: string | null // Payment status message
	paymentReferenceId: string | null // Reference ID for payment processing
	paymentGateway: string | null // Payment gateway used
	paymentId: string | null // Payment ID, references Payment.id
	paymentAmount: number | null // Amount paid through the payment method
	paymentMode: string | null // Mode of payment (e.g., card, UPI)
	paymentDate: string | null // Date of the payment
	shippingAddressId: string | null // Shipping address ID
	billingAddressId: string | null // Billing address ID
	shippingAddress: Record<string, any> | null // JSON object for shipping address details
	billingAddress: Record<string, any> | null // JSON object for billing address details
	createdAt: string // Timestamp when the order was created
	updatedAt: string // Timestamp when the order was last updated
}

export type Region = {
	id: string // Unique identifier for the region
	name: string // Name of the region
	currencyCode: string // Currency code (e.g., USD, EUR) used in the region
	currency: string // Currency code reference from the Currency table
	taxRate: number // Tax rate applicable in the region
	taxCode: string | null // Tax code, if any
	metadata: Record<string, any> | null // Metadata in JSON format for additional details
	createdAt: string | null // Timestamp when the region was created
	updatedAt: string | null // Timestamp for the last update of the region
	deletedAt: string | null // Timestamp for soft deletion of the region, if applicable
}

export type PaginatedResponse<T> = {
	data: T[] // Array of items of type T
	count: number // Total count of items in the collection
	pageSize: number // Number of items per page
	noOfPage: number // Total number of pages
	page: number // Current page number
}

export type Wishlist = {
	id: string // Unique identifier for the wishlist entry
	active: boolean // Status to indicate if the wishlist item is active
	product: string // Product ID associated with the wishlist item
	listing: string // Listing ID for the product
	store: string | null // Store ID, can be null if not specified
	userId: string // User ID who created the wishlist item
	variant: string // Variant ID of the product, defaults to an empty string
	createdAt: string // Timestamp of when the wishlist item was created
	updatedAt: string // Timestamp of the last update to the wishlist item
}

export type Setting = {
	id: string // Unique identifier for each setting
	name: string // Name of the setting
	description?: string // Optional description of the setting
	logo?: string // URL or path to the logo
	address_1?: string // Address line 1
	address_2?: string // Address line 2
	city?: string // City of the setting's location
	state?: string // State of the setting's location
	country?: string // Country of the setting's location
	phone?: string // Contact phone number
	email?: string // Contact email
	zipCode?: string // Zip code, limited to 16 characters
	currency?: string // Foreign key reference to `Currency` code
	language?: string // Language for the setting
	commission?: number // Commission percentage, defaults to 0
	emailProvider?: string // Email service provider name
	paymentProvider?: string // Payment provider name
	shippingProvider?: string // Shipping provider name
	weightUnit?: string // Weight unit, e.g., "kg", "lbs"
	dimensionUnit?: string // Dimension unit, e.g., "cm", "in"
	createdAt?: string // Timestamp when the setting was created
	updatedAt?: string // Timestamp when the setting was last updated
}

export type Vendor = {
	id: string
	status?: string | null
	address?: string | null
	email: string
	phone: string
	dialCode?: string | null
	name?: string | null
	email2?: string | null
	banners?: string | null
	logo?: string | null
	countryName?: string | null
	country?: string | null // Country.iso2 reference
	about?: string | null
	businessName: string
	website?: string | null
	description?: string | null
	info?: string | null
	shippingCharges: number
	codCharges: number
	slug?: string | null
	featuredImage?: string | null
	isEmailVerified: boolean
	isPhoneVerified: boolean
	address_1?: string | null
	address_2?: string | null
	city?: string | null
	isApproved: boolean
	isDeleted: boolean
	state?: string | null
	tax_number?: string | null
	zip?: string | null
	user: string // User.id reference
	createdAt: string
	updatedAt: string
}

export type verifyEmail = {
	email: string
	token: string
}

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

export type Currency = {
	id: string
	name: string
}

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

export type AutoComplete = {
	id: string // Unique identifier for the autocomplete entry
	text: string // Text for the autocomplete suggestion
	type: string // Type/category of the suggestion (e.g., "product", "category")
	popularity: number // Popularity score, used for ranking
	createdAt: string // Timestamp of when the entry was created
	updatedAt: string // Timestamp of the last update to the entry
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

// export type Country = {
//     id: string; // Unique identifier for the country
//     name: string; // Full name of the country
//     code: string; // ISO 3166-1 alpha-3 country code (e.g., "USA", "FRA")
//     isoCode: string; // ISO 3166-1 alpha-2 country code (e.g., "US", "FR")
//     continent: string; // Continent the country belongs to
//     population: number; // Population of the country
//     currency: string | null; // Currency code (ISO 4217, e.g., "USD", "EUR")
//     language: string | null; // Primary language spoken in the country
//     capital: string | null; // Capital city
//     description: string | null; // Additional details or description
// };

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

export type Gallery = {
	id: string // Unique identifier for the gallery item
	title: string // Title or name of the gallery image
	description: string | null // Description or caption for the image
	imageUrl: string // URL to the image
	thumbnailUrl: string | null // Optional thumbnail URL for a smaller preview
	sortOrder: number // Order of the image in the gallery display
	isActive: boolean // Indicates if the image is active or visible in the gallery
	createdAt: string // Timestamp of when the gallery item was created
	updatedAt: string // Timestamp of the last update to the gallery item
}
export type Store = {
	id: string
	name: string
	isActive: boolean
	isApproved: boolean
	isFeatured: boolean
	isClosed: boolean
	ownerFirstName: string | null
	ownerLastName: string | null
	ownerPhone: string | null
	ownerEmail: string | null
	address_1: string
	address_2: string | null
	zipCode: string | null
	city: string | null
	state: string | null
	country: string | null
	lat: number | null
	lng: number | null
	currencyCode: string | null
	currencySymbol: string | null
	currencySymbolNative: string | null
	lang: string | null
	description: string | null
	metaTitle: string | null
	metaDescription: string | null
	metaKeywords: string | null
	freeShippingOn: number
	minimumOrderValue: number
	shippingCharges: number
	commissionRate: number
	timeZone: string | null
	businessPhone: string | null
	businessEmail: string | null
	businessLegalName: string | null
	businessName: string | null
	logo: string | null
	dimensionUnit: string
	weightUnit: string
	userId: string | null
	createdAt: string
	updatedAt: string
}
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

export type Reels = {
	id: string
	name: string
	link: string
	active: string
	type: string
	video: string
	poster: string
	items: string
	storeId: string
	userId: string
	createdAt: string
	updatedAt: string
}
