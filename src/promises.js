import { USER_TOKEN,
          USER_TOKEN_CHECKED,
          STORED_USER,
          STORED_SPOOF_USER } from './constants'

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
const getTokenPromise = ( client, tokenEndpoint ) => {
  return new Promise( ( resolve, reject ) => {

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
              //dispatch( setToken( token ) )
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
}

/**
 * Promise - look for stored user object in storage (short-term)
 * If user exists in storage, we can safely assume this is a fresh
 * session and we will resolve with the parsed, stored user object.
 * Or reject if not found in storage
 *
 * @type {Promise}
 */
const getUserFromStoragePromise = () => {
  return new Promise( ( resolve, reject ) => {
    const storedUser = sessionStorage.getItem( STORED_USER )
    if ( storedUser ) {
      resolve( JSON.parse( storedUser ) )
    } else {
      reject( 'no user in session' )
    }
  })
}

/**
 * Check for authenticated user Promise.
 * Ultimately we want to resolve with an array containing a user object and
 * an optional token to store, or we want to reject if we've determined there
 * is no stored authentication information available.
 *
 * @type {Promise}
 */
export const checkForUserPromise = ( client, tokenEndpoint, userEndpoint ) => {
  return new Promise( ( resolve, reject ) => {

    // If we're able to retrieve a token
    getTokenPromise( client, tokenEndpoint )
      .then( ( token ) => {
        // If we have a token and a user object, we've got everything we need!
        // Since we have successfully retrieved our user object from storage,
        // we're going to resolve with a final resolution containing the token
        // just in case it has refreshed since the user was last stored.  ( see
        // setUserAuth action)

        getUserFromStoragePromise().then( ( user ) => {
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
}
