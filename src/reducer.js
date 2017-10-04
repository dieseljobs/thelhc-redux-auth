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

const createReducer = () => {

  const behaviors = {
    [SET_ASYNC_IN_PROGRESS]( state, { val } ) {
      return update( state, {
        asyncInProgress: {
          $set: val
        }
      })
    },
    [SET_IS_CHECKING]( state, { val } ) {
      return update( state, {
        isChecking: {
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
    [SET_AUTHENTICATED]( state, { val } ) {
      return update( state, {
        isAuthenticated: {
          $set: val
        }
      })
    },
    [EXPIRE_FLAG]( state, { val } ) {
      return update( state, {
        expireFlag: {
          $set: val
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

  const reducer = ( state = INITIAL_STATE, action ) => {
    const behavior = behaviors[action.type]

    return behavior ? behavior(state, action) : state
  }

  return reducer
}

export default createReducer
