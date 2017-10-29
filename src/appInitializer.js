import { jwtToStore } from './actions'
import { createInterceptors } from './interceptors'
import { getTokenFromStorage, isTokenRefreshable } from './utils'

/**
 * Initialize app promise
 *
 * @return {Promise}
 */
const appInitializer = ( config ) => {
  if ( !config ) throw "Error: missing configuration appInitializer()"
  const { client,
          store,
          url,
          clientId,
          afterSessionSuccess,
          onSessionReject,
          afterSessionReject } = config

  if ( !client ) throw "Error: missing 'client' property in appInitializer config"
  if ( !store ) throw "Error: missing 'store' property in appInitializer config"
  if ( !url ) throw "Error: missing 'url' property in appInitializer config"
  if ( !clientId ) throw "Error: missing 'clientId' property in appInitializer config"

  return new Promise( ( resolve, reject ) => {
    const token = getTokenFromStorage()
    // stored token present and not too old to refresh
    // return self-resolving promise
    if ( token && isTokenRefreshable( token )) {
      // dispatch token to store
      store.dispatch( jwtToStore( token, afterSessionSuccess ) )
      // setup interceptors
      createInterceptors( client, store, config )
      // resolve promise
      resolve( 'ok' )
    // else request new access token
    } else {
      client.post( url, {
        client_id: clientId
      })
        .then( response => {
          const { data: { token } } = response
          // dispatch token to store
          store.dispatch( jwtToStore( token, afterSessionSuccess ) )
          // setup interceptors
          createInterceptors( client, store, config )
          // resolve promise
          resolve( 'ok' )
        })
        .catch( error => {
          // reject promise with error
          reject( error )
        })
    }
  })
}

export default appInitializer
