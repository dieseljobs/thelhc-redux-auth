import { parseJwt, setAndBroadcastSession, removeAndBroadcastSession } from 'lhc-js-lib'
import { STORED_TOKEN } from './constants'
import config from './config'

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
  if ( config.getTokenFromStorage && typeof config.getTokenFromStorage === 'function' ) {
    return config.getTokenFromStorage.call( null )
  }
  const shortToken = sessionStorage.getItem( STORED_TOKEN )
  let token = localStorage.getItem( STORED_TOKEN )
  if ( shortToken ) token = shortToken

  return token
}

/**
 * Store token in local storage 
 * 
 * @param  {String} token 
 * @return {void}       
 */
export const storeToken = ( token ) => {
  if ( config.setTokenToStorage && typeof config.setTokenToStorage === 'function' ) {
    return config.setTokenToStorage.call( null, token )
  }
  // set remember var, default to true in case claim is not present
  const claims = parseJwt( token, 1 )
  const rem = claims.hasOwnProperty( 'rem' ) ? claims.rem : true

  // sync token to localStorage if remembering
  if ( rem ) {
    // check and remove sessionStorage if present
    if ( sessionStorage.getItem( STORED_TOKEN ) ) {
      removeAndBroadcastSession( STORED_TOKEN )
    }
    // set token to localStorage
    localStorage.setItem( STORED_TOKEN, token )
  // else sync token to sessionStorage if not remembering
  } else {
    // set sessionStorage
    setAndBroadcastSession( STORED_TOKEN, token )
  }
}

/**
 * Remove stored token
 * 
 * @return {void}
 */
export const removeTokenFromStorage = () => {
  if ( config.removeTokenFromStorage && typeof config.removeTokenFromStorage === 'function' ) {
    return config.removeTokenFromStorage.call( null )
  }
  // remove sessionStorage if present
  if ( sessionStorage.getItem( STORED_TOKEN ) ) {
    removeAndBroadcastSession( STORED_TOKEN )
  }
  // remove localStorage if present
  if ( localStorage.getItem( STORED_TOKEN ) ) {
    localStorage.removeItem( STORED_TOKEN )
  }
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
