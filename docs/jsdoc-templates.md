# JSDoc Templates for Litekart Connector

This document provides standardized JSDoc templates to use when documenting services and methods in the Litekart Connector package.

## Service Class Documentation

```typescript
/**
 * ServiceName provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
```

## Method Documentation

### GET Method Template

```typescript
/**
 * Brief description of what the method does
 *
 * Additional details about the method functionality,
 * behavior, and any special considerations.
 *
 * @param {ParamType} paramName - Description of the parameter
 * @param {AnotherType} [optionalParam] - Description of the optional parameter
 * @returns {Promise<ReturnType>} Description of the return value
 * @api {get} /api/endpoint/{param} Description of the API endpoint
 *
 * @example
 * // Example showing how to use the method
 * const result = await service.methodName('paramValue');
 */
```

### POST Method Template

```typescript
/**
 * Brief description of what the method does
 *
 * Additional details about the method functionality,
 * behavior, and any special considerations.
 *
 * @param {ParamType} paramName - Description of the parameter
 * @param {RequestBodyType} data - The data to be sent in the request body
 * @returns {Promise<ReturnType>} Description of the return value
 * @api {post} /api/endpoint Create/update resource
 *
 * @example
 * // Example showing how to use the method
 * const data = { prop: 'value' };
 * const result = await service.methodName('paramValue', data);
 */
```

### DELETE Method Template

```typescript
/**
 * Brief description of what the method does
 *
 * Additional details about the method functionality,
 * behavior, and any special considerations.
 *
 * @param {string} id - The ID of the resource to delete
 * @returns {Promise<void|ResponseType>} Description of the return value
 * @api {delete} /api/endpoint/{id} Delete resource
 *
 * @example
 * // Example showing how to use the method
 * await service.deleteMethod('123');
 */
```

## Type Documentation

### Interface/Type Template

```typescript
/**
 * Brief description of what this interface/type represents
 * Additional context about when and how it's used
 *
 * @property {PropertyType} propertyName - Description of the property
 * @property {AnotherType} [optionalProp] - Description of the optional property
 * @property {SubType} nestedProperty - Description of a property with nested fields
 * @property {SubType} nestedProperty.subField - Description of a nested field
 */
```

## Examples from the Codebase

### SearchService Example

```typescript
/**
 * SearchService provides a high-level API for product search operations
 * by leveraging the underlying Meilisearch implementation.
 *
 * This service helps with:
 * - Converting URL search parameters into Meilisearch queries
 * - Processing and formatting search results into a consistent format
 * - Handling search-related errors with fallback values
 */
```

### Method Example

```typescript
/**
 * Performs a product search using URL search parameters
 *
 * This method parses URL search parameters and organizes them into different types
 * (standard, attribute-based, option-based, etc.) before executing the search.
 *
 * @param {URL} url - The URL containing search parameters in its query string
 * @param {string} [slug] - Optional category slug that overrides the one in URL params
 * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
 * @api {get} /api/ms/products Search products using URL parameters
 *
 * @example
 * // Search using a URL with multiple parameters
 * const searchUrl = new URL('https://example.com/search?search=shoes&categories=footwear&priceFrom=50&priceTo=200');
 * const results = await searchService.searchWithUrl(searchUrl);
 */
```

### Type Example

```typescript
/**
 * Structured product search results for UI consumption
 * This is a cleaned and normalized format of search results that's easier
 * to work with in frontend applications.
 *
 * @property {Product[]} data - Array of product objects matching the search
 * @property {number} count - Total number of matching products
 * @property {number} totalPages - Total number of pages available
 * @property {Record<string, any>[]} categoryHierarchy - Array of category objects showing hierarchy
 * @property {object} facets - Filter options derived from the result set
 * @property {object} facets.priceStat - Price range statistics
 * @property {number} [facets.priceStat.min] - Minimum price in result set
 * @property {number} [facets.priceStat.max] - Maximum price in result set
 * @property {Array<{name: string, count: number}>} facets.categories - Available category filters
 * @property {Array<{name: string, count: number}>} facets.tags - Available tag filters
 * @property {Record<string, Record<string, number>>} [facets.allFilters] - All available filters
 */
```
