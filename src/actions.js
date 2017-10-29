import { parseJwt } from 'lhc-js-lib'
import * as types from './actionTypes'
import { isAuthenticated, isSpoof } from './selectors'

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



////// DEPRECATED //////

/**
 * Set isChecking value action creator
 *
 * @param {bool} val
 */
export const setIsChecking = ( val ) => {
  return ({
    type: types.SET_IS_CHECKING,
    val
  })
}
