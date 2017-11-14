import { parseJwt } from 'lhc-js-lib'
import * as types from './actionTypes'
import { isAuthenticated, isSpoof } from './selectors'
import { getTokenFromStorage, isTokenRefreshable } from './utils'
import { createInterceptors } from './interceptors'

/**
 * Set asyncInProgress value action creator
 *
 * @param {bool} val
 */
export const setAsyncInProgress = ( val ) => {
  return ({
    type: types.SET_ASYNC_IN_PROGRESS,
    val
  })
}

/**
 * Set session token action creator
 *
 * @param {string} token
 * @return {object}
 */
export const setToken = ( token ) => {
  return ({
    type: types.SET_TOKEN,
    token
  })
}

/**
 * Set user action creator
 *
 * @param {object} user
 * @return {object}
 */
export const setUser = ( user ) => {
  return ({
    type: types.SET_USER,
    user
  })
}

/**
 * Set the spoof user
 *
 * @param {Object} user
 * @return {Object}
 */
export const setSpoofUser = ( user ) => {
  return {
    type: types.SET_SPOOF_USER,
    user
  }
}

/**
 * Retrieve token 
 * Get from storage if present ( and not expired ) or issue request to tokenUrl
 * 
 * @param  {Object} httpClient  
 * @param  {String} tokenUrl    
 * @param  {Object} tokenParams 
 * @return {Promise}             
 */
export const retrieveToken = ( httpClient, tokenUrl, tokenParams ) => {
  return dispatch => {
    return new Promise( ( resolve, reject ) => {
      if ( !httpClient ) throw "Error: undefined httpClient argument in 'retrieveToken'"
      if ( !tokenUrl ) throw "Error: undefined tokenUrl argument in 'retrieveToken'"
      
      const token = getTokenFromStorage()
      // stored token present and not too old to refresh
      // return self-resolving promise
      if ( token && isTokenRefreshable( token )) {
        resolve( token )
      // else request new access token
      } else {
        httpClient.post( tokenUrl, tokenParams )
          .then( response => {
            const { data: { token } } = response
            resolve( token )
          })
          .catch( error => {
            // reject promise with error
            reject( error )
          })
      }
    })
  }
}

/**
 * Resolve token 
 * Get token from storage or access url, then store and setup interceptors
 * 
 * @param  {Object} httpClient  
 * @param  {String} tokenUrl    
 * @param  {Object} tokenParams 
 * @param  {Object} [callbacks={}] 
 * @return {Promise}                
 */
export const resolveToken = ( httpClient, tokenUrl, tokenParams, callbacks = {} ) => {
  return dispatch => {
    if ( !httpClient ) throw "Error: undefined httpClient argument in 'retrieveToken'"
    if ( !tokenUrl ) throw "Error: undefined tokenUrl argument in 'retrieveToken'"
    // start asyncInProgress
    dispatch( setAsyncInProgress( true ) )
    return dispatch( retrieveToken( httpClient, tokenUrl, tokenParams ) )
      .then( token => {
        const afterSessionSuccess = callbacks.afterSessionSuccess || null
        dispatch( jwtToStore( token, afterSessionSuccess ) )
        dispatch( setAsyncInProgress( false ) )
      })
      .catch( err => {
        dispatch( setAsyncInProgress( false ) )
      })
  }
}

/**
 * Configure interceptors on httpclient 
 * 
 * @param  {Object} httpClient     
 * @param  {Object} [callbacks={}] 
 * @return {void}                
 */
export const configureInterceptors = ( httpClient, callbacks = {} ) => {
  return dispatch => {
    if ( !httpClient ) throw "Error: undefined httpClient argument in 'retrieveToken'"
    createInterceptors( httpClient, { dispatch }, callbacks )
  }
}

/**
 * Push JWT claims to store
 *
 * @param  {String}   token
 * @param  {mixed} next
 * @return {Function}
 */
export const jwtToStore = ( token, next = null ) => {
  return ( dispatch, getState ) => {
    const state = getState()
    const userPresent = isAuthenticated( state )
    const spoofPresent = isSpoof( state )
    const claims = parseJwt( token, 1 )
    const { usr, spoof } = claims
    // console.log(claims)
    dispatch( setToken( token ) )
    // catch user
    if ( usr ) {
      dispatch( setUser( usr ) )
    } else if ( !usr && userPresent ){
      dispatch( setUser( {} ) )
    }
    // catch spoof user
    if ( spoof ) {
      dispatch( setSpoofUser( spoof ) )
    } else if ( !spoof && spoofPresent ) {
      dispatch( setSpoofUser( {} ) )
    }
    // dispatch 'after' callback if present
    if ( next ) {
      dispatch( next( token ) )
    }
  }
}

/**
 * Reset store after rejected JWT
 *
 * @param  {Function} next
 * @return {Function}
 */
export const jwtRejected = ( next ) => {
  return ( dispatch ) => {
    dispatch( setUser({
    }) )
    // set token to blank ("") instead of null
    // app init defaults to null, setting to blank will trigger observer and
    // ensure token gets deleted from local storage
    dispatch( setToken( '' ) )

    if ( next ) {
      dispatch( next() )
    }
  }
}

