import {
  SET_ASYNC_IN_PROGRESS,
  SET_IS_CHECKING,
  SET_TOKEN,
  SET_USER,
  SET_AUTHENTICATED,
  SET_SPOOF_USER,
  EXPIRE_FLAG
} from './actionTypes'
import { INITIAL_STATE } from './constants'

const behaviors = {
  [SET_ASYNC_IN_PROGRESS]( state, { val } ) {
    return Object.assign({}, state, {
      asyncInProgress: val
    })
  },
  [SET_TOKEN]( state, { token } ) {
    return Object.assign({}, state, {
      token
    })
  },
  [SET_USER]( state, { user } ) {
    return Object.assign({}, state, {
      user
    })
  },
  [SET_SPOOF_USER]( state, { user } ) {
    return Object.assign({}, state, {
      spoofUser: user
    })
  }
}

export const reducer = ( state = INITIAL_STATE, action ) => {
  const behavior = behaviors[action.type]

  return behavior ? behavior(state, action) : state
}

export default reducer
