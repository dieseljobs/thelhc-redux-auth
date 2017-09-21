import pathToRegexp from 'path-to-regexp'
import {
  STORED_TOKEN,
  STORED_USER
} from './constants'
import { jwtToStore, jwtRejected, setToken } from './actions'

/**
 * Create interceptors for http service and provided store
 *
 * @param  {Function} dispatch    from store
 * @param  {Function} getState    from store
 * @param  {Object} [config={}]
 * @return {void}
 */
const createInterceptors = ( client, { dispatch, getState }, appConfig = {} ) => {

  /**
   * Expected authorization/token error responses
   * @type {Array}
   */
  const AUTH_ERROR_RESPONSES = [
    'token_not_provided',
    //'user_not_found',
    'token_absent',
    'token_expired',
    'token_blacklisted',
    'token_invalid'
  ]

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


  client.interceptors.request.use( ( config ) => {
    const shortToken = sessionStorage.getItem( STORED_TOKEN )
    let token = localStorage.getItem( STORED_TOKEN )
    if ( shortToken ) token = shortToken

    // Set Authorization header with token
    if ( token ) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  }, ( error ) => {
    // Do something with request error

    return Promise.reject( error )
  })

  client.interceptors.response.use( ( response ) => {
      // Look for token in response body
      if ( response.data && response.data.token ) {
        const { data: { token } } = response
        dispatch( jwtToStore( token ) )
      // Else look for refreshed auth token in headers
      } else if ( response.headers && response.headers.authorization ) {
        const token = response.headers.authorization.replace( /Bearer\s/, '' )
        dispatch( jwtToStore( token ) )
      }

      return response
    }, ( error ) => {
    // Do something with response error if authentication error
    if ( isBadTokenResponse( error.response ) ) {
      const { onSessionReject, afterSessionReject } = appConfig
      // always tear down token
      dispatch( setToken( '' ) )
      if ( onSessionReject ) {
        dispatch( onSessionReject() )
      } else {
        dispatch( jwtRejected( afterSessionReject ) )
      }
    }

    return Promise.reject( error )
  })
}

export default createInterceptors
