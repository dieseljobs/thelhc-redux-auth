import { observer } from 'redux-observers'
import { parseJwt } from 'lhc-js-lib'
import { STORED_TOKEN } from './constants'

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
      // set remember var, default to true in case claim is not present
      const claims = parseJwt( current, 1 )
      const rem = claims.hasOwnProperty( 'rem' ) ? claims.rem : true

      // sync token to localStorage if remembering
      if ( rem ) {
        // check and remove sessionStorage if present
        if ( sessionStorage.getItem( STORED_TOKEN ) ) {
          sessionStorage.removeItem( STORED_TOKEN )
        }
        // set token to localStorage
        localStorage.setItem( STORED_TOKEN, current )
      // else sync token to sessionStorage if not remembering
      } else {
        // set sessionStorage
        sessionStorage.setItem( STORED_TOKEN, current )
      }
    // else remove locally stored values if token reset (empty|null)
    } else {
      // remove sessionStorage if present
      if ( sessionStorage.getItem( STORED_TOKEN ) ) {
        sessionStorage.removeItem( STORED_TOKEN )
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
