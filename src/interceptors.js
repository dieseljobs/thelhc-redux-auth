import axios from 'axios'
import pathToRegexp from 'path-to-regexp'
import {
  USER_TOKEN,
  STORED_USER
} from './constants'
import { resetAuth, setToken } from './actions'

/**
 * Create interceptors for http service and provided store
 *
 * @param  {Function} dispatch    from store
 * @param  {Function} getState    from store
 * @param  {Object} [config={}]
 * @return {void}
 */
const createInterceptors = ( { dispatch, getState }, config = {} ) => {

  /**
   * Expected authorization/token error responses
   * @type {Array}
   */
  const AUTH_ERROR_RESPONSES = [
    'token_not_provided',
    'user_not_found',
    'token_absent',
    'token_expired',
    'token_blacklisted',
    'token_invalid'
  ]

  /**
   * Check if a url matches the spoofBlacklist (if configured)
   *
   * @param  {String}  url
   * @return {Boolean}
   */
  const isUrlSpoofBlacklisted = ( url ) => {
    const { spoofBlacklist } = config
    if ( ! spoofBlacklist ) return false
    for ( const path of spoofBlacklist ) {
      let re = pathToRegexp( path )
      if ( re.test(url) ) return true
    }

    return false
  }

  /**
   * Check if response meets criteria of a rejected/invalid token request response
   *
   * @param  {Object}  response
   * @return {Boolean}
   */
  const isBadTokenResponse = ( response ) => {
    const { status, data } = response
    // if status is not 400 or 403 return false
    if ( [ 400, 403 ].indexOf( status ) === -1 )
      return false
    // if response data is not an array, return false
    if ( Object.prototype.toString.call( data ) !== '[object Array]' )
      return false
    // check if response matches any expected bad token responses
    for ( const _err in data ) {
      if ( AUTH_ERROR_RESPONSES.indexOf( data[_err] ) > -1 ) {
        return true
      }
    }

    return false
  }


  axios.interceptors.request.use( ( config ) => {
    const { url } = config
    const { auth: { spoofUser } } = getState()
    let token
    // Pass token if available
    // First check for user spoofing and pass the associated token
    // Otherwise look for stored token in localStorage
    if ( spoofUser && ! isUrlSpoofBlacklisted( url ) ) {
      token = spoofUser.token
    } else {
      token = localStorage.getItem( USER_TOKEN )
    }
    // Set Authorization header with token
    if ( token ) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  }, ( error ) => {
    // Do something with request error

    return Promise.reject( error )
  })

  axios.interceptors.response.use( ( response ) => {
    // Do something with response data
    // Look for refreshed auth token
    if ( response.headers && response.headers.authorization ) {
      let newToken = response.headers.authorization.replace( /Bearer\s/, '' )
      dispatch( setToken( newToken ) )
    }

    return response
  }, ( error ) => {
    // Do something with response error if authentication error
    if ( isBadTokenResponse( error.response ) ) {
      // if user is stored, we need to send expire flag to notify user
      const storedUser = sessionStorage.getItem( STORED_USER )
      const shouldExpire = Boolean( storedUser )
      dispatch( resetAuth( shouldExpire ) )
    }

    return Promise.reject( error )
  })
}

export default createInterceptors
