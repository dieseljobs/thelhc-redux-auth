import createAll from './createAll'

export const {
  actionTypes,
  checkForUser,
  createInterceptors,
  observers,
  reducer,
  resetAuth,
  selectors,
  setAuthenticated,
  setIsChecking,
  setToken,
  setUser,
  setUserAuth,
  spoofUser
} = createAll()
