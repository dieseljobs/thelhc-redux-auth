import { parseJwt } from 'lhc-js-lib'
import * as types from './actionTypes'
import { STORED_TOKEN,
         STORED_TOKEN_CHECKED,
         STORED_USER,
         STORED_SPOOF_USER } from './constants'
import { checkForUserPromise } from './promises'

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

export const authenticateUser = ( user ) => {
  return ( dispatch ) => {
    dispatch( setUser( user ) )
    dispatch( setAuthenticated( true ) )
  }
}

export const jwtToStore = ( token, next ) => {
  return ( dispatch ) => {
    console.log('jwtToStore')
    const claims = parseJwt( token, 1 )
    const { usr, spoof } = claims
    console.log(claims)

    dispatch( setToken( token ) )
    // catch user
    if ( usr ) {
      dispatch( authenticateUser( usr ) )
    }
    // catch spoof user
    if ( spoof ) {
      dispatch( setSpoofUser( spoof ) )
    }

    if ( next ) {
      dispatch( next( token ) )
    }
    console.log('jwttoredux done')
  }
}

export const jwtRejected = ( next ) => {
  return ( dispatch ) => {
    console.log('jwtRejected')
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






////// DEPRECATED ///////

/**
 * THUNK
 * Set User Authentication values from successful login/registration
 * If token argument isn't provided, we'll default to the token property of the
 * user object
 *
 * @param {object} user
 * @param {string|null} token
 * @return {function}
 */
export const setUserAuth = ( user, token = null ) => {
  return ( dispatch ) => {
    let _token = ( token ) ? token : user.token
    dispatch( setToken( _token ) )
    dispatch( setUser( user ) )
    dispatch( setAuthenticated( true ) )
  }
}

/**
 * THUNK
 * Check for authenticated user in existing stores
 * Should only be called on APP INIT ONLY!! to set auth and session values
 * from stored data that has not yet been stored in the redux state tree
 *
 * @NOTE The introduction of promises makes this a slightly confusing function.
 * The trickiness here is that we have authentication sessions stored on both
 * client-side and backend platforms.  Server-side sessions can be stored with
 * lots of data and explicit expirations, whereas we are fairly limited with
 * client-side storage nor do we have control over expiration.  Additionally,
 * our JSON Web Tokens are managed by yet another set of parameters.  Due to all
 * these disparities, we need to cover all bases to absolutely determine whether
 * or not a user is authenticated.
 *
 * @return {function}
 */
export const checkForUser = ( client, tokenEndpoint, userEndpoint ) => {
  return ( dispatch ) => {
    // Let our app know we've started the user checks
    dispatch( setIsChecking( true ) )

    // Check for stored spoof user and dispatch to set to state if found
    // We will still proceed with full user checks.  The spoof user
    // functionality is shallow, only existing throughout a window session
    const storedSpoofUser = sessionStorage.getItem( STORED_SPOOF_USER )
    if ( storedSpoofUser ) {
      dispatch( setSpoofUser( JSON.parse( storedSpoofUser ) ) )
    }


    // Dispatch the setUserAuth() action with resolved arguments [user [, token]]
    // Let app know we're done checking
    return checkForUserPromise( client, tokenEndpoint, userEndpoint )
      .then( ( resolvedArgs ) => {
        dispatch( setUserAuth( ...resolvedArgs ) )
        dispatch( setIsChecking( false ) )
      })
      .catch( ( err ) => {
        //console.log('promise err>>>>', err)
        // We found nothing
        // Let app know we're done checking
        dispatch( setIsChecking( false ) )
      })
  }
}

/**
 * THUNK
 * Reset authorization values
 *
 * @param {bool}  expireFlag
 * @return {function}
 */
export const resetAuth = ( expireFlag = false ) => {
  return ( dispatch, getState ) => {
    const { auth: { spoofUser } } = getState()

    if ( spoofUser ) {
      dispatch( setSpoofUser('') )
    } else {
      dispatch( setAuthenticated( false ) )
      dispatch( setUser({
      }) )
      // set token to blank ("") instead of null
      // app init defaults to null, setting to blank will trigger observer and
      // ensure token gets deleted from local storage
      dispatch( setToken( '' ) )
    }

    // if expireFlag is present, we're going to send a flag, then undo it
    // this will send one-time signal we can pick up in an observer
    if ( expireFlag ) {
      dispatch( expire( true ) )
      dispatch( expire( false ) )
    }
  }
}

/**
 * Spoof user action
 * Returns Promise
 *
 * @param  {string} endpoint
 * @param  {object} params
 * @return {function}
 */
export const spoofUser = ( client, endpoint, params ) => {
  return ( dispatch ) => {
    return client.post( endpoint, params )
        .then( ( response ) => {
          dispatch( setSpoofUser( response.data ) )

          return Promise.resolve( response.data )
        })
        .catch( ( error ) => {
          return Promise.reject( error.response.data )
        })
  }
}
