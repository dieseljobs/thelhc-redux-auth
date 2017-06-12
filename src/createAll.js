import * as actions from './actions'
import * as actionTypes from './actionTypes'
import createInterceptors from './interceptors'
import createReducer from './reducer'
import observers from './observers'
import * as selectors from './selectors'

const createAll = () => {
  return {
    actionTypes,
    ...actions,
    createInterceptors,
    reducer: createReducer(),
    observers,
    ...selectors
  }
}

export default createAll
