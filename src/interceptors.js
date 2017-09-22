import { STORED_TOKEN, TOKEN_ERROR_RESPONSES, USER_ERROR_RESPONSES } from './constants'
import { jwtToStore, jwtRejected, setToken } from './actions'

/**
 * Check if response is rejected by API
 * Will be 400 or 403 response with object/array response data
 *
 * @param  {Object}  response
 * @return {Boolean}
 */
export const isResponseRejected = ( response ) => {
  const { status, data } = response

  return (
    [ 400, 403 ].indexOf( status ) > -1 &&
    Object.prototype.toString.call( data ) === '[object Array]'
  )
}

/**
 * Determine if error response is token rejection
 *
 * @param  {Object}  response
 * @return {Boolean}
 */
export const isTokenRejected = ( response ) => {
  const { data } = response
  // check that response matches rejected criteria
  if ( !isResponseRejected ) {
    return false
  }

  // check if response matches any expected bad token responses
  for ( const _err in data ) {
    if ( TOKEN_ERROR_RESPONSES.indexOf( data[_err] ) > -1 ) {
      return true
    }
  }

  return false
}

/**
 * Determine if error response is user token rejection
 *
 * @param  {Object}  response
 * @return {Boolean}
 */
export const isUserRejected = ( response ) => {
  const { data } = response
  // check that response matches rejected criteria
  if ( !isResponseRejected ) {
    return false
  }

  // check if response matches any expected bad user responses
  for ( const _err in data ) {
    if ( USER_ERROR_RESPONSES.indexOf( data[_err] ) > -1 ) {
      return true
    }
  }

  return false
}

/**
 * Create interceptors for http service and provided store
 *
 * @param  {Function} dispatch    from store
 * @param  {Function} getState    from store
 * @param  {Object} [config={}]
 * @return {void}
 */
export const createInterceptors = ( client, { dispatch, getState }, appConfig = {} ) => {

  client.interceptors.request.use(
    ( config ) => {
      const shortToken = sessionStorage.getItem( STORED_TOKEN )
      let token = localStorage.getItem( STORED_TOKEN )
      if ( shortToken ) token = shortToken

      // Set Authorization header with token
      if ( token ) {
        config.headers.Authorization = 'Bearer ' + token
      }

      return config
    },
    ( error ) => {
      // Do something with request error

      return Promise.reject( error )
    }
  )

  client.interceptors.response.use(
    ( response ) => {
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
    },
    ( error ) => {
      const { onSessionReject, afterSessionReject, onUserReject } = appConfig
      // catch jwt rejection responses from api
      if ( isTokenRejected( error.response ) ) {
        // always tear down token
        dispatch( setToken( '' ) )
        if ( onSessionReject ) {
          dispatch( onSessionReject() )
        } else {
          dispatch( jwtRejected( afterSessionReject ) )
        }
      // catch jwt rejection specific to bad user
      } else if ( isUserRejected( error.response ) ) {
        // always tear down token
        dispatch( setToken( '' ) )
        if ( onUserReject ) {
          dispatch( onUserReject() )
        }
      }

      return Promise.reject( error )
    }
  )
}
