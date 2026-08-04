# @misiki/vendure-connector

### Configuration required

1. In Litekart configuration, `isPhoneMandatory` and 
`isEmailMandatory` to be both false.
2. In Vendure, authOptions `requireVerification`

### Usages

1. Install package

```
npm install @misiki/vendure-connector
```

2. Edit `kitcommerce.config.ts`

```ts
export * as services from "@misiki/vendure-connector"
```
