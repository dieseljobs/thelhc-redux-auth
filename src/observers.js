import { observer } from 'redux-observers'
import { parseJwt, setAndBroadcastSession, removeAndBroadcastSession } from 'lhc-js-lib'
import { STORED_TOKEN } from './constants'

/**
 * Store token in local storage 
 * 
 * @param  {String} token 
 * @return {void}       
 */
export const storeToken = ( token ) => {
  // set remember var, default to true in case claim is not present
  const claims = parseJwt( token, 1 )
  const rem = claims.hasOwnProperty( 'rem' ) ? claims.rem : true

  // sync token to localStorage if remembering
  if ( rem ) {
    // check and remove sessionStorage if present
    if ( sessionStorage.getItem( STORED_TOKEN ) ) {
      removeAndBroadcastSession( STORED_TOKEN )
    }
    // set token to localStorage
    localStorage.setItem( STORED_TOKEN, token )
  // else sync token to sessionStorage if not remembering
  } else {
    // set sessionStorage
    setAndBroadcastSession( STORED_TOKEN, token )
  }
}

/**
 * Observe the state of token.  If anything changes, update the locally
 * stored object
 *
 * @type {function}
 */
const tokenObserver = observer(
  state => { return state.auth.token },
  ( dispatch, current, previous ) => {
    // if token present
    if ( current ) {
      storeToken( current )
    // else remove locally stored values if token reset (empty|null)
    } else {
      // remove sessionStorage if present
      if ( sessionStorage.getItem( STORED_TOKEN ) ) {
        removeAndBroadcastSession( STORED_TOKEN )
      }
      // remove localStorage if present
      if ( localStorage.getItem( STORED_TOKEN ) ) {
        localStorage.removeItem( STORED_TOKEN )
      }
    }
  }
)

export const observers = [ tokenObserver ]

export default [ tokenObserver ]
