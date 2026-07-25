# Litekart Connector Type System

This directory contains all the TypeScript type definitions used in the Litekart Connector.

## Organization

The types are modularized into logical groups:

### Core Types

- `user-types.ts` - User, authentication, and account-related types
- `product-types.ts` - Product-related types
- `order-types.ts` - Order-related types
- `store-types.ts` - Store-related types
- `content-types.ts` - Content-related types
- `common-types.ts` - Common utility types
- `cart-types.ts` - Shopping cart types

### Domain-Specific Types

- `address-types.ts` - Address-related types
- `payment-types.ts` - Payment method and transaction types
- `checkout-types.ts` - Checkout process types
- `coupon-types.ts` - Coupon and deals types
- `shipping-types.ts` - Shipping, fulfillment and returns types
- `vendor-types.ts` - Vendor and supplier types
- `banner-types.ts` - Banner and promotional types
- `blog-types.ts` - Blog and content types
- `feedback-types.ts` - Feedback, reviews, and contact types
- `gallery-types.ts` - Image gallery types
- `menu-types.ts` - Menu and navigation types
- `notification-types.ts` - Notification and template types
- `region-types.ts` - Region, country, and currency types
- `setting-types.ts` - Settings and configuration types
- `wishlist-types.ts` - Wishlist types

### Utility Types

- `pagination-types.ts` - Pagination response types

## Usage

All types are exported from the `index.ts` file, so you can import them directly from the `types` module:

```typescript
import { User, Product, Order } from '../types'
```

## Adding New Types

When adding new types:

1. Place them in the appropriate file based on domain
2. Export them from the file
3. Ensure they're exported from `index.ts`
4. Follow the naming conventions and documentation patterns

## Type Documentation

Types include JSDoc-style comments to document:

- The purpose of each field
- Any constraints or requirements
- Default values where applicable
- Relationships to other types
