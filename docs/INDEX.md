# LiteKart Connector Documentation Index

Welcome! This directory contains comprehensive documentation for the LiteKart Connector SDK.

## Getting Started

| Document | Description |
|----------|-------------|
| [README.md](../README.md) | **START HERE** - Quick introduction, installation, and basic usage |
| [QUICKSTART.md](./QUICKSTART.md) | Step-by-step tutorials for common use cases |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference with all methods and parameters |
| [TYPES_REFERENCE.md](./TYPES_REFERENCE.md) | Type definitions and data structures |
| [EXAMPLES.md](./EXAMPLES.md) | Practical code examples for common scenarios |

## For Contributors

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](../CONTRIBUTING.md) | How to contribute to the project |
| [jsdoc-templates.md](./jsdoc-templates.md) | Standardized JSDoc templates |
| [CHANGELOG.md](../CHANGELOG.md) | Version history and release notes |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture overview and design patterns |

## Reference

| Document | Description |
|----------|-------------|
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | Error handling strategies and common errors |
| [PAYMENT_GATEWAYS.md](./PAYMENT_GATEWAYS.md) | Payment gateway integrations guide |
| [SEARCH_GUIDE.md](./SEARCH_GUIDE.md) | Search functionality and Meilisearch integration |
| [FRAMEWORK_INTEGRATION.md](./FRAMEWORK_INTEGRATION.md) | Integration guides for React, Vue, Next.js, etc. |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance tips and best practices |

---

## Quick Links

### Essential Reading

1. **[README.md](../README.md)** - Installation and basic concepts
2. **API_REFERENCE.md** - All available services and methods
3. **EXAMPLES.md** - Copy-paste ready code snippets

### By Use Case

**Building an e-commerce storefront:**
- README.md → QUICKSTART.md → EXAMPLES.md → API_REFERENCE.md

**Integrating with existing Laravel/Node app:**
- README.md → API_REFERENCE.md → ERROR_HANDLING.md → FRAMEWORK_INTEGRATION.md

**Contributing to the SDK:**
- CONTRIBUTING.md → ARCHITECTURE.md → jsdoc-templates.md

**Payment integration:**
- API_REFERENCE.md (checkoutService) → PAYMENT_GATEWAYS.md

**Advanced search:**
- API_REFERENCE.md (searchService, meilisearchService) → SEARCH_GUIDE.md

---

## What's Covered?

### Services (30+)

- **Auth** - Login, registration, password management
- **Products** - Catalog, variants, featured, trending
- **Cart** - Add/remove items, coupons, calculations
- **Orders** - Management, tracking, history
- **Checkout** - Razorpay, Stripe, PhonePe, PayPal, COD, Affirm
- **Search** - Meilisearch, autocomplete, faceted search
- **Categories** - Navigation, hierarchies, megamenu
- **Users** - Profile, addresses, wishlist
- **Reviews** - Ratings and reviews
- **Content** - Blog, banners, pages, galleries
- **Store** - Multi-store, settings
- **Vendor** - Marketplace operations
- **And more!**

### TypeScript Support

- ✅ Full type definitions for all entities
- ✅ No `any` types in public API
- ✅ Generic pagination responses
- ✅ Comprehensive interface definitions
- ✅ Tree-shakable imports

---

## Need Help?

- **Issues**: https://github.com/misiki/litekart-connector/issues
- **Documentation**: https://litekart.in/docs/connector
- **Discord**: https://discord.gg/litekart
- **Email**: support@litekart.in

---

## Version

Current: **v2.0.26**

See [CHANGELOG.md](../CHANGELOG.md) for version history.

---

**Happy building! 🚀**
