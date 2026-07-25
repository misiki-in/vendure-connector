# Search & Discovery Guide

Complete guide to implementing search with LiteKart's Meilisearch integration.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Search API](#search-api)
4. [URL-Based Search](#url-based-search)
5. [Search Parameters](#search-parameters)
6. [Faceted Search](#faceted-search)
7. [Autocomplete](#autocomplete)
8. [Advanced Filtering](#advanced-filtering)
9. [Search UI Patterns](#search-ui-patterns)
10. [Performance Optimization](#performance-optimization)
11. [Relevance Tuning](#relevance-tuning)
12. [Troubleshooting](#troubleshooting)

---

## Overview

LiteKart uses **Meilisearch** for instant, typo-tolerant product search. The connector provides two main search services:

### `searchService` - High-Level API
Converts URL parameters, formats results, handles errors gracefully.

```typescript
import { searchService } from '@misiki/litekart-connector'

const results = await searchService.searchWithQuery('red shoes')
```

### `meilisearchService` - Low-Level API
Direct Meilisearch access for advanced use cases.

```typescript
import { meilisearchService } from '@misiki/litekart-connector'

const results = await meilisearchService.search({
  query: 'shoes',
  categories: 'footwear',
  price: '100,500'
})
```

---

## Getting Started

### Prerequisites

1. **Meilisearch running** (separate from LiteKart)

```bash
# Install Meilisearch
# Docker (recommended)
docker run -it --rm \
  -p 7700:7700 \
  -v $(pwd)/data.ms:/data.ms \
  getmeili/meilisearch:v1.7

# Or download from https://www.meilisearch.com/download
```

2. **Configure LiteKart**

In your LiteKart admin panel:
- Go to Settings → Search
- Set Meilisearch host: `http://localhost:7700`
- Set API key (if configured)
- Test connection
- Index existing products

3. **Sync Data**

Meilisearch needs a product index. This is handled by LiteKart admin:
```bash
# From LiteKart backend
npm run sync:search
# or trigger via admin panel → Settings → Search → Sync Now
```

---

## Search API

### `searchService.searchWithQuery(query)`

Simple text search.

```typescript
const results = await searchService.searchWithQuery('nike running shoes')

console.log(results)
// {
//   data: Product[],       // Array of matching products
//   count: 150,            // Total matches
//   totalPages: 8,         // Total pages
//   categoryHierarchy: [...], // Categories in results
//   facets: {
//     priceStat: { min: 50, max: 500 },
//     categories: [{ name: 'footwear', count: 75 }],
//     tags: [{ name: 'new-arrival', count: 20 }]
//   }
// }
```

### `searchService.searchWithUrl(url, slug?)`

Parse search from URL parameters.

```typescript
const url = new URL('https://store.com/search')
url.searchParams.set('search', 'shoes')
url.searchParams.set('priceFrom', '100')
url.searchParams.set('priceTo', '500')
url.searchParams.set('categories', 'footwear')

const results = await searchService.searchWithUrl(url)
```

---

## Search Parameters

### Standard Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `search` | Text query | `search=nike+shoes` |
| `page` | Page number (1-based) | `page=2` |
| `sort` | Sort order | `sort=price:asc` or `-createdAt` |
| `categories` | Category slug filter | `categories=footwear` |
| `tags` | Comma-separated tags | `tags=new,sale` |
| `priceFrom` / `priceTo` | Price range | `priceFrom=100&priceTo=500` |
| `keywords` | Additional keywords | `keywords=comfortable+running` |
| `originCountry` | Country of origin | `originCountry=US` |

### Dynamic Parameters

**Product Attributes** (filter by custom attributes):
```
attributes.color=red
attributes.size=M
attributes.brand=nike
```

**Product Options** (filter by variant options):
```
option.size=42
option.material=leather
```

---

## Faceted Search

Facets provide filter options based on current result set.

### Facet Structure

```typescript
interface SearchResultFacets {
  priceStat: {
    min?: number
    max?: number
  }
  categories: Array<{
    name: string
    count: number
  }>
  tags: Array<{
    name: string
    count: number
  }>
  allFilters?: Record<string, Record<string, number>>
}
```

### Using Facets for Filter UI

```typescript
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    searchService.searchWithUrl(url).then(setResults)
  }, [searchParams])

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(searchParams)

    // Toggle filter
    if (value) {
      // Add or remove from comma-separated list
      const current = params.get(filterType)?.split(',') || []
      if (current.includes(value)) {
        params.set(filterType, current.filter(v => v !== value).join(','))
      } else {
        params.append(filterType, value)
      }
    }

    window.history.pushState({}, '', `?${params.toString()}`)
    // Re-fetch results
  }

  return (
    <div className="search-page">
      {/* Filters Sidebar */}
      <aside>
        {/* Price Range */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <input
            type="range"
            min={results?.facets.priceStat.min || 0}
            max={results?.facets.priceStat.max || 1000}
            onChange={(e) => handleFilterChange('priceTo', e.target.value)}
          />
          <span>
            {searchParams.get('priceFrom') || 0} - {searchParams.get('priceTo') || 'Max'}
          </span>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <h4>Categories</h4>
          {results?.facets.categories.map(cat => (
            <label key={cat.name}>
              <input
                type="checkbox"
                checked={searchParams.get('categories')?.includes(cat.name)}
                onChange={() => handleFilterChange('categories', cat.name)}
              />
              {cat.name} ({cat.count})
            </label>
          ))}
        </div>

        {/* Tags */}
        <div className="filter-section">
          <h4>Tags</h4>
          {results?.facets.tags.map(tag => (
            <label key={tag.name}>
              <input
                type="checkbox"
                checked={searchParams.get('tags')?.split(',').includes(tag.name)}
                onChange={() => handleFilterChange('tags', tag.name)}
              />
              {tag.name} ({tag.count})
            </label>
          ))}
        </div>

        {/* Dynamic Filters */}
        {results?.facets.allFilters && (
          Object.entries(results.facets.allFilters).map(([filterName, values]) => (
            <div key={filterName} className="filter-section">
              <h4>{formatFilterName(filterName)}</h4>
              {Object.entries(values).map(([value, count]) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    // Handle attribute/option filters
                    onChange={() => handleFilterChange(filterName, value)}
                  />
                  {value} ({count})
                </label>
              ))}
            </div>
          ))
        )}
      </aside>

      {/* Results */}
      <main>
        <h1>{results.count} Products Found</h1>

        <div className="product-grid">
          {results.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}
```

---

## URL-Based Search Pattern

This is the recommended approach for search pages because:

✅ **Works with browser history** - URL updates are bookmarkable
✅ **SEO friendly** - Search parameters in URL
✅ **Shareable** - Users can copy/paste search URLs
✅ **Server-side rendering** - Can search on initial page load

### Implementation

```typescript
// pages/search.tsx (Next.js example)
import { useSearchParams, useRouter } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Build search URL
  const buildSearchUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    return `/search?${params.toString()}`
  }

  // Handle filter changes without full page reload
  const updateFilter = (filter, value) => {
    router.push(buildSearchUrl({ [filter]: value }), {
      scroll: false  // Don't scroll to top
    })
  }

  // The actual search is handled by searchService
  // via searchWithUrl in a useEffect or server component
}
```

---

## Advanced Filtering

### Multi-Value Filters

Categories and tags support comma-separated values for AND/OR logic:

```typescript
// OR: products tagged with 'sale' OR 'new-arrival'
?tags=sale,new-arrival

// AND: products in 'footwear' AND 'running'
?categories=footwear,running
```

### Price Range Filtering

```typescript
// Build price range
const params = new URLSearchParams()
params.set('priceFrom', '100')
params.set('priceTo', '500')

const url = `/search?${params.toString()}`
// /search?priceFrom=100&priceTo=500
```

### Attribute-Based Filtering

Product attributes defined in LiteKart admin are filterable:

```typescript
// User selects color=red, size=M
const params = new URLSearchParams()
params.set('attributes.color', 'red')
params.set('attributes.size', 'M')
params.set('attributes.brand', 'nike')

const results = await searchService.searchWithUrl(
  new URL(`/search?${params.toString()}`)
)
```

---

## Sorting Results

Supported sort formats:

1. **Field-based**:
   ```
   sort=price        // Ascending price
   sort=-price       // Descending price (- for desc)
   sort=createdAt    // Oldest first
   sort=-createdAt   // Newest first
   sort=popularity   // Most popular
   ```

2. **Multiple sorts** (comma-separated):
   ```
   sort=price,-popularity  // Price asc, then popularity desc
   ```

UI Implementation:

```typescript
<select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
  <option value="">Default</option>
  <option value="price">Price: Low to High</option>
  <option value="-price">Price: High to Low</option>
  <option value="-createdAt">Newest First</option>
  <option value="popularity">Most Popular</option>
  <option value="rating">Highest Rated</option>
</select>
```

---

## Search Performance

### Caching Strategies

```typescript
// 1. Client-side caching with React Query
import { useQuery } from '@tanstack/react-query'

function useSearch(params) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchService.searchWithUrl(buildUrl(params)),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  })
}

// 2. Debounce search input
import { debounce } from 'lodash'

const debouncedSearch = useCallback(
  debounce((query) => {
    router.push(`/search?search=${encodeURIComponent(query)}`)
  }, 300),
  []
)

// 3. Preload popular searches
const popularSearches = ['nike', 'air jordan', 'running shoes', 'sneakers']
```

### Server-Side Rendering

```typescript
// pages/search.tsx - Server component
export default async function SearchPage({ searchParams }) {
  // Direct await in server component
  const url = new URL(`${process.env.NEXT_PUBLIC_URL}/search`)
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  const results = await searchService.searchWithUrl(url)

  return (
    <div>
      {/* Server-rendered results */}
      {results.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## Search Relevance Tuning

### Meilisearch Settings

```typescript
// Configure Meilisearch from your backend/Meilisearch dashboard

const settings = {
  // Typo tolerance
  typosEnabled: true,
  minWordSizeForTypos: {
    oneTypo: 5,
    twoTypos: 9
  },

  // Ranking rules (order matters)
  rankingRules: [
    'words',
    'proximity',
    'attribute',
    'wordsPosition',
    'exactness',
    'desc(price)',  // Price-based ranking
    'desc(popularity)' // Popularity boost
  ],

  // Searchable attributes
  searchableAttributes: [
    'title',
    'description',
    'keywords',
    'brand',
    'sku'
  ],

  // Filterable attributes (for facets)
  filterableAttributes: [
    'categories.slug',
    'tags.name',
    'price',
    'stock',
    'brand',
    'originCountry',
    'attributes.*'  // All custom attributes
  ],

  // Displayed attributes
  displayedAttributes: [
    'id',
    'title',
    'slug',
    'description',
    'price',
    'mrp',
    'images',
    'stock',
    'rating',
    'popularity'
  ]
}
```

### Boosting Relevance

```javascript
// In your LiteKart backend (Node.js)

// Sync products with boosted fields
const productDocs = products.map(product => ({
  id: product.id,
  title: product.title,
  description: product.description,
  // Boost specific fields
  _geo: product.location ? { lat, lng } : undefined,
  // Custom ranking
  price: product.price,
  popularity: product.views * 0.3 + product.sales * 0.7,
  // Categories as array
  categories: product.categories.map(c => c.slug),
  // Tags as array
  tags: product.tags.map(t => t.name)
}))
```

---

## Autocomplete

### Basic Autocomplete

```typescript
import { meilisearchService } from '@misiki/litekart-connector'

async function getSuggestions(query) {
  if (!query || query.length < 2) {
    return []
  }

  const results = await meilisearchService.searchAutoComplete({
    query
  })

  return results.hits.slice(0, 10).map(hit => ({
    id: hit.id,
    title: hit.title,
    slug: hit.slug,
    thumbnail: hit.thumbnail,
    type: 'product'
  }))
}

// Debounced input component
function SearchInput() {
  const [suggestions, setSuggestions] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await getSuggestions(query)
        setSuggestions(results)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map(s => (
            <a
              key={s.id}
              href={`/product/${s.slug}`}
              className="suggestion-item"
            >
              <img src={s.thumbnail} alt="" />
              <span>{s.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Category Search

### Search Within Category

```typescript
// Option 1: Use category parameter
const productsInCategory = await searchService.searchWithUrl(
  new URL(`/search?categories=footwear&search=nike`)
)

// Option 2: Pass slug to searchWithUrl
const products = await searchService.searchWithUrl(
  new URL(`/search?search=nike`),
  'footwear'  // Override categories param
)

// Option 3: Direct Meilisearch
const results = await meilisearchService.search({
  query: 'nike',
  categories: 'footwear',
  page: 1
})
```

---

## Handling No Results

```typescript
async function smartSearch(query) {
  const results = await searchService.searchWithQuery(query)

  if (results.data.length === 0) {
    // Try less restrictive search
    const relaxedResults = await searchService.searchWithQuery(
      query.split(' ').slice(0, 2).join(' ')  // Remove some terms
    )

    if (relaxedResults.data.length > 0) {
      return {
        ...relaxedResults,
        notice: 'No exact matches found. Showing similar products.'
      }
    }

    // Try fuzzy search by removing typos (handled by Meilisearch automatically)
  }

  return results
}
```

---

## Search Analytics

```typescript
// Track popular searches
import { popularityService } from '@misiki/litekart-connector'

async function trackSearch(query, resultCount, userId) {
  await popularityService.trackSearch({
    query,
    resultCount,
    userId,
    timestamp: new Date().toISOString()
  })
}

// Track product views from search
const trackProductClick = async (productId, position, query) => {
  await fetch('/api/analytics/click', {
    method: 'POST',
    body: JSON.stringify({
      productId,
      position,
      source: 'search',
      query,
      sessionId: getSessionId()
    })
  })
}
```

---

## Multi-Search (Batch Queries)

```typescript
// Search multiple queries at once
async function multiSearch(queries) {
  // Use meilisearchService directly for multiple queries
  const promises = queries.map(q =>
    meilisearchService.search({ query: q })
  )

  const results = await Promise.all(promises)

  return queries.reduce((acc, query, idx) => {
    acc[query] = results[idx]
    return acc
  }, {})
}

// Usage: Get search terms for "shoes", "boots", "sandals" simultaneously
const searchResults = await multiSearch(['shoes', 'boots', 'sandals'])
```

---

## Security Considerations

### Prevent Injection

Meilisearch handles this, but still:

```typescript
const sanitizeQuery = (query: string): string => {
  // Remove potential script tags
  return query.replace(/<[^>]*>?/gm, '').trim()
}

const safeSearch = await searchService.searchWithQuery(sanitizeQuery(userInput))
```

### Rate Limiting

```typescript
// Implement on your API layer
const rateLimitSearch = async (userId, query) => {
  const cacheKey = `search:${userId}:${sanitizeQuery(query)}`
  const lastSearch = await redis.get(cacheKey)

  if (lastSearch && Date.now() - parseInt(lastSearch) < 1000) {
    throw new Error('Search too frequent')
  }

  await redis.setex(cacheKey, 60, Date.now().toString())
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Meilisearch connection refused" | Start Meilisearch server |
| No results returned | Verify product index exists |
| Slow searches | Check Meilisearch settings, increase resources |
| Facets not working | Ensure filterable attributes are set |
| Typos not matching | Check `typosEnabled` in settings |

### Debug Mode

```typescript
// Enable debug logging
const debugSearch = async (query, params) => {
  const start = Date.now()

  const results = await meilisearchService.search({
    query,
    ...params
  })

  console.log('Search took:', Date.now() - start, 'ms')
  console.log('Query:', query)
  console.log('Params:', params)
  console.log('Results:', results.totalHits, 'hits')

  return results
}
```

### Verify Connection

```typescript
async function testMeilisearch() {
  try {
    const health = await fetch('http://localhost:7700/health')
    console.log('Meilisearch health:', await health.json())

    const indexes = await fetch('http://localhost:7700/indexes')
    console.log('Indexes:', await indexes.json())
  } catch (error) {
    console.error('Meilisearch not accessible:', error)
  }
}
```

---

## Next Steps

- See **[API_REFERENCE.md](./API_REFERENCE.md)** for all search methods
- Review **[EXAMPLES.md](./EXAMPLES.md)** for search UI examples
- Check **[TYPES_REFERENCE.md](./TYPES_REFERENCE.md)** for search result types
- Read **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** for search error patterns
