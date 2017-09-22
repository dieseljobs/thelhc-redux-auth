import appInitializer from './appInitializer'
import * as actions from './actions'
import * as actionTypes from './actionTypes'
import * as constants from './constants'
import * as interceptors from './interceptors'
import createReducer from './reducer'
import observers from './observers'
import * as selectors from './selectors'


const createAll = () => {
  return {
    appInitializer,
    actionTypes,
    ...actions,
    ...constants,
    ...interceptors,
    reducer: createReducer(),
    observers,
    ...selectors
  }
}

export default createAll
