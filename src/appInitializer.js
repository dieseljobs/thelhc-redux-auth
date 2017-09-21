import { STORED_TOKEN, STORED_USER } from './constants'
import { jwtToStore } from './actions'
import createInterceptors from './interceptors'

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

  const shortToken = sessionStorage.getItem( STORED_TOKEN )
  let token = localStorage.getItem( STORED_TOKEN )
  if ( shortToken ) token = shortToken
  // @TODO make sure token is not expired
  // stored token present, return self-resolving promise
  if ( token ) {
    return new Promise( ( resolve, reject ) => {
      console.log('dispatch stored jwt to redux')
      store.dispatch( jwtToStore( token, afterSessionSuccess ) )
      createInterceptors( client, store, config )

      resolve( 'ok' )
    })
  // else request new access token
  } else {
    return client.post( url, {
      client_id: clientId
    })
      .then( response => {
        const { data: { token } } = response
        console.log('dispatch new jwt to redux')
        store.dispatch( jwtToStore( token, afterSessionSuccess ) )
        createInterceptors( client, store, config )

        return 'ok'
      })
      .catch( error => {
        return error
      })
  }
}

export default appInitializer
