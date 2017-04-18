import * as types from './actionTypes'
import { USER_TOKEN,
          USER_TOKEN_CHECKED,
          STORED_USER,
          STORED_SPOOF_USER } from './constants'

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

    /**
     * Check for authenticated user Promise.
     * Ultimately we want to resolve with an array containing a user object and
     * an optional token to store, or we want to reject if we've determined there
     * is no stored authentication information available.
     *
     * @type {Promise}
     */
    const checkForUserPromise = new Promise( ( resolve, reject ) => {
      /**
       * Check for JSON Web Token Promise
       * First check if our token is in localStorage
       * If not, we'll send a GetToken API request to double-check for a token
       * from the backend.  We'll also make sure to flag that we made this check
       * by setting USER_TOKEN_CHECKED in sessionStorage so as not make this request
       * on subsequent page views.
       * If found in storage of get request, we will resolve with the token.
       * Else we will reject
       *
       * @type {Promise}
       */
      const getTokenPromise = new Promise( ( resolve, reject ) => {

        const storedToken = localStorage.getItem( USER_TOKEN )
        if ( storedToken ) {
          resolve( storedToken )
        } else {
          if ( sessionStorage.getItem( USER_TOKEN_CHECKED ) ) {
            reject( 'no token' )
          } else {
            client.get( tokenEndpoint )
              .then( ( response ) => {
                // we're expecting a 200 response with either a token object in
                // the response if authenticated, or an empty response if not
                sessionStorage.setItem( USER_TOKEN_CHECKED, 1 )
                if ( response.data.token ) {
                  const { token } = response.data
                  // dispatching to setToken will work some magic, including
                  // setting to localStorage for us
                  dispatch( setToken( token ) )
                  resolve( token )
                } else {
                  reject( 'no token' )
                }
              })
              .catch( () => {
                sessionStorage.setItem( USER_TOKEN_CHECKED, 1 )
                reject( 'no token' )
              })
          }
        }
      })
      // If we're able to retrieve a token
      getTokenPromise.then( ( token ) => {
        /**
         * Promise - look for stored user object in storage (short-term)
         * If user exists in storage, we can safely assume this is a fresh
         * session and we will resolve with the parsed, stored user object.
         * Or reject if not found in storage
         *
         * @type {Promise}
         */
        const getUserFromStoragePromise = new Promise( ( resolve, reject ) => {
          const storedUser = sessionStorage.getItem( STORED_USER )
          if ( storedUser ) {
            resolve( JSON.parse( storedUser ) )
          } else {
            reject( 'no user in session' )
          }
        })
        // If we have a token and a user object, we've got everything we need!
        // Since we have successfully retrieved our user object from storage,
        // we're going to resolve with a final resolution containing the token
        // just in case it has refreshed since the user was last stored.  ( see
        // setUserAuth action)
        getUserFromStoragePromise.then( ( user ) => {
          resolve( [ user, token ] )
        })
        .catch( () => {
          // We have a token but no user object stored, so now we know we're
          // starting a new client-side auth session.  We're going to fetch a
          // fresh user from the getUser API to make sure the user is still
          // authenticated in the backend as well refreshing the stored token.
          // Our interceptors will handle updating the new token in storage
          client.get( userEndpoint )
            .then( response => {
              resolve( [ response.data ] )
            })
            .catch( ( error ) => {
              reject( error.response )
            })
        })
      })
      .catch( () => {
        // We've turned every stone, no authenticated user data available
        reject( 'no authenticated user found' )
      })
    })

    // Dispatch the setUserAuth() action with resolved arguments [user [, token]]
    // Let app know we're done checking
    checkForUserPromise.then( ( resolvedArgs ) => {
      dispatch( setUserAuth( ...resolvedArgs ) )
      dispatch( setIsChecking( false ) )
    })
    .catch( () => {
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
