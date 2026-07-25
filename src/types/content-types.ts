export type Page = {
	id: string // Unique identifier for the page
	name: string // Name of the page (must be unique)
	slug: string // Slug for the page URL (must be unique)
	content?: string // Content of the page
	metaDescription?: string // Meta description for the page
	metaKeywords?: string // Meta keywords for the page
	createdAt: string // Timestamp for when the page was created
	updatedAt: string // Timestamp for when the page was last updated
	desktopBanners?: Record<string, unknown>[]
	metaTitle?: string // Meta title for the page
	mobileBanners: Record<string, unknown>[]
	rank?: number // Rank for sorting the page in lists
	sections?: Record<string, unknown>[] // Sections of the page
	status: string // Status of the page (e.g., draft, published)
	type: string // Type of the page
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

export type Enquiry = {
	id: string
	email: string
	phone: string
	message: string
	productId: string
	createdAt: string
	updatedAt: string
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
