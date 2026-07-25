#!/usr/bin/env node

/**
 * This script generates JSDoc templates for service files
 *
 * Usage:
 * node scripts/generate-jsdoc.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name using import.meta.url (ES modules replacement for __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to services directory
const SERVICES_DIR = path.join(__dirname, '../src/services')

// Template for service class JSDoc
const SERVICE_TEMPLATE = (serviceName, serviceDescription) => `/**
 * ${serviceName} provides functionality for ${
  serviceDescription || 'interacting with the Litekart API'
}
 *
 * This service helps with:
 * - Retrieving and managing ${serviceName
   .replace('Service', '')
   .toLowerCase()} data
 * - Performing operations related to ${serviceName
   .replace('Service', '')
   .toLowerCase()}
 * - Interacting with the corresponding API endpoints
 */`

// Template for getInstance method JSDoc
const GET_INSTANCE_TEMPLATE = (serviceName) => `/**
 * Get the singleton instance
 * 
 * @returns {${serviceName}} The singleton instance of ${serviceName}
 */`

// Template for GET method JSDoc
const GET_METHOD_TEMPLATE = (methodName, resourceName, description = '') => `/**
 * ${description || `Fetches ${resourceName || 'data'} from the API`}
 * 
 * @param {Object} options - The request options
 * @param {number} [options.page=1] - The page number for pagination
 * @param {string} [options.q=''] - Search query string
 * @param {string} [options.sort='-createdAt'] - Sort order
 * @returns {Promise<any>} The requested data
 * @api {get} /api/${resourceName.toLowerCase()} Get ${resourceName.toLowerCase()}
 * 
 * @example
 * // Example usage
 * const result = await ${resourceName.toLowerCase()}Service.${methodName}({ page: 1 });
 */`

// Template for GET by ID method JSDoc
const GET_BY_ID_METHOD_TEMPLATE = (
  methodName,
  resourceName,
  description = ''
) => `/**
 * ${description || `Fetches a single ${resourceName || 'resource'} by ID`}
 * 
 * @param {string} id - The ID of the ${resourceName.toLowerCase()} to fetch
 * @returns {Promise<any>} The requested ${resourceName.toLowerCase()}
 * @api {get} /api/${resourceName.toLowerCase()}/:id Get ${resourceName.toLowerCase()} by ID
 * 
 * @example
 * // Example usage
 * const ${resourceName.toLowerCase()} = await ${resourceName.toLowerCase()}Service.${methodName}('123');
 */`

// Template for POST method JSDoc
const POST_METHOD_TEMPLATE = (
  methodName,
  resourceName,
  description = ''
) => `/**
 * ${description || `Creates a new ${resourceName || 'resource'}`}
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created ${resourceName.toLowerCase()}
 * @api {post} /api/${resourceName.toLowerCase()} Create ${resourceName.toLowerCase()}
 * 
 * @example
 * // Example usage
 * const new${resourceName} = await ${resourceName.toLowerCase()}Service.${methodName}({ 
 *   // required fields
 * });
 */`

// Function to read service files
function getServiceFiles() {
  const files = fs.readdirSync(SERVICES_DIR)
  return files
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => path.join(SERVICES_DIR, file))
}

// Function to extract class name from file content
function extractClassName(content) {
  const match = content.match(/export\s+class\s+(\w+)\s+extends\s+BaseService/)
  return match ? match[1] : null
}

// Function to extract methods from file content
function extractMethods(content) {
  // Regular expression to match methods
  const methodRegex = /async\s+(\w+)\s*\(/g
  const methods = []
  let match

  while ((match = methodRegex.exec(content)) !== null) {
    methods.push(match[1])
  }

  return methods
}

// Function to check if a method has JSDoc documentation
function hasMethodJSDoc(content, methodName) {
  const regex = new RegExp(
    `\\/\\*\\*[\\s\\S]*?\\*\\/\\s*async\\s+${methodName}\\s*\\(`
  )
  return regex.test(content)
}

// Function to add JSDoc to a service file
function addJSDocToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    const fileName = path.basename(filePath, '.ts')

    // Skip base.service.ts, search-service.ts, product-service.ts, meilisearch-service.ts, address-service.ts
    if (
      fileName === 'base.service' ||
      fileName === 'search-service' ||
      fileName === 'product-service' ||
      fileName === 'meilisearch-service' ||
      fileName === 'address-service' ||
      fileName === 'wishlist-service' ||
      fileName === 'auth-service'
    ) {
      console.log(
        `Skipping ${fileName} - already has comprehensive documentation`
      )
      return
    }

    const className = extractClassName(content)
    if (!className) {
      console.log(`Could not find class in ${fileName}`)
      return
    }

    const resourceName = className.replace('Service', '')

    // Update the service class JSDoc if needed
    if (!content.includes('This service helps with:')) {
      const serviceDescription = `managing ${resourceName.toLowerCase()} data in the Litekart platform`
      const serviceJSDoc = SERVICE_TEMPLATE(className, serviceDescription)
      content = content.replace(
        /\/\*\*[\s\S]*?\*\/\s*export\s+class\s+\w+\s+extends\s+BaseService|export\s+class\s+\w+\s+extends\s+BaseService/,
        `${serviceJSDoc}\nexport class ${className} extends BaseService`
      )
    }

    // Fix getInstance method JSDoc if it's duplicated or missing
    if (
      content.includes('/**\n   * Get the singleton instance\n   */\n  /**')
    ) {
      // Remove the duplicate JSDoc
      content = content.replace(
        /\/\*\*\s*\n\s*\*\s*Get\s*the\s*singleton\s*instance\s*\n\s*\*\/\s*\n\s*\/\*\*/,
        '/**'
      )
    } else if (!content.includes('@returns {' + className + '}')) {
      // Add getInstance method JSDoc
      const getInstanceJSDoc = GET_INSTANCE_TEMPLATE(className)
      content = content.replace(
        /(\s+)static\s+getInstance\(\):\s*\w+/,
        `$1${getInstanceJSDoc}$1static getInstance(): ${className}`
      )
    }

    // Add method JSDoc for each method
    const methods = extractMethods(content)
    for (const method of methods) {
      if (hasMethodJSDoc(content, method)) {
        continue // Skip if method already has JSDoc
      }

      let methodJSDoc = ''
      if (
        method.startsWith('list') ||
        (method.startsWith('fetch') && !method.match(/fetch[A-Z]/))
      ) {
        // List method
        methodJSDoc = GET_METHOD_TEMPLATE(method, resourceName)
      } else if (method.startsWith('get') || method.match(/fetch[A-Z]/)) {
        // Get by ID method
        methodJSDoc = GET_BY_ID_METHOD_TEMPLATE(method, resourceName)
      } else if (
        method.startsWith('save') ||
        method.startsWith('create') ||
        method.startsWith('add')
      ) {
        // Create method
        methodJSDoc = POST_METHOD_TEMPLATE(method, resourceName)
      } else {
        // Skip methods we can't easily categorize
        continue
      }

      content = content.replace(
        new RegExp(`(\\s+)async\\s+${method}\\s*\\(`),
        `$1${methodJSDoc}$1async ${method}(`
      )
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Added JSDoc to ${fileName}`)
  } catch (error) {
    console.error(`Error processing ${path.basename(filePath)}:`, error.message)
  }
}

// Main function
function main() {
  const serviceFiles = getServiceFiles()
  console.log(`Found ${serviceFiles.length} service files to process`)

  for (const filePath of serviceFiles) {
    addJSDocToFile(filePath)
  }

  console.log(
    'Done! All service files have been updated with JSDoc documentation.'
  )
}

main()
