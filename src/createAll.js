import appInitializer from './appInitializer'
import * as actions from './actions'
import * as actionTypes from './actionTypes'
import * as constants from './constants'
import * as interceptors from './interceptors'
import createReducer from './reducer'
import observers from './observers'
import * as selectors from './selectors'
import * as utils from './utils'

const createAll = () => {
  return {
    appInitializer,
    actionTypes,
    ...actions,
    ...constants,
    ...interceptors,
    reducer: createReducer(),
    observers,
    ...selectors,
    ...utils
  }
}

export default createAll
