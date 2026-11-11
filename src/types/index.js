// Type definitions as JSDoc comments

/**
 * @typedef {string} ModuleCategory
 */

/**
 * @typedef {Object} DatabaseTableSpec
 * @property {string} name
 * @property {string} description
 * @property {string} primaryKey
 * @property {Array<{column: string, references: string, table: string}>} foreignKeys
 * @property {Array<{name: string, type: string, nullable?: boolean, index?: boolean}>} columns
 * @property {string[]} indexes
 */

/**
 * @typedef {DatabaseTableSpec} DatabaseTable
 */

/**
 * @typedef {Object} ApiEndpointSpec
 * @property {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method
 * @property {string} path
 * @property {string} description
 * @property {string} [permission]
 * @property {boolean} authRequired
 * @property {Object} [sampleRequest]
 * @property {Object} [sampleResponse]
 */

/**
 * @typedef {ApiEndpointSpec} ApiEndpoint
 */

/**
 * @typedef {Object} CodeTemplates
 * @property {string} controller
 * @property {string} model
 * @property {string} service
 * @property {string} formRequest
 * @property {string} migration
 * @property {string} policy
 * @property {string} [reactComponent]
 * @property {string} [reactHook]
 * @property {string} [reactStyles]
 */

/**
 * @typedef {Object} BusinessModule
 * @property {number} id
 * @property {string} code
 * @property {string} name
 * @property {string} slug
 * @property {string} category
 * @property {number} phase
 * @property {string} iconName
 * @property {string} purpose
 * @property {string[]} responsibilities
 * @property {DatabaseTableSpec[]} databaseTables
 * @property {ApiEndpointSpec[]} apiEndpoints
 * @property {string[]} services
 * @property {string[]} permissions
 * @property {string[]} events
 * @property {string[]} jobs
 * @property {number[]} dependencies
 * @property {string[]} tests
 * @property {CodeTemplates} codeTemplates
 * @property {Array<Object>} sampleRecords
 * @property {'Ready' | 'Configured' | 'Active'} status
 */

/**
 * @typedef {Object} SystemStats
 * @property {number} totalModules
 * @property {number} totalTables
 * @property {number} totalEndpoints
 * @property {number} totalServices
 * @property {number} activeTenants
 * @property {'Healthy' | 'Degraded' | 'Critical'} systemHealth
 */
