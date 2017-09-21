import { observer } from 'redux-observers'
import { setAndBroadcastSession, removeAndBroadcastSession } from 'lhc-js-lib'
import { STORED_TOKEN, STORED_USER, STORED_SPOOF_USER } from './constants'

/**
 * Observe the state of token.  If anything changes, update the locally
 * stored object
 *
 * @type {function}
 */
const tokenObserver = observer(
  state => { return state.auth.token },
  ( dispatch, current ) => {
    if ( current ) {
      localStorage.setItem( STORED_TOKEN, current )
    } else {
      let storedToken = localStorage.getItem( STORED_TOKEN )
      if ( storedToken ) {
        localStorage.removeItem( STORED_TOKEN )
      }
    }
  }
)

/**
 * Observe the state of the authenticated user.  If anything changes, update the
 * locally stored object
 *
 * @type {function}
 */
const authUserObserver = observer(
  state => { return state.auth.user },
  ( dispatch, current ) => {
    if ( Object.keys( current ).length ) {
      setAndBroadcastSession( STORED_USER, current )
    } else {
      let storedUser = sessionStorage.getItem( STORED_USER )
      if ( storedUser ) {
        removeAndBroadcastSession( STORED_USER )
      }
    }
  }
)

/**
 * Observe the state of the spoofed user.
 *
 * @type {function}
 */
const authSpoofUserObserver = observer(
 state => { return state.auth.spoofUser },
 ( dispatch, current ) => {
   if ( Object.keys( current ).length ) {
     setAndBroadcastSession( STORED_SPOOF_USER, current )
   } else {
     let storedUser = sessionStorage.getItem( STORED_SPOOF_USER )
     if ( storedUser ) {
       removeAndBroadcastSession( STORED_SPOOF_USER )
     }
   }
 }
)

export default [tokenObserver, authUserObserver, authSpoofUserObserver]
