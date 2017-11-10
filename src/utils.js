import { STORED_TOKEN } from './constants'
import { parseJwt } from 'lhc-js-lib'

/**
 * TTL jwt can be refreshed in seconds (2 weeks)
 *
 * @type {Integer}
 */
export const REFRESH_TTL = 1209600

/**
 * Get token from storage
 *
 * @return {String}
 */
export const getTokenFromStorage = () => {
  const shortToken = sessionStorage.getItem( STORED_TOKEN )
  let token = localStorage.getItem( STORED_TOKEN )
  if ( shortToken ) token = shortToken

  return token
}

/**
 * Determine if token can be refreshed
 * Issued at claim must be no older than refresh ttl
 *
 * @param  {String}  token
 * @return {Boolean}
 */
export const isTokenRefreshable = ( token ) => {
  const { iat } = parseJwt( token, 1 )
  const expiration = ( parseInt( iat ) + REFRESH_TTL ) * 1000
  const now = ( new Date ).getTime()

  return expiration > now
}
