import update from 'immutability-helper'
import {
  SET_IS_CHECKING,
  SET_TOKEN,
  SET_USER,
  SET_AUTHENTICATED,
  SET_SPOOF_USER,
  EXPIRE_FLAG
} from './actionTypes'

const createReducer = () => {

  const initialState = {
    isAuthenticated: false,
    isChecking: false,
    token: null,
    expireFlag: false,
    user: {
    }
  }

  const behaviors = {
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

  const reducer = ( state = initialState, action ) => {
    const behavior = behaviors[action.type]

    return behavior ? behavior(state, action) : state
  }

  return reducer
}

export default createReducer
