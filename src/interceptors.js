import { TOKEN_ERROR_RESPONSES, USER_ERROR_RESPONSES } from './constants'
import { jwtToStore, jwtRejected, setToken } from './actions'
import { getTokenFromStorage } from './utils'
import { selectToken } from './selectors'

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
 * @param  {Object} httpClient
 * @param  {Function} dispatch    passed from action or store object
 * @param  {Object} [config={}]
 * @return {void}
 */
export const createInterceptors = ( httpClient, { dispatch, getState }, callbacks = {} ) => {

  httpClient.interceptors.request.use(
    ( config ) => {
      let token
      if ( typeof localStorage !== 'undefined' ) {
        token = getTokenFromStorage()
      } else {
        token = selectToken( getState() )
      }
      
      // Set Authorization header with token
      if ( token ) {
        config.headers.Authorization = 'Bearer ' + token
      }

      return config
    },
    ( error ) => {
      return Promise.reject( error )
    }
  )

  httpClient.interceptors.response.use(
    ( response ) => {
      /*
      // Look for token in response body
      if ( response.data && response.data.token ) {
        const { data: { token } } = response
        dispatch( jwtToStore( token ) )
      }
      */
      // look for refreshed auth token in headers
      if ( response.headers && response.headers.authorization ) {
        const token = response.headers.authorization.replace( /Bearer\s/, '' )
        dispatch( jwtToStore( token ) )
      }

      return response
    },
    ( error ) => {
      const { onSessionReject, afterSessionReject, onUserReject } = callbacks
      // catch jwt rejection responses from api
      if ( error.response && isTokenRejected( error.response ) ) {
        // always tear down token
        dispatch( setToken( '' ) )
        // run custom reject action if provided
        if ( onSessionReject ) {
          dispatch( onSessionReject() )
        // otherwise run default reject action and pass afterSessionReject if defined
        } else {
          dispatch( jwtRejected( afterSessionReject ) )
        }
      // catch jwt rejection specific to bad user
      } else if ( error.response && isUserRejected( error.response ) ) {
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
