# @misiki/vendure-connector

Vendure API connector for Litekart.

### Required configuration

1. In the Litekart configuration, set both `isPhoneMandatory` and `isEmailMandatory` to `false`.
2. In Vendure, set `authOptions.requireVerification` to `false` (signup registers the customer with a password and logs in immediately, which fails if email verification is required).

### Usage

1. Install the package

```
npm install @misiki/vendure-connector
```

2. Edit `kitcommerce.config.ts`

```ts
export * as services from "@misiki/vendure-connector"
```
