import update from 'immutability-helper'
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
    return update( state, {
      asyncInProgress: {
        $set: val
      }
    })
  },
  [SET_TOKEN]( state, { token } ) {
    return update( state, {
      token: {
        $set: token
      }
    })
  },
  [SET_USER]( state, { user } ) {
    return update( state, {
      user: {
        $set: user
      }
    })
  },
  [SET_SPOOF_USER]( state, { user } ) {
    return update( state, {
      spoofUser: {
        $set: user
      }
    })
  }
}

export const reducer = ( state = INITIAL_STATE, action ) => {
  const behavior = behaviors[action.type]

  return behavior ? behavior(state, action) : state
}

export default reducer
