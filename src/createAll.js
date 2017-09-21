import appInitializer from './appInitializer'
import * as actions from './actions'
import * as actionTypes from './actionTypes'
import * as constants from './constants'
import createInterceptors from './interceptors'
import createReducer from './reducer'
import observers from './observers'
import * as selectors from './selectors'


const createAll = () => {
  return {
    appInitializer,
    actionTypes,
    ...actions,
    ...constants,
    createInterceptors,
    reducer: createReducer(),
    observers,
    ...selectors
  }
}

export default createAll
