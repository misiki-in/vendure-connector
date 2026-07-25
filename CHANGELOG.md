# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.26] - 2025-XX-XX

### Added
- New Varni custom design services:
  - `varni/custom-design-service.ts` - Custom product design management
  - `varni/custom-product-service.ts` - Custom product variant operations
- `wishlistService.checkWishlistInBulk` - Bulk wishlist status checking for performance
- `orderService.submitReview` - Direct review submission from order page

### Improved
- Enhanced type definitions for better TypeScript support
- Improved error handling across services
- Added more comprehensive JSDoc annotations
- Updated pagination response types

### Fixed
- Minor bug fixes in cart service
- Fixed type issues in checkout service

---

## [2.0.25] - 2025-XX-XX

### Added
- `orderService.submitReview()` - Submit product reviews from orders
- Performance optimizations for bulk operations
- Enhanced error messages

### Fixed
- Fixed cart refresh functionality
- Resolved type compatibility issues

---

## [2.0.24] - 2025-XX-XX

### Added
- Meilisearch autocomplete support via `meilisearchService.searchAutoComplete()`
- Enhanced search facets for better filtering
- Improved pagination types
- Better TypeScript 5.x compatibility

### Changed
- Updated search result structure with more facets
- Improved type definitions for product variants and options

---

## [2.0.23] - 2024-XX-XX

### Added
- `reelsService` - Product video reels support
- `dealService` - Flash sales and limited-time offers
- Enhanced content management services
- Improved checkout flow for multiple payment gateways

### Changed
- Refactored checkout service for better maintainability
- Updated payment capture methods

### Fixed
- Fixed payment callback handling
- Resolved cart ID storage issues

---

## [2.0.22] - 2024-XX-XX

### Added
- `storeService` - Multi-store configuration support
- `pluginsService` - Plugin management
- `pageService` - CMS pages with custom content
- Better TypeScript strict mode support

### Improved
- Comprehensive type definitions for all services
- Enhanced documentation with more examples
- Improved error handling consistency

---

## [2.0.21] - 2024-XX-XX

### Added
- Full support for Affirm payment gateway
- Enhanced address management
- Bulk wishlist checking
- Improved category and menu services

### Changed
- Simplified service initialization
- Updated TypeScript configuration

---

## [2.0.20] - 2024-XX-XX

### Added
- PhonePe payment gateway support
- Enhanced search filtering with attributes and options
- Better pagination support across all list methods
- Comprehensive type definitions

### Fixed
- Fixed quote calculation in cart service
- Resolved address validation issues

---

## [2.0.19] - 2024-XX-XX

### Added
- PayPal checkout integration
- Improved shipping rate calculations
- Enhanced product search with faceted results
- More comprehensive error handling

### Changed
- Refactored cart service for clarity
- Updated checkout flow

---

## [2.0.18] - 2024-XX-XX

### Added
- Stripe payment integration
- Cashfree payment support
- Razorpay payment capture
- Multi-payment gateway support

### Improved
- Better TypeScript type coverage
- Enhanced service documentation

---

## [2.0.17] - 2024-XX-XX

### Added
- Search service with Meilisearch integration
- Autocomplete service
- Product review management
- Wishlist management
- Coupon service with validation

### Changed
- Moved to TypeScript ES modules
- Improved service architecture

---

## [2.0.16] - 2024-XX-XX

### Added
- Comprehensive cart operations
- Checkout service with multiple gateways
- Order management with tracking
- Address book management
- User profile management

### Improved
- Singleton service pattern
- Consistent error handling

---

## [2.0.15] - 2024-XX-XX

### Added
- Product catalog services
- Category management
- Banner and blog services
- Basic search functionality
- User authentication services

---

## [2.0.0] - 2024-XX-XX

### Added
- Initial release
- Core e-commerce services
- TypeScript support
- Full API coverage
- Comprehensive documentation

[Documentation](https://litekart.in/docs/connector)

---

## How to Read This Changelog

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

---

## Upgrade Guide

### From v1.x to v2.x

1. Replace direct service instantiation with singleton imports:
   ```diff
- const productService = new ProductService()
+ import { productService } from '@misiki/litekart-connector'
   ```

2. Handle paginated responses properly:
   ```typescript
   // response.data contains the array
   // response.count contains total count
   const result = await productService.list({})
   result.data.forEach(product => /* ... */)
   ```

3. Update checkout methods - use specific payment methods:
   ```diff
- await checkoutService.checkout({ cartId, paymentMethod: 'razorpay' })
+ await checkoutService.checkoutRazorpay({ cartId, origin })
   ```

See [DOCS.md](./DOCS.md) for complete migration examples.
