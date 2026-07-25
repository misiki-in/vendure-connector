# Contributing to LiteKart Connector

Thank you for your interest in contributing to the LiteKart Connector! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Adding New Services](#adding-new-services)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

---

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:

- Be respectful and inclusive
- Constructive criticism welcome
- Focus on what's best for the community
- Show empathy towards others

---

## Getting Started

### Prerequisites

- **Node.js** 18+ recommended
- **npm** or **yarn** or **pnpm** or **bun**
- **TypeScript** knowledge
- Basic understanding of LiteKart API

### Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/litekart-connector.git
cd litekart-connector

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Run tests (if any)
npm test

# 5. Start development watch mode
npm run dev
```

### Project Structure

```
litekart-connector/
├── src/
│   ├── services/          # API service implementations
│   │   ├── base.service.ts     # Base HTTP service
│   │   ├── product-service.ts
│   │   ├── cart-service.ts
│   │   ├── auth-service.ts
│   │   ├── varni/              # Custom/Varni-specific services
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   │   ├── product-types.ts
│   │   ├── cart-types.ts
│   │   ├── user-types.ts
│   │   └── ...
│   └── index.ts           # Main entry point
├── scripts/               # Build and utility scripts
├── docs/                  # Additional documentation
├── dist/                  # Built output (generated)
├── DOCS.md                # Comprehensive API documentation
├── README.md              # Main documentation
├── CHANGELOG.md           # Version history
└── package.json          # Project manifest
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/issue-123
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Build/configuration changes

### 2. Make Changes

Follow the established patterns:
- Use singleton pattern for services
- Extend `BaseService`
- Add comprehensive JSDoc comments
- Define TypeScript interfaces
- Keep methods focused and small

### 3. Build and Test

```bash
# Build the project
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Format code with Biome
npm run format

# Lint code
npm run lint

# Run tests
npm test
```

### 4. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add bulk wishlist check method
fix: resolve cart ID storage issue
docs: update API reference
refactor: simplify checkout service
test: add unit tests for auth service
```

### 5. Push and Create PR

```bash
git push origin feature/amazing-feature
```

Then open a Pull Request on GitHub with:
- Clear description of changes
- Reference to related issues
- Screenshots if UI changes
- Updated documentation

---

## Coding Standards

### TypeScript

- **Strict mode** - No implicit `any` types
- **Type exports** - Export all types needed by consumers
- **Interface over type** - Prefer `interface` for object shapes
- **Null safety** - Use `?` for optional properties

### Services

All services must:

1. **Extend BaseService**
   ```typescript
   export class ProductService extends BaseService { ... }
   ```

2. **Use singleton pattern**
   ```typescript
   private static instance: ProductService
   static getInstance(): ProductService { ... }
   export const productService = ProductService.getInstance()
   ```

3. **Write JSDoc comments**
   ```typescript
   /**
    * Description of method
    *
    * @param {Object} params - Parameters
    * @param {string} params.id - The ID
    * @returns {Promise<Product>} The product
    * @api {get} /api/products/:id Endpoint reference
    *
    * @example
    * const product = await productService.getOne('slug')
    */
   async getOne(slug: string) { ... }
   ```

4. **Handle errors appropriately**
   ```typescript
   async getOne(slug: string) {
     return this.get<Product>(`/api/products/${slug}`)
   }
   // Errors bubble up from BaseService with proper formatting
   ```

### BaseService HTTP Methods

Available methods in `BaseService`:
- `this.get<T>(url)` - GET request
- `this.post<T>(url, data)` - POST request
- `this.put<T>(url, data)` - PUT request
- `this.patch<T>(url, data)` - PATCH request
- `this.delete<T>(url)` - DELETE request

All methods return typed promises and handle errors automatically.

---

## Adding New Services

### Step 1: Create Service File

```bash
# In src/services/
touch src/services/my-new-service.ts
```

### Step 2: Implement Service

```typescript
import type { MyEntity } from '../types'
import { BaseService } from './base.service'

/**
 * MyNewService provides functionality for ...
 *
 * This service helps with:
 * - Feature 1
 * - Feature 2
 */
export class MyNewService extends BaseService {
  private static instance: MyNewService

  static getInstance(): MyNewService {
    if (!MyNewService.instance) {
      MyNewService.instance = new MyNewService()
    }
    return MyNewService.instance
  }

  /**
   * Gets all items with pagination
   *
   * @param {Object} options - Options
   * @param {number} [options.page=1] - Page number
   * @returns {Promise<PaginatedResponse<MyEntity>>} Paginated results
   * @api {get} /api/my-endpoint
   *
   * @example
   * const items = await myNewService.list({ page: 1 })
   */
  async list({ page = 1 }: { page?: number }) {
    return this.get<PaginatedResponse<MyEntity>>(
      `/api/my-endpoint?page=${page}`
    )
  }

  /**
   * Gets item by ID
   *
   * @param {string} id - Item ID
   * @returns {Promise<MyEntity>} The item
   * @api {get} /api/my-endpoint/:id
   */
  async getOne(id: string) {
    return this.get<MyEntity>(`/api/my-endpoint/${id}`)
  }
}

export const myNewService = MyNewService.getInstance()
```

### Step 3: Add Types

```typescript
// In src/types/my-types.ts
export type MyEntity = {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}
```

### Step 4: Export from Index

```typescript
// In src/services/index.ts
export * from './my-new-service'

// In src/types/index.ts (if new types)
export * from './my-types'
```

### Step 5: Update Documentation

1. Add to `DOCS.md` API Reference section
2. Add example usage
3. Document all methods, parameters, return types
4. Include API endpoint references

### Step 6: Generate JSDoc Template

```bash
node scripts/generate-jsdoc.js
```

---

## Testing

### Unit Tests

Create tests in `__tests__` directory:

```
src/
├── services/
│   ├── __tests__/
│   │   ├── product-service.test.ts
│   │   ├── cart-service.test.ts
│   │   └── ...
```

Example test:

```typescript
import { productService } from '../product-service'
import { BaseService } from '../base.service'

// Mock fetch
global.fetch = jest.fn()

describe('ProductService', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should list products successfully', async () => {
    const mockResponse = {
      data: [{ id: '1', title: 'Test Product' }],
      count: 1,
      totalPages: 1,
      pageSize: 10,
      noOfPage: 1,
      page: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await productService.list({ page: 1 })

    expect(result.data).toHaveLength(1)
    expect(result.count).toBe(1)
  })

  it('should handle errors gracefully', async () => {
    const errorResponse = {
      message: 'Something went wrong',
      status: 500
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(errorResponse)
    })

    await expect(productService.list({})).rejects.toThrow('Something went wrong')
  })
})
```

### Run Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

---

## Submitting Changes

### Pull Request Checklist

- [ ] Code follows existing patterns
- [ ] JSDoc comments added for all public methods
- [ ] TypeScript types defined and exported
- [ ] Service added to `src/services/index.ts`
- [ ] Types added to `src/types/index.ts` (if needed)
- [ ] Documentation updated in `DOCS.md`
- [ ] README.md updated (if relevant)
- [ ] Tests added (if applicable)
- [ ] Build succeeds: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] Code formatted: `npm run format`

### PR Description Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] New feature (non-breaking change)
- [ ] Bug fix (non-breaking change)
- [ ] Breaking change (fix or feature)
- [ ] Documentation update

## What's Changed

- Added `myNewService` with methods X, Y, Z
- Updated `authService` to support OAuth
- Fixed cart calculation bug

## How to Test

```typescript
import { myNewService } from '@misiki/litekart-connector'

const result = await myNewService.newMethod({ ... })
console.log(result)
```

## Screenshots (if applicable)

[Add screenshots]

## Related Issues

Closes #123
Fixes #456

## Additional Notes

Any additional information?
```

---

## Release Process

Maintainers handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit and tag
4. Build: `npm run build`
5. Publish: `npm publish`
6. Create GitHub release with notes

---

## Questions?

- **Discord**: https://discord.gg/litekart
- **Email**: support@litekart.in
- **Issues**: https://github.com/misiki/litekart-connector/issues

---

Thank you for contributing! 🎉
