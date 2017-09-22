/**
 * Key name for stored token
 * @type {String}
 */
export const STORED_TOKEN = '@@token'

/**
 * Expected token error responses
 * @type {Array}
 */
export const TOKEN_ERROR_RESPONSES = [
  'token_not_provided',
  'token_absent',
  'token_expired',
  'token_blacklisted',
  'token_invalid'
]

/**
 * Expected token error responses for bad user
 * @type {Array}
 */
export const USER_ERROR_RESPONSES = [
  'user_not_found'
]
