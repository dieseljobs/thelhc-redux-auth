import { parseJwt } from 'lhc-js-lib'
import * as types from './actionTypes'

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
 * Set authenticated value action creator
 *
 * @param {bool} val
 * @return {object}
 */
export const setAuthenticated = ( val ) => {
  return ({
    type: types.SET_AUTHENTICATED,
    val
  })
}

/**
 * Update expireFlag value action creator
 *
 * @param  {bool} val
 * @return {object}
 */
export const expire = ( val ) => {
  return ({
    type: types.EXPIRE_FLAG,
    val
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
 * Authenticate user thunk
 *
 * @param  {Object} user
 * @return {Function}
 */
export const authenticateUser = ( user ) => {
  return ( dispatch ) => {
    dispatch( setUser( user ) )
    dispatch( setAuthenticated( true ) )
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
  return ( dispatch ) => {
    const claims = parseJwt( token, 1 )
    const { usr, spoof } = claims
    // console.log(claims)
    dispatch( setToken( token ) )
    // catch user
    if ( usr ) {
      dispatch( authenticateUser( usr ) )
    }
    // catch spoof user
    if ( spoof ) {
      dispatch( setSpoofUser( spoof ) )
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
    dispatch( setAuthenticated( false ) )
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
