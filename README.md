# @misiki/vendure-connector

[![NPM Version](https://img.shields.io/npm/v/@misiki/vendure-connector.svg)](https://www.npmjs.com/package/@misiki/vendure-connector)
[![License](https://img.shields.io/npm/l/@misiki/vendure-connector.svg)](https://github.com/misiki/vendure-connector/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The Official TypeScript API Connector for connecting `svelte-commerce` to Vendure E-Commerce Backend.**

`@misiki/vendure-connector` provides a production-ready, fully-typed API client and integration layer that seamlessly bridges [svelte-commerce](https://github.com/misiki/svelte-commerce) storefronts with [Vendure](https://www.vendure.io/) headless e-commerce backends.

---

## 🚀 Step-by-Step Integration Guide

Follow these steps to connect `svelte-commerce` with `vendure-connector` and your Vendure backend.

### 1. Install the Connector

Inside your `svelte-commerce` project directory, run:

```bash
bun i @misiki/vendure-connector
```

*(Or using npm / pnpm / yarn):*
```bash
npm install @misiki/vendure-connector
# or
pnpm add @misiki/vendure-connector
```

### 2. Configure `kitcommerce.config.ts`

In `svelte-commerce`, open `kitcommerce.config.ts` and change the `export *` line to import from `@misiki/vendure-connector`:

```typescript
// kitcommerce.config.ts
export * from '@misiki/vendure-connector';
```

### 3. Environment Variables Setup

Add the required environment variable in your `svelte-commerce` `.env` file:

```env
PUBLIC_VENDURE_API_URL=http://localhost:3000
```

The connector calls Vendure's Shop API at `<PUBLIC_VENDURE_API_URL>/shop-api`, so set this to your Vendure server root (without the `/shop-api` suffix).

### 4. Obtaining Environment Settings & Configuring Vendure

To get the necessary API configurations and properly configure your Vendure backend:

1. **Log into Vendure Admin**:
   - Access your Vendure Admin UI (e.g. `http://localhost:3000/admin` or your deployed Vendure Admin).
2. **Verify & Copy Vendure API Endpoint**:
   - Obtain your Vendure server URL (e.g. `http://localhost:3000`).
   - Set this URL as the value for `PUBLIC_VENDURE_API_URL` in your `.env` file.
3. **Configure Required Settings**:
   - **Email Verification**: In your Vendure config, set `authOptions.requireVerification` to `false` (signup registers the customer with a password and logs in immediately, which fails if email verification is required).

### 5. Build and Run the Project

Run the development server in `svelte-commerce`:

```bash
bun dev
```

To build and run the production application:

```bash
# Build the project
bun run build

# Preview the built application
bun run preview
```
