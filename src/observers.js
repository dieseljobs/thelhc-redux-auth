import { observer } from 'redux-observers'
import { USER_TOKEN, STORED_USER, STORED_SPOOF_USER } from './constants'

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
      localStorage.setItem( USER_TOKEN, current )
    } else {
      let storedToken = localStorage.getItem( USER_TOKEN )
      if ( storedToken ) {
        localStorage.removeItem( USER_TOKEN )
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
    if ( current ) {
      sessionStorage.setItem( STORED_USER, JSON.stringify( current ) )
    } else {
      let storedUser = sessionStorage.getItem( STORED_USER )
      if ( storedUser ) {
        sessionStorage.removeItem( STORED_USER )
      }
    }
  }
)

const authSpoofUserObserver = observer(
 state => { return state.auth.spoofUser },
 ( dispatch, current ) => {
   if ( current ) {
     sessionStorage.setItem( STORED_SPOOF_USER, JSON.stringify( current ) )
   } else {
     let storedUser = sessionStorage.getItem( STORED_SPOOF_USER )
     if ( storedUser ) {
       sessionStorage.removeItem( STORED_SPOOF_USER )
     }
   }
 }
)

export default [tokenObserver, authUserObserver, authSpoofUserObserver]
